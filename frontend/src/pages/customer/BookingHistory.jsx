import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookingApi from '../../api/bookingApi';
import AlertMessage from '../../components/common/AlertMessage';

export const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Selected reservation for details view
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bookingApi.getMyBookings({ page, size: 8 });
      if (res.data) {
        setBookings(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your booking history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page]);

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
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">
            <i className="bi bi-journal-text text-pastel-primary me-2"></i> My Booking History
          </h3>
          <p className="text-muted small mb-0">
            View all your hotel reservations and room stay details
          </p>
        </div>
        <Link to="/booking/create" className="btn btn-pastel-primary fw-semibold shadow-sm">
          <i className="bi bi-calendar-plus me-1"></i> New Booking
        </Link>
      </div>

      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading bookings...</span>
          </div>
          <p className="mt-2 text-muted">Retrieving your reservations...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card shadow-sm border-0 text-center py-5">
          <div className="card-body">
            <i className="bi bi-calendar-x display-2 text-muted"></i>
            <h4 className="fw-bold mt-3">No Reservations Found</h4>
            <p className="text-muted mb-4">
              You haven't placed any room reservations yet. Explore our luxurious rooms and book today!
            </p>
            <Link to="/rooms" className="btn btn-primary px-4">
              <i className="bi bi-door-open me-1"></i> Browse Rooms
            </Link>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-pastel">
                <tr>
                  <th scope="col" className="ps-3">#ID</th>
                  <th scope="col">Booking Date</th>
                  <th scope="col">Rooms Reserved</th>
                  <th scope="col">Stay Duration</th>
                  <th scope="col">Total Price</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end pe-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const detailsCount = booking.bookingDetails?.length || 0;
                  const firstDetail = booking.bookingDetails?.[0];

                  return (
                    <tr key={booking.bookingReservationID}>
                      <td className="ps-3 fw-bold text-primary">
                        #{booking.bookingReservationID}
                      </td>
                      <td>{booking.bookingDate}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {detailsCount} room{detailsCount > 1 ? 's' : ''}
                        </span>{' '}
                        {booking.bookingDetails?.map((d) => `Room ${d.roomNumber}`).join(', ')}
                      </td>
                      <td className="small text-muted">
                        {firstDetail ? (
                          <>
                            {firstDetail.startDate} → {firstDetail.endDate}
                            {detailsCount > 1 && <span className="ms-1">(+)</span>}
                          </>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="fw-bold text-success fs-6">
                        ${parseFloat(booking.totalPrice).toFixed(2)}
                      </td>
                      <td>{getStatusBadge(booking.bookingStatus)}</td>
                      <td className="text-end pe-3">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <i className="bi bi-eye me-1"></i> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
      )}

      {/* Reservation Details Modal */}
      {selectedBooking && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  🏨 Reservation Details – #{selectedBooking.bookingReservationID}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedBooking(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3 mb-4">
                  <div className="col-sm-4">
                    <div className="p-3 bg-light rounded">
                      <div className="small text-muted">Reservation ID</div>
                      <div className="fw-bold fs-5 text-primary">#{selectedBooking.bookingReservationID}</div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="p-3 bg-light rounded">
                      <div className="small text-muted">Booking Date</div>
                      <div className="fw-bold fs-5">{selectedBooking.bookingDate}</div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="p-3 bg-light rounded">
                      <div className="small text-muted">Reservation Status</div>
                      <div className="mt-1">{getStatusBadge(selectedBooking.bookingStatus)}</div>
                    </div>
                  </div>
                </div>

                <h6 className="fw-bold mb-3">Booked Rooms ({selectedBooking.bookingDetails?.length || 0})</h6>
                <div className="table-responsive border rounded mb-3">
                  <table className="table table-striped align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Room Number</th>
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
                          <td className="fw-bold text-dark">Room {item.roomNumber}</td>
                          <td>
                            <span className="badge bg-secondary">{item.roomTypeName || 'Standard'}</span>
                          </td>
                          <td className="small">
                            {item.startDate} → {item.endDate}
                          </td>
                          <td>{item.numberOfDays} days</td>
                          <td>${parseFloat(item.roomPricePerDay).toFixed(2)}</td>
                          <td className="text-end fw-bold text-success">
                            ${parseFloat(item.actualPrice).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <td colSpan="5" className="text-end fw-bold">Total Reservation Cost:</td>
                        <td className="text-end fw-bold fs-5 text-success">
                          ${parseFloat(selectedBooking.totalPrice).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="small text-muted">
                  <i className="bi bi-info-circle me-1"></i> Check-in time starts at 14:00 on the start date. Check-out time is before 12:00 on the end date.
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedBooking(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;

