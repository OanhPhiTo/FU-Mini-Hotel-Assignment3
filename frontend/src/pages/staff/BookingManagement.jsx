import React, { useState, useEffect } from 'react';
import bookingApi from '../../api/bookingApi';
import customerApi from '../../api/customerApi';
import roomApi from '../../api/roomApi';
import AlertMessage from '../../components/common/AlertMessage';

export const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modals
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  // Create Booking Modal for Staff
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [createForm, setCreateForm] = useState({
    customerID: '',
    items: [
      {
        roomID: '',
        startDate: todayStr,
        endDate: tomorrowStr,
      },
    ],
  });

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bookingApi.getAll({
        keyword: keyword.trim() || undefined,
        status: statusFilter ? parseInt(statusFilter) : undefined,
        page,
        size: 10,
      });
      if (res.data) {
        setBookings(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchBookings();
  };

  const handleOpenStatusModal = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.bookingStatus);
    setError('');
    setShowStatusModal(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setActionLoading(true);
    setError('');
    try {
      await bookingApi.updateStatus(selectedBooking.bookingReservationID, parseInt(newStatus));
      setSuccess(`Booking #${selectedBooking.bookingReservationID} status updated successfully!`);
      setShowStatusModal(false);
      fetchBookings();
    } catch (err) {
      setError(err.message || 'Failed to update booking status');
    } finally {
      setActionLoading(false);
    }
  };

  // Prepare staff create booking modal
  const handleOpenCreateModal = async () => {
    setError('');
    try {
      const [custRes, roomRes] = await Promise.all([
        customerApi.getAll({ size: 100 }),
        roomApi.getAll({ roomStatus: 1, size: 100 }),
      ]);
      setCustomerList(custRes.data?.content || []);
      setAvailableRooms(roomRes.data?.content || []);

      setCreateForm({
        customerID: custRes.data?.content?.[0]?.customerID || '',
        items: [
          {
            roomID: roomRes.data?.content?.[0]?.roomID || '',
            startDate: todayStr,
            endDate: tomorrowStr,
          },
        ],
      });
      setShowCreateModal(true);
    } catch (err) {
      setError('Failed to load customers or rooms: ' + err.message);
    }
  };

  const handleItemChange = (index, field, value) => {
    setCreateForm((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = { ...nextItems[index], [field]: value };
      return { ...prev, items: nextItems };
    });
  };

  const handleAddItem = () => {
    setCreateForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          roomID: availableRooms[0]?.roomID || '',
          startDate: todayStr,
          endDate: tomorrowStr,
        },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    if (createForm.items.length <= 1) return;
    setCreateForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleStaffCreateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    try {
      const payload = {
        customerID: parseInt(createForm.customerID),
        items: createForm.items.map((i) => ({
          roomID: parseInt(i.roomID),
          startDate: i.startDate,
          endDate: i.endDate,
        })),
      };

      await bookingApi.create(payload);
      setSuccess('Reservation created successfully on behalf of customer!');
      setShowCreateModal(false);
      fetchBookings();
    } catch (err) {
      setError(err.message || 'Failed to create reservation');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return <span className="badge bg-pastel-green text-pastel-green-dark px-2 py-1 rounded-pill">Confirmed</span>;
      case 2:
        return <span className="badge bg-pastel-blue text-pastel-dark px-2 py-1 rounded-pill">Completed</span>;
      case 3:
        return <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1 rounded-pill">Cancelled</span>;
      default:
        return <span className="badge bg-secondary px-2 py-1 rounded-pill">Status {status}</span>;
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-calendar-check-fill text-primary me-2"></i> Booking Management
          </h2>
          <p className="text-muted small mb-0">View all reservations, verify details, and manage booking statuses</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreateModal}>
          <i className="bi bi-calendar-plus me-1"></i> Create Booking for Guest
        </button>
      </div>

      <AlertMessage type="danger" message={error} onClose={() => setError('')} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

      {/* Filter and Search Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <form onSubmit={handleSearch} className="row g-2 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by customer name, email or telephone..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="1">1 - Confirmed (Active)</option>
                <option value="2">2 - Completed</option>
                <option value="3">3 - Cancelled</option>
              </select>
            </div>

            <div className="col-md-4 d-flex gap-2">
              <button type="submit" className="btn btn-outline-primary flex-grow-1">
                Filter
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setKeyword('');
                  setStatusFilter('');
                  setPage(0);
                  setTimeout(fetchBookings, 50);
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-pastel">
              <tr>
                <th scope="col" className="ps-3">#ID</th>
                <th scope="col">Customer</th>
                <th scope="col">Booking Date</th>
                <th scope="col">Rooms Reserved</th>
                <th scope="col">Total Price</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <div className="text-muted mt-2">Loading hotel reservations...</div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No reservations found matching your criteria.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.bookingReservationID}>
                    <td className="ps-3 fw-bold text-primary">#{b.bookingReservationID}</td>
                    <td>
                      <div className="fw-semibold">{b.customer?.customerFullName}</div>
                      <div className="small text-muted">{b.customer?.emailAddress} | {b.customer?.telephone}</div>
                    </td>
                    <td>{b.bookingDate}</td>
                    <td>
                      <span className="badge bg-light text-dark border me-1">
                        {b.bookingDetails?.length || 0} room(s)
                      </span>
                      {b.bookingDetails?.map((d) => `Room ${d.roomNumber}`).join(', ')}
                    </td>
                    <td className="fw-bold text-success fs-6">${parseFloat(b.totalPrice).toFixed(2)}</td>
                    <td>{getStatusBadge(b.bookingStatus)}</td>
                    <td className="text-end pe-3">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => setSelectedBooking(b)}
                        title="View Details"
                      >
                        <i className="bi bi-eye me-1"></i> Details
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleOpenStatusModal(b)}
                        title="Update Status"
                      >
                        <i className="bi bi-arrow-repeat me-1"></i> Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer bg-white d-flex justify-content-center py-3">
            <ul className="pagination mb-0">
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
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedBooking && !showStatusModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  🏨 Reservation Details – #{selectedBooking.bookingReservationID}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedBooking(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <div className="small text-muted">Customer Information</div>
                      <div className="fw-bold fs-5 text-dark">{selectedBooking.customer?.customerFullName}</div>
                      <div className="small text-secondary">{selectedBooking.customer?.emailAddress}</div>
                      <div className="small text-secondary">Tel: {selectedBooking.customer?.telephone}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <div className="small text-muted">Booking Overview</div>
                      <div>Booking Date: <strong>{selectedBooking.bookingDate}</strong></div>
                      <div>Status: {getStatusBadge(selectedBooking.bookingStatus)}</div>
                      <div className="mt-1">
                        Total Amount: <strong className="text-success fs-5">${parseFloat(selectedBooking.totalPrice).toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <h6 className="fw-bold mb-3">Room Booking Details ({selectedBooking.bookingDetails?.length || 0})</h6>
                <div className="table-responsive border rounded mb-3">
                  <table className="table table-striped align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Room</th>
                        <th>Type</th>
                        <th>Dates</th>
                        <th>Duration</th>
                        <th>Daily Rate</th>
                        <th className="text-end">Actual Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBooking.bookingDetails?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="fw-bold">Room {item.roomNumber}</td>
                          <td>
                            <span className="badge bg-secondary">{item.roomTypeName || 'N/A'}</span>
                          </td>
                          <td className="small">{item.startDate} → {item.endDate}</td>
                          <td>{item.numberOfDays} days</td>
                          <td>${parseFloat(item.roomPricePerDay).toFixed(2)}</td>
                          <td className="text-end fw-bold text-success">${parseFloat(item.actualPrice).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedBooking(null)}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setShowStatusModal(true)}
                >
                  Change Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {showStatusModal && selectedBooking && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">Update Status – #{selectedBooking.bookingReservationID}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowStatusModal(false)}></button>
              </div>
              <form onSubmit={handleStatusSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Customer</label>
                    <input type="text" className="form-control bg-light" value={selectedBooking.customer?.customerFullName} disabled />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select New Status *</label>
                    <select
                      className="form-select"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value={1}>1 - Confirmed (Active reservation)</option>
                      <option value={2}>2 - Completed (Guest checked out)</option>
                      <option value={3}>3 - Cancelled (Release room dates for re-booking)</option>
                    </select>
                    <div className="form-text small mt-2">
                      <i className="bi bi-info-circle me-1"></i> Note: When status is set to Cancelled (3), its room dates will immediately become available for other guests to reserve.
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowStatusModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                    {actionLoading ? 'Updating...' : 'Save Status'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Booking for Guest Modal */}
      {showCreateModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">🏨 Create Reservation for Customer</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <form onSubmit={handleStaffCreateSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-4">
                    <label className="form-label small fw-semibold">Select Customer *</label>
                    <select
                      className="form-select"
                      value={createForm.customerID}
                      onChange={(e) => setCreateForm({ ...createForm, customerID: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Customer --</option>
                      {customerList.map((c) => (
                        <option key={c.customerID} value={c.customerID}>
                          #{c.customerID} - {c.customerFullName} ({c.emailAddress})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0">Rooms Selection</h6>
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleAddItem}>
                      <i className="bi bi-plus-circle me-1"></i> Add Another Room
                    </button>
                  </div>

                  {createForm.items.map((item, idx) => (
                    <div key={idx} className="card bg-light border p-3 mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-secondary">Room Slot #{idx + 1}</span>
                        {createForm.items.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm py-0 px-2"
                            onClick={() => handleRemoveItem(idx)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                      <div className="row g-2">
                        <div className="col-md-5">
                          <label className="form-label small fw-semibold">Room</label>
                          <select
                            className="form-select"
                            value={item.roomID}
                            onChange={(e) => handleItemChange(idx, 'roomID', e.target.value)}
                            required
                          >
                            <option value="">-- Select Room --</option>
                            {availableRooms.map((r) => (
                              <option key={r.roomID} value={r.roomID}>
                                Room {r.roomNumber} - {r.roomType?.roomTypeName} (${r.roomPricePerDay}/day)
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label small fw-semibold">Check-in</label>
                          <input
                            type="date"
                            min={todayStr}
                            className="form-control"
                            value={item.startDate}
                            onChange={(e) => handleItemChange(idx, 'startDate', e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small fw-semibold">Check-out</label>
                          <input
                            type="date"
                            min={item.startDate || todayStr}
                            className="form-control"
                            value={item.endDate}
                            onChange={(e) => handleItemChange(idx, 'endDate', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                    {actionLoading ? 'Creating Reservation...' : 'Confirm Reservation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;

