import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AlertMessage from '../../components/common/AlertMessage';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isExpired = new URLSearchParams(location.search).get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      if (user.role === 'STAFF') {
        navigate('/staff/dashboard', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/rooms';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body p-4 p-sm-5">
              <div className="text-center mb-4">
                <span className="fs-1">🏨</span>
                <h3 className="fw-bold mt-2">Sign In</h3>
                <p className="text-muted small">Access your FUMiniHotel account</p>
              </div>

              {isExpired && (
                <AlertMessage
                  type="warning"
                  message="Your session has expired. Please sign in again."
                  onClose={() => {}}
                />
              )}

              <AlertMessage type="danger" message={error} onClose={() => setError('')} />

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-pastel-primary w-100 py-2 fw-semibold shadow-sm mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Authenticating...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="text-center small mt-3">
                Don't have an account?{' '}
                <Link to="/register" className="fw-semibold text-primary text-decoration-none">
                  Register as Customer
                </Link>
              </div>

              {/* Demo Quick Logins */}
              <div className="mt-4 pt-3 border-top">
                <div className="small fw-bold text-muted mb-2 text-center text-uppercase">
                  Quick Demo Accounts
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm text-start d-flex justify-content-between align-items-center"
                    onClick={() => fillQuickCredentials('staff@fuminihotel.com', 'Admin@123')}
                  >
                    <span>
                      <i className="bi bi-shield-lock me-1 text-warning"></i> Staff Admin
                    </span>
                    <span className="badge bg-secondary">staff@fuminihotel.com</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm text-start d-flex justify-content-between align-items-center"
                    onClick={() => fillQuickCredentials('customer@fuminihotel.com', 'Customer@123')}
                  >
                    <span>
                      <i className="bi bi-person me-1 text-info"></i> Sample Customer
                    </span>
                    <span className="badge bg-secondary">customer@fuminihotel.com</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

