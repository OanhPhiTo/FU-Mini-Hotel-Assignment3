import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import StaffLayout from './components/layout/StaffLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';

// Public & Customer Pages
import RoomList from './pages/customer/RoomList';
import RoomDetail from './pages/customer/RoomDetail';
import CreateBooking from './pages/customer/CreateBooking';
import BookingHistory from './pages/customer/BookingHistory';
import Profile from './pages/customer/Profile';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Staff Pages
import Dashboard from './pages/staff/Dashboard';
import CustomerManagement from './pages/staff/CustomerManagement';
import RoomManagement from './pages/staff/RoomManagement';
import BookingManagement from './pages/staff/BookingManagement';

function App() {
  return (
    <Routes>
      {/* 1. Public & Customer Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/rooms" replace />} />
        <Route path="/rooms" element={<RoomList />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Customer Routes */}
        <Route
          path="/booking/create"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRole="CUSTOMER">
                <CreateBooking />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRole="CUSTOMER">
                <BookingHistory />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRole="CUSTOMER">
                <Profile />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 2. Staff Management Routes with StaffLayout */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="STAFF">
              <StaffLayout />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="rooms" element={<RoomManagement />} />
        <Route path="bookings" element={<BookingManagement />} />
      </Route>

      {/* 3. 404 Not Found Page */}
      <Route
        path="*"
        element={
          <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light text-center p-4">
            <h1 className="display-1 fw-bold text-muted">404</h1>
            <h3 className="fw-bold mb-3">Page Not Found</h3>
            <p className="text-secondary mb-4">The page you are looking for does not exist or has been moved.</p>
            <a href="/rooms" className="btn btn-warning px-4 fw-semibold">
              <i className="bi bi-house-door me-1"></i> Return to Home
            </a>
          </div>
        }
      />
    </Routes>
  );
}

export default App;

