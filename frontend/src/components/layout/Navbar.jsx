import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, isStaff, isCustomer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-pastel sticky-top shadow-sm py-2">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-bold" to={isStaff ? '/staff/dashboard' : '/rooms'}>
          <span className="fs-3 me-2">🏨</span>
          <span className="text-white">FU</span>
          <span className="text-white opacity-75">MiniHotel</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Public / Customer Links */}
            {!isStaff && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/rooms">
                    <i className="bi bi-door-open me-1"></i> Rooms
                  </NavLink>
                </li>
                {isCustomer && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/booking/create">
                        <i className="bi bi-calendar-plus me-1"></i> Book Now
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/my-bookings">
                        <i className="bi bi-journal-text me-1"></i> My Bookings
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/profile">
                        <i className="bi bi-person me-1"></i> Profile
                      </NavLink>
                    </li>
                  </>
                )}
              </>
            )}

            {/* Staff Quick Nav Links */}
            {isStaff && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/staff/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i> Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/staff/rooms">
                    <i className="bi bi-door-open-fill me-1"></i> Room Management
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/staff/customers">
                    <i className="bi bi-people-fill me-1"></i> Customers
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/staff/bookings">
                    <i className="bi bi-calendar-check-fill me-1"></i> Bookings
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Right-side Auth Buttons */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-3">
                <div className="text-end text-light">
                  <div className="fw-semibold small">{user.fullName || user.email}</div>
                  <span className={`badge ${isStaff ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
                    {user.role}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm px-3"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                </Link>
                <Link to="/register" className="btn btn-warning btn-sm px-3 fw-semibold">
                  <i className="bi bi-person-plus me-1"></i> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

