import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardApi from '../../api/dashboardApi';
import AlertMessage from '../../components/common/AlertMessage';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await dashboardApi.getStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
            <i className="bi bi-speedometer2 text-primary me-2"></i> Staff Dashboard
          </h2>
          <p className="text-muted small mb-0">Overview of FUMiniHotel operations, room status, and recent bookings</p>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={fetchStats}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading metrics...</span>
          </div>
          <p className="mt-2 text-muted">Calculating hotel statistics...</p>
        </div>
      ) : (
        <>
          {/* Top 4 Metric Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 border-start border-primary border-4">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <div className="text-muted small text-uppercase fw-bold">Total Customers</div>
                      <div className="fs-3 fw-bold text-dark">{stats?.totalCustomers || 0}</div>
                    </div>
                    <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle">
                      <i className="bi bi-people-fill fs-3"></i>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Link to="/staff/customers" className="small text-primary text-decoration-none fw-semibold">
                      Manage Customers →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 border-start border-info border-4">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <div className="text-muted small text-uppercase fw-bold">Total Rooms</div>
                      <div className="fs-3 fw-bold text-dark">{stats?.totalRooms || 0}</div>
                    </div>
                    <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle">
                      <i className="bi bi-door-closed-fill fs-3"></i>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Link to="/staff/rooms" className="small text-info text-decoration-none fw-semibold">
                      Manage Rooms →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 border-start border-success border-4">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <div className="text-muted small text-uppercase fw-bold">Available Rooms</div>
                      <div className="fs-3 fw-bold text-success">{stats?.availableRooms || 0}</div>
                    </div>
                    <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle">
                      <i className="bi bi-check-circle-fill fs-3"></i>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="small text-muted">Ready for booking</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 border-start border-warning border-4">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <div className="text-muted small text-uppercase fw-bold">Total Bookings</div>
                      <div className="fs-3 fw-bold text-dark">{stats?.totalBookings || 0}</div>
                    </div>
                    <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle">
                      <i className="bi bi-calendar-check-fill fs-3 text-dark"></i>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Link to="/staff/bookings" className="small text-warning text-decoration-none fw-semibold">
                      View All Bookings →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Bookings */}
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">Recent Reservations</h5>
                  <Link to="/staff/bookings" className="btn btn-outline-primary btn-sm">
                    View All
                  </Link>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Rooms</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats?.recentBookings && stats.recentBookings.length > 0 ? (
                          stats.recentBookings.map((b) => (
                            <tr key={b.bookingReservationID}>
                              <td className="fw-bold text-primary">#{b.bookingReservationID}</td>
                              <td>
                                <div className="fw-semibold">{b.customer?.customerFullName}</div>
                                <div className="small text-muted">{b.customer?.emailAddress}</div>
                              </td>
                              <td>{b.bookingDate}</td>
                              <td>
                                {b.bookingDetails?.map((d) => `Room ${d.roomNumber}`).join(', ') || 'N/A'}
                              </td>
                              <td className="fw-bold text-success">${parseFloat(b.totalPrice).toFixed(2)}</td>
                              <td>{getStatusBadge(b.bookingStatus)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center py-4 text-muted">
                              No recent bookings recorded.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                  <h5 className="fw-bold mb-0">Quick Management</h5>
                </div>
                <div className="card-body d-grid gap-2">
                  <Link to="/staff/rooms" className="btn btn-outline-primary p-3 text-start">
                    <div className="fw-bold">
                      <i className="bi bi-door-open-fill me-2"></i> Rooms & Pricing
                    </div>
                    <div className="small text-muted">Add new rooms, adjust rates or update capacity</div>
                  </Link>

                  <Link to="/staff/customers" className="btn btn-outline-info p-3 text-start text-dark">
                    <div className="fw-bold">
                      <i className="bi bi-people-fill me-2 text-info"></i> Customer Accounts
                    </div>
                    <div className="small text-muted">Search customers, view details or manage access</div>
                  </Link>

                  <Link to="/staff/bookings" className="btn btn-outline-warning p-3 text-start text-dark">
                    <div className="fw-bold">
                      <i className="bi bi-calendar-plus-fill me-2 text-warning"></i> Reservation Desk
                    </div>
                    <div className="small text-muted">Create bookings on behalf of guests & update status</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

