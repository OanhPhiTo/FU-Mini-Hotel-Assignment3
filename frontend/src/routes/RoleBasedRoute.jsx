import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const RoleBasedRoute = ({ allowedRole, children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== allowedRole) {
    // If Staff tries to visit customer-only page or Customer tries to visit staff page
    return <Navigate to={user?.role === 'STAFF' ? '/staff/dashboard' : '/rooms'} replace />;
  }

  return children;
};

export default RoleBasedRoute;

