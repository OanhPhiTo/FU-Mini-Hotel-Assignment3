import React, { useState, useEffect } from 'react';
import customerApi from '../../api/customerApi';
import { useAuth } from '../../contexts/AuthContext';
import AlertMessage from '../../components/common/AlertMessage';

export const Profile = () => {
  const { updateProfileState } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    customerFullName: '',
    telephone: '',
    customerBirthday: '',
    password: '',
    confirmPassword: '',
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await customerApi.getMyProfile();
      if (res.data) {
        setProfile(res.data);
        setFormData({
          customerFullName: res.data.customerFullName || '',
          telephone: res.data.telephone || '',
          customerBirthday: res.data.customerBirthday || '',
          password: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.customerBirthday) {
      const bday = new Date(formData.customerBirthday);
      if (bday >= new Date()) {
        setError('Birthday must be in the past.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        customerFullName: formData.customerFullName.trim(),
        telephone: formData.telephone.trim(),
        customerBirthday: formData.customerBirthday || null,
        password: formData.password ? formData.password : undefined,
      };

      const res = await customerApi.updateMyProfile(payload);
      setSuccess('Profile updated successfully!');
      setProfile(res.data);
      updateProfileState({ fullName: res.data.customerFullName });
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-pastel-primary text-white p-4">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle bg-pastel-blue text-pastel-dark d-flex align-items-center justify-content-center fs-2 fw-bold me-3 shadow-sm"
                  style={{ width: '60px', height: '60px' }}
                >
                  {profile?.customerFullName?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-white">{profile?.customerFullName}</h4>
                  <span className="badge bg-white bg-opacity-25 text-white">Customer Account #{profile?.customerID}</span>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              <AlertMessage type="danger" message={error} onClose={() => setError('')} />
              <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

              <form onSubmit={handleSubmit}>
                <h5 className="fw-bold mb-3 border-bottom pb-2">Personal Information</h5>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Email Address (Read-only)</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={profile?.emailAddress || ''}
                    disabled
                  />
                  <div className="form-text">Email address cannot be modified once registered.</div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      name="customerFullName"
                      className="form-control"
                      value={formData.customerFullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Telephone *</label>
                    <input
                      type="tel"
                      name="telephone"
                      className="form-control"
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Date of Birth</label>
                  <input
                    type="date"
                    name="customerBirthday"
                    className="form-control"
                    value={formData.customerBirthday}
                    onChange={handleChange}
                  />
                </div>

                <h5 className="fw-bold mb-3 border-bottom pb-2">Change Password (Optional)</h5>
                <p className="text-muted small">Leave blank if you do not wish to change your password.</p>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">New Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Re-enter new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-pastel-primary px-4 fw-semibold shadow-sm"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating Profile...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

