import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AlertMessage from '../../components/common/AlertMessage';

export const Register = () => {
  const [formData, setFormData] = useState({
    customerFullName: '',
    telephone: '',
    emailAddress: '',
    customerBirthday: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.customerBirthday) {
      const bday = new Date(formData.customerBirthday);
      const today = new Date();
      if (bday >= today) {
        setError('Birthday must be in the past.');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        customerFullName: formData.customerFullName.trim(),
        telephone: formData.telephone.trim(),
        emailAddress: formData.emailAddress.trim(),
        customerBirthday: formData.customerBirthday || null,
        password: formData.password,
      };

      await register(payload);
      navigate('/rooms', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body p-4 p-sm-5">
              <div className="text-center mb-4">
                <span className="fs-1">🏨</span>
                <h3 className="fw-bold mt-2">Create Customer Account</h3>
                <p className="text-muted small">Join FUMiniHotel to book rooms online</p>
              </div>

              <AlertMessage type="danger" message={error} onClose={() => setError('')} />

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name *</label>
                  <input
                    type="text"
                    name="customerFullName"
                    className="form-control"
                    placeholder="e.g. Johnathan Doe"
                    value={formData.customerFullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      name="emailAddress"
                      className="form-control"
                      placeholder="name@example.com"
                      value={formData.emailAddress}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Telephone *</label>
                    <input
                      type="tel"
                      name="telephone"
                      className="form-control"
                      placeholder="0901234567"
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Birthday</label>
                  <input
                    type="date"
                    name="customerBirthday"
                    className="form-control"
                    value={formData.customerBirthday}
                    onChange={handleChange}
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Password *</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
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
                      Registering Account...
                    </>
                  ) : (
                    'Register Now'
                  )}
                </button>
              </form>

              <div className="text-center small mt-3">
                Already registered?{' '}
                <Link to="/login" className="fw-semibold text-primary text-decoration-none">
                  Sign In here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

