import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Footer from './Footer';

export const StaffLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Top Navbar */}
      <header className="navbar navbar-dark navbar-pastel sticky-top px-3 py-2 shadow-sm">
        <NavLink className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-5 fw-bold text-white" to="/staff/dashboard">
          🏨 FUMiniHotel Staff
        </NavLink>
        <div className="d-flex align-items-center gap-3 ms-auto">
          <span className="text-white small d-none d-md-inline opacity-90">
            Logged in as: <strong className="text-white">{user?.fullName || user?.email}</strong> (STAFF)
          </span>
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-1"></i> Sign Out
          </button>
        </div>
      </header>

      <div className="container-fluid flex-grow-1">
        <div className="row flex-grow-1">
          {/* Sidebar */}
          <nav className="col-md-3 col-lg-2 d-md-block bg-white sidebar shadow-sm p-3 border-end">
            <div className="position-sticky pt-2">
              <h6 className="sidebar-heading px-3 mt-2 mb-3 text-muted text-uppercase fs-7 fw-bold">
                Administration
              </h6>
              <ul className="nav nav-pills flex-column gap-1">
                <li className="nav-item">
                  <NavLink
                    to="/staff/dashboard"
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center ${isActive ? 'active bg-primary text-white' : 'text-dark'}`
                    }
                  >
                    <i className="bi bi-speedometer2 me-2 fs-5"></i> Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/staff/rooms"
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center ${isActive ? 'active bg-primary text-white' : 'text-dark'}`
                    }
                  >
                    <i className="bi bi-door-open me-2 fs-5"></i> Room Management
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/staff/customers"
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center ${isActive ? 'active bg-primary text-white' : 'text-dark'}`
                    }
                  >
                    <i className="bi bi-people me-2 fs-5"></i> Customer Management
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/staff/bookings"
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center ${isActive ? 'active bg-primary text-white' : 'text-dark'}`
                    }
                  >
                    <i className="bi bi-calendar-check me-2 fs-5"></i> Booking Management
                  </NavLink>
                </li>
              </ul>

              <hr className="my-3" />
              <div className="px-3">
                <NavLink to="/rooms" className="btn btn-outline-secondary btn-sm w-100 text-start">
                  <i className="bi bi-eye me-2"></i> View Guest View
                </NavLink>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StaffLayout;

