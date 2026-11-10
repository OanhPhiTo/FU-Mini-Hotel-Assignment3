import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import roomApi from '../../api/roomApi';
import { useAuth } from '../../contexts/AuthContext';
import AlertMessage from '../../components/common/AlertMessage';

export const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [keyword, setKeyword] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { isAuthenticated, isStaff } = useAuth();
  const navigate = useNavigate();

  // Selected room for detail modal
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Fetch Room Types on mount
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await roomApi.getRoomTypes();
        setRoomTypes(res.data || []);
      } catch (err) {
        console.error('Failed to load room types:', err);
      }
    };
    fetchTypes();
  }, []);

  // Fetch Rooms with filters
  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        keyword: keyword.trim() || undefined,
        roomTypeId: roomTypeId ? parseInt(roomTypeId) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        roomStatus: 1, // Only show active rooms for public guests by default
        page,
        size: 9,
      };

      const res = await roomApi.getAll(params);
      if (res.data) {
        setRooms(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [page, roomTypeId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchRooms();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setRoomTypeId('');
    setMaxPrice('');
    setPage(0);
    setTimeout(fetchRooms, 50);
  };

  const handleBookNow = (roomId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/booking/create`, search: `?roomId=${roomId}` } } });
    } else {
      navigate(`/booking/create?roomId=${roomId}`);
    }
  };

  return (
    <div className="container py-2">
      {/* Hero Banner */}
      <div className="p-4 p-md-5 mb-4 rounded-3 text-white hero-pastel shadow-sm position-relative overflow-hidden">
        <div className="col-lg-8 py-2">
          <span className="badge bg-white bg-opacity-25 text-white mb-2 px-3 py-2 fw-semibold text-uppercase">
            <i className="bi bi-stars me-1"></i> FUMiniHotel Hospitality
          </span>
          <h1 className="display-5 fw-bold">Welcome to FUMiniHotel</h1>
          <p className="lead mb-4 opacity-90">
            Discover serene hotel rooms, modern amenities, and unforgettable comfort designed with gentle pastel elegance.
          </p>
          {!isAuthenticated ? (
            <div className="d-flex gap-3">
              <Link to="/register" className="btn btn-light text-pastel-dark fw-semibold px-4 py-2 shadow-sm">
                Register & Book Online
              </Link>
              <Link to="/login" className="btn btn-outline-light px-4 py-2">
                Sign In
              </Link>
            </div>
          ) : !isStaff ? (
            <Link to="/booking/create" className="btn btn-light text-pastel-dark fw-semibold px-4 py-2 shadow-sm">
              <i className="bi bi-calendar-plus me-2"></i> Book a Room Now
            </Link>
          ) : null}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <form onSubmit={handleSearchSubmit} className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted mb-1">Search Rooms</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Room number or description..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1">Room Type</label>
              <select
                className="form-select"
                value={roomTypeId}
                onChange={(e) => setRoomTypeId(e.target.value)}
              >
                <option value="">All Room Types</option>
                {roomTypes.map((type) => (
                  <option key={type.roomTypeID} value={type.roomTypeID}>
                    {type.roomTypeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-semibold text-muted mb-1">Max Price ($)</label>
              <input
                type="number"
                min="0"
                step="5"
                className="form-control"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="col-md-3 d-flex gap-2">
              <button type="submit" className="btn btn-primary flex-grow-1">
                <i className="bi bi-funnel me-1"></i> Filter
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleResetFilters}
                title="Reset Filters"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      {/* Room Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading rooms...</span>
          </div>
          <p className="mt-2 text-muted">Searching available rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm my-4">
          <i className="bi bi-door-closed display-1 text-muted"></i>
          <h4 className="mt-3 fw-bold">No Rooms Found</h4>
          <p className="text-muted">No rooms match your filter criteria. Try adjusting the search filters.</p>
          <button className="btn btn-outline-primary" onClick={handleResetFilters}>
            View All Rooms
          </button>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {rooms.map((room) => (
              <div key={room.roomID} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 room-card">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge bg-pastel-blue text-pastel-dark px-3 py-2 fs-6 rounded-pill">
                        <i className="bi bi-door-closed me-1"></i> Room {room.roomNumber}
                      </span>
                      <span className="badge bg-pastel-green text-pastel-green-dark px-3 py-2 rounded-pill">
                        <i className="bi bi-check-circle-fill me-1"></i> Available
                      </span>
                    </div>

                    <h5 className="card-title fw-bold text-dark mb-1">
                      {room.roomType?.roomTypeName || 'Hotel Room'}
                    </h5>

                    <div className="mb-3">
                      <span className="fs-4 fw-bold text-pastel-primary">
                        ${room.roomPricePerDay}
                      </span>
                      <span className="text-muted small"> / day</span>
                    </div>

                    <div className="p-2 mb-3 rounded bg-pastel-subtle d-flex align-items-center justify-content-between text-muted small">
                      <span><i className="bi bi-people-fill text-pastel-primary me-1"></i> Max Guests:</span>
                      <strong className="text-dark">{room.roomMaxCapacity} persons</strong>
                    </div>

                    <p className="card-text text-secondary small flex-grow-1">
                      {room.roomDetailDescription || 'Comfortable and fully equipped room with modern facilities.'}
                    </p>

                    <div className="d-flex gap-2 pt-3 border-top border-pastel mt-2">
                      <button
                        type="button"
                        className="btn btn-outline-pastel btn-sm flex-grow-1"
                        onClick={() => setSelectedRoom(room)}
                      >
                        <i className="bi bi-info-circle me-1"></i> Details
                      </button>

                      {!isStaff && (
                        <button
                          type="button"
                          className="btn btn-pastel-primary btn-sm fw-semibold flex-grow-1"
                          onClick={() => handleBookNow(room.roomID)}
                        >
                          <i className="bi bi-calendar-check me-1"></i> Book Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-4 d-flex justify-content-center">
              <ul className="pagination">
                <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <li key={idx} className={`page-item ${page === idx ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(idx)}>
                      {idx + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage((p) => p + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      {/* Room Detail Modal */}
      {selectedRoom && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header bg-pastel-primary text-white">
                <h5 className="modal-title fw-bold">
                  🏨 Room {selectedRoom.roomNumber} – {selectedRoom.roomType?.roomTypeName}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedRoom(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <div className="badge bg-pastel-blue text-pastel-dark fs-6 me-2 px-3 py-2 rounded-pill">Room #{selectedRoom.roomNumber}</div>
                  <div className="badge bg-pastel-green text-pastel-green-dark fs-6 px-3 py-2 rounded-pill">Available</div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="p-3 border border-pastel rounded bg-pastel-subtle">
                      <div className="small text-muted">Daily Rate</div>
                      <div className="fs-5 fw-bold text-pastel-primary">${selectedRoom.roomPricePerDay} / day</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 border border-pastel rounded bg-pastel-subtle">
                      <div className="small text-muted">Maximum Capacity</div>
                      <div className="fs-5 fw-bold text-dark">{selectedRoom.roomMaxCapacity} Persons</div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold text-dark">Room Description</h6>
                  <p className="text-secondary small">
                    {selectedRoom.roomDetailDescription || 'No detailed description provided.'}
                  </p>
                </div>

                {selectedRoom.roomType && (
                  <div className="mb-3 p-3 bg-pastel-subtle rounded border border-pastel">
                    <h6 className="fw-bold mb-1 text-dark">Room Type: {selectedRoom.roomType.roomTypeName}</h6>
                    <div className="small text-muted mb-1">{selectedRoom.roomType.typeDescription}</div>
                    {selectedRoom.roomType.typeNote && (
                      <div className="small text-pastel-primary">
                        <i className="bi bi-info-circle me-1"></i> {selectedRoom.roomType.typeNote}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-footer border-pastel">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setSelectedRoom(null)}>
                  Close
                </button>
                {!isStaff && (
                  <button
                    type="button"
                    className="btn btn-pastel-primary fw-semibold"
                    onClick={() => {
                      const id = selectedRoom.roomID;
                      setSelectedRoom(null);
                      handleBookNow(id);
                    }}
                  >
                    <i className="bi bi-calendar-check me-1"></i> Proceed to Book
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomList;

