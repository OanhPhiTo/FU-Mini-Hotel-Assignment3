import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import roomApi from '../../api/roomApi';
import bookingApi from '../../api/bookingApi';
import { useAuth } from '../../contexts/AuthContext';
import AlertMessage from '../../components/common/AlertMessage';

export const CreateBooking = () => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Format today as YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Booking items state: list of { roomID, startDate, endDate }
  const [items, setItems] = useState([
    {
      roomID: '',
      startDate: todayStr,
      endDate: tomorrowStr,
    },
  ]);

  // Load rooms
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const res = await roomApi.getAll({ roomStatus: 1, size: 100 });
        const rooms = res.data?.content || [];
        setAvailableRooms(rooms);

        // Pre-select room if roomId was in query string
        const params = new URLSearchParams(location.search);
        const preSelectedId = params.get('roomId');
        if (preSelectedId && rooms.some((r) => r.roomID === parseInt(preSelectedId))) {
          setItems([
            {
              roomID: parseInt(preSelectedId),
              startDate: todayStr,
              endDate: tomorrowStr,
            },
          ]);
        } else if (rooms.length > 0) {
          setItems([
            {
              roomID: rooms[0].roomID,
              startDate: todayStr,
              endDate: tomorrowStr,
            },
          ]);
        }
      } catch (err) {
        setError('Failed to load available rooms: ' + err.message);
      } finally {
        setLoadingRooms(false);
      }
    };

    loadRooms();
  }, [location.search]);

  // Handle changing item properties
  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Add another room item
  const handleAddItem = () => {
    const nextRoom = availableRooms.find(
      (r) => !items.some((item) => item.roomID === r.roomID)
    ) || availableRooms[0];

    setItems((prev) => [
      ...prev,
      {
        roomID: nextRoom ? nextRoom.roomID : '',
        startDate: todayStr,
        endDate: tomorrowStr,
      },
    ]);
  };

  // Remove room item
  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Calculate estimated days and price for an item
  const calculateItemEstimates = (item) => {
    const room = availableRooms.find((r) => r.roomID === parseInt(item.roomID));
    if (!room || !item.startDate || !item.endDate) {
      return { days: 0, estimatedPrice: 0, room: null };
    }

    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    const diffTime = end - start;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return { days: 0, estimatedPrice: 0, room };
    }

    const estimatedPrice = days * parseFloat(room.roomPricePerDay);
    return { days, estimatedPrice, room };
  };

  // Calculate estimated total for all items
  const estimatedTotal = items.reduce((acc, item) => {
    const { estimatedPrice } = calculateItemEstimates(item);
    return acc + estimatedPrice;
  }, 0);

  // Submit Booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (items.length === 0) {
      setError('Please select at least one room.');
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.roomID) {
        setError(`Please select a room for slot #${i + 1}`);
        return;
      }
      if (!item.startDate || !item.endDate) {
        setError(`Start date and end date are required for slot #${i + 1}`);
        return;
      }
      if (item.startDate >= item.endDate) {
        setError(`Slot #${i + 1}: Check-out date must be after Check-in date.`);
        return;
      }
    }

    // Check duplicate rooms
    const selectedRoomIds = items.map((i) => parseInt(i.roomID));
    const uniqueIds = new Set(selectedRoomIds);
    if (uniqueIds.size !== selectedRoomIds.length) {
      setError('You have selected the same room multiple times. Please choose different rooms.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({
          roomID: parseInt(i.roomID),
          startDate: i.startDate,
          endDate: i.endDate,
        })),
      };

      const res = await bookingApi.create(payload);
      setSuccess('Your booking was created successfully! Total Price: $' + res.data.totalPrice);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to complete booking. Please review dates and room availability.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingRooms) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading available rooms...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-pastel-primary text-white p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold mb-1">🏨 Reserve Hotel Rooms Online</h4>
                  <p className="mb-0 text-white-50 small">
                    Customer: <strong className="text-white">{user?.fullName || user?.email}</strong>
                  </p>
                </div>
                <span className="badge bg-white bg-opacity-25 text-white px-3 py-2 fw-semibold rounded-pill">
                  Multi-Room Booking Supported
                </span>
              </div>
            </div>

            <div className="card-body p-4">
              <AlertMessage type="danger" message={error} onClose={() => setError('')} />
              <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Selected Rooms ({items.length})</h5>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={handleAddItem}
                      disabled={submitting}
                    >
                      <i className="bi bi-plus-circle me-1"></i> Add Another Room
                    </button>
                  </div>

                  {items.map((item, index) => {
                    const { days, estimatedPrice, room } = calculateItemEstimates(item);
                    return (
                      <div key={index} className="card bg-light border p-3 mb-3 position-relative">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-secondary">Room Slot #{index + 1}</span>
                          {items.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm py-0 px-2"
                              onClick={() => handleRemoveItem(index)}
                              title="Remove this room"
                            >
                              <i className="bi bi-trash"></i> Remove
                            </button>
                          )}
                        </div>

                        <div className="row g-3 align-items-end">
                          {/* Room Selection */}
                          <div className="col-md-5">
                            <label className="form-label small fw-semibold">Room</label>
                            <select
                              className="form-select"
                              value={item.roomID}
                              onChange={(e) => handleItemChange(index, 'roomID', e.target.value)}
                              required
                            >
                              <option value="">-- Choose a room --</option>
                              {availableRooms.map((r) => (
                                <option key={r.roomID} value={r.roomID}>
                                  Room {r.roomNumber} – {r.roomType?.roomTypeName} (${r.roomPricePerDay}/day, max {r.roomMaxCapacity}p)
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Check-in Date */}
                          <div className="col-md-3">
                            <label className="form-label small fw-semibold">Check-in Date</label>
                            <input
                              type="date"
                              min={todayStr}
                              className="form-control"
                              value={item.startDate}
                              onChange={(e) => handleItemChange(index, 'startDate', e.target.value)}
                              required
                            />
                          </div>

                          {/* Check-out Date */}
                          <div className="col-md-3">
                            <label className="form-label small fw-semibold">Check-out Date</label>
                            <input
                              type="date"
                              min={item.startDate || todayStr}
                              className="form-control"
                              value={item.endDate}
                              onChange={(e) => handleItemChange(index, 'endDate', e.target.value)}
                              required
                            />
                          </div>

                          {/* Item Subtotal Calculation */}
                          <div className="col-md-1 text-end">
                            <div className="small text-muted">Days</div>
                            <div className="fw-bold">{days > 0 ? days : '-'}</div>
                          </div>
                        </div>

                        {room && days > 0 && (
                          <div className="mt-2 text-end small text-muted">
                            Daily Rate: ${room.roomPricePerDay} × {days} days ={' '}
                            <strong className="text-primary">${estimatedPrice.toFixed(2)}</strong>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Booking Summary Box */}
                <div className="p-3 bg-white border border-pastel rounded shadow-sm mb-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h6 className="fw-bold text-dark mb-1">Reservation Summary</h6>
                      <div className="small text-secondary">
                        <i className="bi bi-shield-check text-pastel-green-dark me-1"></i> Actual prices and availability are verified and calculated strictly by the secure backend server.
                      </div>
                    </div>
                    <div className="col-md-4 text-md-end mt-2 mt-md-0">
                      <div className="small text-muted">Estimated Total</div>
                      <div className="fs-3 fw-bold text-pastel-primary">${estimatedTotal.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate('/rooms')}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-pastel-primary px-5 fw-bold shadow-sm"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Confirming Reservation...
                      </>
                    ) : (
                      'Confirm & Reserve Room'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;

