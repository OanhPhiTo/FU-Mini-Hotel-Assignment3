import React, { useState, useEffect } from 'react';
import roomApi from '../../api/roomApi';
import AlertMessage from '../../components/common/AlertMessage';
import ConfirmModal from '../../components/common/ConfirmModal';

export const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [keyword, setKeyword] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [roomStatus, setRoomStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState(null);

  // Room Form State
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    roomDetailDescription: '',
    roomMaxCapacity: 2,
    roomTypeID: '',
    roomStatus: 1,
    roomPricePerDay: 50.0,
  });

  // Room Type Form State
  const [typeForm, setTypeForm] = useState({
    roomTypeName: '',
    typeDescription: '',
    typeNote: '',
  });

  const fetchRoomTypes = async () => {
    try {
      const res = await roomApi.getRoomTypes();
      setRoomTypes(res.data || []);
      if (res.data?.length > 0 && !roomForm.roomTypeID) {
        setRoomForm((prev) => ({ ...prev, roomTypeID: res.data[0].roomTypeID }));
      }
    } catch (err) {
      console.error('Failed to load room types:', err);
    }
  };

  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await roomApi.getAll({
        keyword: keyword.trim() || undefined,
        roomTypeId: roomTypeId ? parseInt(roomTypeId) : undefined,
        roomStatus: roomStatus ? parseInt(roomStatus) : undefined,
        page,
        size: 10,
      });
      if (res.data) {
        setRooms(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [page, roomTypeId, roomStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchRooms();
  };

  const handleOpenAdd = () => {
    setRoomForm({
      roomNumber: '',
      roomDetailDescription: '',
      roomMaxCapacity: 2,
      roomTypeID: roomTypes[0]?.roomTypeID || '',
      roomStatus: 1,
      roomPricePerDay: 50.0,
    });
    setError('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (room) => {
    setSelectedRoom(room);
    setRoomForm({
      roomNumber: room.roomNumber || '',
      roomDetailDescription: room.roomDetailDescription || '',
      roomMaxCapacity: room.roomMaxCapacity || 2,
      roomTypeID: room.roomType?.roomTypeID || roomTypes[0]?.roomTypeID || '',
      roomStatus: room.roomStatus || 1,
      roomPricePerDay: room.roomPricePerDay || 50.0,
    });
    setError('');
    setShowEditModal(true);
  };

  const handleOpenDelete = (room) => {
    setSelectedRoom(room);
    setError('');
    setShowDeleteModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    try {
      await roomApi.create({
        roomNumber: roomForm.roomNumber.trim(),
        roomDetailDescription: roomForm.roomDetailDescription,
        roomMaxCapacity: parseInt(roomForm.roomMaxCapacity),
        roomTypeID: parseInt(roomForm.roomTypeID),
        roomStatus: parseInt(roomForm.roomStatus),
        roomPricePerDay: parseFloat(roomForm.roomPricePerDay),
      });
      setSuccess('Room added successfully!');
      setShowAddModal(false);
      fetchRooms();
    } catch (err) {
      setError(err.message || 'Failed to create room');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    try {
      await roomApi.update(selectedRoom.roomID, {
        roomNumber: roomForm.roomNumber.trim(),
        roomDetailDescription: roomForm.roomDetailDescription,
        roomMaxCapacity: parseInt(roomForm.roomMaxCapacity),
        roomTypeID: parseInt(roomForm.roomTypeID),
        roomStatus: parseInt(roomForm.roomStatus),
        roomPricePerDay: parseFloat(roomForm.roomPricePerDay),
      });
      setSuccess('Room updated successfully!');
      setShowEditModal(false);
      fetchRooms();
    } catch (err) {
      setError(err.message || 'Failed to update room');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRoom) return;
    setActionLoading(true);
    setError('');
    try {
      await roomApi.delete(selectedRoom.roomID);
      setSuccess(
        `Room #${selectedRoom.roomNumber} processed successfully (physically deleted if unbooked, or deactivated if referenced in booking history).`
      );
      setShowDeleteModal(false);
      fetchRooms();
    } catch (err) {
      setError(err.message || 'Failed to delete room');
      setShowDeleteModal(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddTypeSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    try {
      await roomApi.createRoomType(typeForm);
      setSuccess('Room type created successfully!');
      setShowAddTypeModal(false);
      setTypeForm({ roomTypeName: '', typeDescription: '', typeNote: '' });
      fetchRoomTypes();
    } catch (err) {
      setError(err.message || 'Failed to create room type');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-door-open-fill text-primary me-2"></i> Room Management
          </h2>
          <p className="text-muted small mb-0">Manage hotel rooms, capacities, prices and room categories</p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-primary" onClick={() => setShowAddTypeModal(true)}>
            <i className="bi bi-plus-square me-1"></i> Add Room Type
          </button>
          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            <i className="bi bi-plus-circle me-1"></i> Add New Room
          </button>
        </div>
      </div>

      <AlertMessage type="danger" message={error} onClose={() => setError('')} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

      {/* Filter and Search Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <form onSubmit={handleSearch} className="row g-2 align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Room number or description..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={roomTypeId}
                onChange={(e) => setRoomTypeId(e.target.value)}
              >
                <option value="">All Room Types</option>
                {roomTypes.map((t) => (
                  <option key={t.roomTypeID} value={t.roomTypeID}>
                    {t.roomTypeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={roomStatus}
                onChange={(e) => setRoomStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="1">1 - Active / Available</option>
                <option value="2">2 - Inactive / Maintenance</option>
              </select>
            </div>

            <div className="col-md-2 d-flex gap-2">
              <button type="submit" className="btn btn-outline-primary flex-grow-1">
                Filter
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setKeyword('');
                  setRoomTypeId('');
                  setRoomStatus('');
                  setPage(0);
                  setTimeout(fetchRooms, 50);
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-pastel">
              <tr>
                <th scope="col" className="ps-3">#ID</th>
                <th scope="col">Room No.</th>
                <th scope="col">Room Type</th>
                <th scope="col">Max Capacity</th>
                <th scope="col">Price / Day</th>
                <th scope="col">Status</th>
                <th scope="col">Description</th>
                <th scope="col" className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <div className="text-muted mt-2">Loading rooms...</div>
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    No rooms found.
                  </td>
                </tr>
              ) : (
                rooms.map((r) => (
                  <tr key={r.roomID}>
                    <td className="ps-3 fw-bold text-muted">#{r.roomID}</td>
                    <td className="fw-bold text-pastel-primary">Room {r.roomNumber}</td>
                    <td>
                      <span className="badge bg-pastel-blue text-pastel-dark px-2 py-1 rounded-pill">{r.roomType?.roomTypeName || 'N/A'}</span>
                    </td>
                    <td>{r.roomMaxCapacity} guests</td>
                    <td className="fw-bold text-pastel-primary">${parseFloat(r.roomPricePerDay).toFixed(2)}</td>
                    <td>
                      {r.roomStatus === 1 ? (
                        <span className="badge bg-pastel-green text-pastel-green-dark px-2 py-1 rounded-pill">Active</span>
                      ) : (
                        <span className="badge bg-secondary px-2 py-1 rounded-pill">Inactive</span>
                      )}
                    </td>
                    <td className="small text-muted text-truncate" style={{ maxWidth: '200px' }}>
                      {r.roomDetailDescription || '—'}
                    </td>
                    <td className="text-end pe-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={() => handleOpenEdit(r)}
                        title="Edit Room"
                      >
                        <i className="bi bi-pencil-square me-1"></i> Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleOpenDelete(r)}
                        title="Delete Room"
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

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">Add New Room</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Room Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 501"
                        value={roomForm.roomNumber}
                        onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Room Type *</label>
                      <select
                        className="form-select"
                        value={roomForm.roomTypeID}
                        onChange={(e) => setRoomForm({ ...roomForm, roomTypeID: e.target.value })}
                        required
                      >
                        {roomTypes.map((t) => (
                          <option key={t.roomTypeID} value={t.roomTypeID}>
                            {t.roomTypeName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Max Capacity *</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={roomForm.roomMaxCapacity}
                        onChange={(e) => setRoomForm({ ...roomForm, roomMaxCapacity: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Price Per Day ($) *</label>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        className="form-control"
                        value={roomForm.roomPricePerDay}
                        onChange={(e) => setRoomForm({ ...roomForm, roomPricePerDay: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Room Status *</label>
                    <select
                      className="form-select"
                      value={roomForm.roomStatus}
                      onChange={(e) => setRoomForm({ ...roomForm, roomStatus: parseInt(e.target.value) })}
                    >
                      <option value={1}>1 - Active / Available</option>
                      <option value={2}>2 - Inactive / Maintenance</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="Describe room amenities and features..."
                      value={roomForm.roomDetailDescription}
                      onChange={(e) => setRoomForm({ ...roomForm, roomDetailDescription: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                    {actionLoading ? 'Creating...' : 'Create Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditModal && selectedRoom && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">Edit Room #{selectedRoom.roomNumber}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Room Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={roomForm.roomNumber}
                        onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Room Type *</label>
                      <select
                        className="form-select"
                        value={roomForm.roomTypeID}
                        onChange={(e) => setRoomForm({ ...roomForm, roomTypeID: e.target.value })}
                        required
                      >
                        {roomTypes.map((t) => (
                          <option key={t.roomTypeID} value={t.roomTypeID}>
                            {t.roomTypeName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Max Capacity *</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={roomForm.roomMaxCapacity}
                        onChange={(e) => setRoomForm({ ...roomForm, roomMaxCapacity: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Price Per Day ($) *</label>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        className="form-control"
                        value={roomForm.roomPricePerDay}
                        onChange={(e) => setRoomForm({ ...roomForm, roomPricePerDay: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Room Status *</label>
                    <select
                      className="form-select"
                      value={roomForm.roomStatus}
                      onChange={(e) => setRoomForm({ ...roomForm, roomStatus: parseInt(e.target.value) })}
                    >
                      <option value={1}>1 - Active / Available</option>
                      <option value={2}>2 - Inactive / Maintenance</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={roomForm.roomDetailDescription}
                      onChange={(e) => setRoomForm({ ...roomForm, roomDetailDescription: e.target.value })}
                    ></textarea>
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

      {/* Add Room Type Modal */}
      {showAddTypeModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">Create Room Type</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddTypeModal(false)}></button>
              </div>
              <form onSubmit={handleAddTypeSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Type Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Royal Suite"
                      value={typeForm.roomTypeName}
                      onChange={(e) => setTypeForm({ ...typeForm, roomTypeName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      placeholder="Room type description..."
                      value={typeForm.typeDescription}
                      onChange={(e) => setTypeForm({ ...typeForm, typeDescription: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Type Note</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. VIP floor, complimentary breakfast"
                      value={typeForm.typeNote}
                      onChange={(e) => setTypeForm({ ...typeForm, typeNote: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddTypeModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                    Create Type
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
        title="Delete Room"
        message={`Are you sure you want to delete Room #${selectedRoom?.roomNumber}? 
        Business Rule: If this room has existing booking history in BookingDetail, it will NOT be physically deleted from the database—instead, its status will be changed to Inactive (2). If it has never been booked, it will be deleted permanently.`}
        confirmText="Confirm Delete / Deactivate"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default RoomManagement;

