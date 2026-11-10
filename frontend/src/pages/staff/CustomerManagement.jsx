import React, { useState, useEffect } from 'react';
import customerApi from '../../api/customerApi';
import AlertMessage from '../../components/common/AlertMessage';
import ConfirmModal from '../../components/common/ConfirmModal';

export const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Current customer for edit/delete
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    customerFullName: '',
    telephone: '',
    emailAddress: '',
    customerBirthday: '',
    customerStatus: 1,
    password: '',
  });

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await customerApi.search({
        keyword: keyword.trim() || undefined,
        page,
        size: 10,
      });
      if (res.data) {
        setCustomers(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch customer list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchCustomers();
  };

  const handleOpenAdd = () => {
    setFormData({
      customerFullName: '',
      telephone: '',
      emailAddress: '',
      customerBirthday: '',
      customerStatus: 1,
      password: '',
    });
    setError('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (c) => {
    setSelectedCustomer(c);
    setFormData({
      customerFullName: c.customerFullName || '',
      telephone: c.telephone || '',
      emailAddress: c.emailAddress || '',
      customerBirthday: c.customerBirthday || '',
      customerStatus: c.customerStatus || 1,
      password: '',
    });
    setError('');
    setShowEditModal(true);
  };

  const handleOpenDelete = (c) => {
    setSelectedCustomer(c);
    setError('');
    setShowDeleteModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    try {
      await customerApi.create({
        customerFullName: formData.customerFullName.trim(),
        telephone: formData.telephone.trim(),
        emailAddress: formData.emailAddress.trim(),
        customerBirthday: formData.customerBirthday || null,
        customerStatus: parseInt(formData.customerStatus),
        password: formData.password,
      });
      setSuccess('New customer created successfully!');
      setShowAddModal(false);
      fetchCustomers();
    } catch (err) {
      setError(err.message || 'Failed to create customer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    try {
      await customerApi.update(selectedCustomer.customerID, {
        customerFullName: formData.customerFullName.trim(),
        telephone: formData.telephone.trim(),
        customerBirthday: formData.customerBirthday || null,
        customerStatus: parseInt(formData.customerStatus),
        password: formData.password ? formData.password : undefined,
      });
      setSuccess('Customer updated successfully!');
      setShowEditModal(false);
      fetchCustomers();
    } catch (err) {
      setError(err.message || 'Failed to update customer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCustomer) return;
    setActionLoading(true);
    setError('');
    try {
      await customerApi.delete(selectedCustomer.customerID);
      setSuccess(`Customer #${selectedCustomer.customerID} deleted successfully!`);
      setShowDeleteModal(false);
      fetchCustomers();
    } catch (err) {
      setError(err.message || 'Cannot delete customer. They may have active booking records.');
      setShowDeleteModal(false);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-people-fill text-primary me-2"></i> Customer Management
          </h2>
          <p className="text-muted small mb-0">Create, search, update and manage customer accounts</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          <i className="bi bi-person-plus-fill me-1"></i> Add New Customer
        </button>
      </div>

      <AlertMessage type="danger" message={error} onClose={() => setError('')} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

      {/* Search Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <form onSubmit={handleSearch} className="row g-2 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search customer by name, email or phone..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button type="submit" className="btn btn-outline-primary">
                Search
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setKeyword('');
                  setPage(0);
                  setTimeout(fetchCustomers, 50);
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Customers Table */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-pastel">
              <tr>
                <th scope="col" className="ps-3">#ID</th>
                <th scope="col">Full Name</th>
                <th scope="col">Email Address</th>
                <th scope="col">Telephone</th>
                <th scope="col">Birthday</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <div className="text-muted mt-2">Loading customers...</div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No customers found. Click "Add New Customer" to register one.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.customerID}>
                    <td className="ps-3 fw-bold text-pastel-primary">#{c.customerID}</td>
                    <td className="fw-semibold">{c.customerFullName}</td>
                    <td>{c.emailAddress}</td>
                    <td>{c.telephone}</td>
                    <td>{c.customerBirthday || '—'}</td>
                    <td>
                      {c.customerStatus === 1 ? (
                        <span className="badge bg-pastel-green text-pastel-green-dark px-2 py-1 rounded-pill">Active</span>
                      ) : (
                        <span className="badge bg-secondary px-2 py-1 rounded-pill">Inactive</span>
                      )}
                    </td>
                    <td className="text-end pe-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={() => handleOpenEdit(c)}
                        title="Edit Customer"
                      >
                        <i className="bi bi-pencil-square me-1"></i> Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleOpenDelete(c)}
                        title="Delete Customer"
                      >
                        <i className="bi bi-trash me-1"></i> Delete
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

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">Add New Customer</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Customer Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.customerFullName}
                      onChange={(e) => setFormData({ ...formData, customerFullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.emailAddress}
                        onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Telephone *</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Birthday</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.customerBirthday}
                        onChange={(e) => setFormData({ ...formData, customerBirthday: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Status *</label>
                      <select
                        className="form-select"
                        value={formData.customerStatus}
                        onChange={(e) => setFormData({ ...formData, customerStatus: parseInt(e.target.value) })}
                      >
                        <option value={1}>1 - Active</option>
                        <option value={2}>2 - Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                    {actionLoading ? 'Creating...' : 'Create Customer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">Edit Customer #{selectedCustomer.customerID}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email Address (Read-only)</label>
                    <input type="email" className="form-control bg-light" value={formData.emailAddress} disabled />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Customer Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.customerFullName}
                      onChange={(e) => setFormData({ ...formData, customerFullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Telephone *</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Birthday</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.customerBirthday}
                        onChange={(e) => setFormData({ ...formData, customerBirthday: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Customer Status *</label>
                    <select
                      className="form-select"
                      value={formData.customerStatus}
                      onChange={(e) => setFormData({ ...formData, customerStatus: parseInt(e.target.value) })}
                    >
                      <option value={1}>1 - Active</option>
                      <option value={2}>2 - Inactive</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">New Password (Optional)</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Leave blank to keep current password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                    {actionLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        title="Delete Customer"
        message={`Are you sure you want to delete customer "${selectedCustomer?.customerFullName}" (#${selectedCustomer?.customerID})? Note: If this customer has existing booking records, deletion will be blocked.`}
        confirmText="Delete Customer"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default CustomerManagement;

