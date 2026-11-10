import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import roomApi from '../../api/roomApi';
import { useAuth } from '../../contexts/AuthContext';
import AlertMessage from '../../components/common/AlertMessage';

export const RoomDetail = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isAuthenticated, isStaff } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await roomApi.getById(id);
        if (res.data) {
          setRoom(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load room details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoom();
    }
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/booking/create', search: `?roomId=${id}` } } });
    } else {
      navigate(`/booking/create?roomId=${id}`);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading room details...</span>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container py-5">
        <AlertMessage type="danger" message={error || 'Room not found'} />
        <Link to="/rooms" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i> Back to Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/rooms">Rooms</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Room {room.roomNumber}
          </li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Room Information & Specifications (No image, clean pastel card) */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="badge bg-pastel-blue text-pastel-dark fs-6 px-3 py-2 rounded-pill">
                <i className="bi bi-door-closed me-1"></i> Room #{room.roomNumber}
              </span>
              <span className={`badge ${room.roomStatus === 1 ? 'bg-pastel-green text-pastel-green-dark' : 'bg-secondary text-white'} fs-6 px-3 py-2 rounded-pill`}>
                <i className={`bi ${room.roomStatus === 1 ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
                {room.roomStatus === 1 ? 'Active / Available' : 'Inactive / Maintenance'}
              </span>
            </div>

            <h2 className="fw-bold text-dark mb-1">{room.roomType?.roomTypeName || 'Hotel Room'}</h2>
            <p className="text-muted small mb-4">
              Registered room unit #{room.roomNumber} with full hospitality amenities
            </p>

            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <div className="p-3 border border-pastel rounded bg-pastel-subtle h-100">
                  <div className="small text-muted mb-1">
                    <i className="bi bi-people-fill text-pastel-primary me-1"></i> Maximum Capacity
                  </div>
                  <div className="fs-5 fw-bold text-dark">{room.roomMaxCapacity} Persons</div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 border border-pastel rounded bg-pastel-subtle h-100">
                  <div className="small text-muted mb-1">
                    <i className="bi bi-tag-fill text-pastel-primary me-1"></i> Standard Rate
                  </div>
                  <div className="fs-5 fw-bold text-pastel-primary">
                    ${parseFloat(room.roomPricePerDay).toFixed(2)} <span className="fs-7 text-muted fw-normal">/ day</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="fw-bold text-dark mb-2">Room Overview</h5>
              <p className="text-secondary">
                {room.roomDetailDescription || 'Comfortable and fully equipped room with modern facilities.'}
              </p>
            </div>

            {room.roomType && (
              <div className="p-3 bg-pastel-subtle rounded border border-pastel">
                <h6 className="fw-bold text-dark mb-1">
                  <i className="bi bi-info-circle text-pastel-primary me-1"></i>
                  Room Type Category: {room.roomType.roomTypeName}
                </h6>
                <div className="small text-secondary mb-2">{room.roomType.typeDescription}</div>
                {room.roomType.typeNote && (
                  <div className="small text-pastel-primary">
                    <strong>Special Note:</strong> {room.roomType.typeNote}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Booking Action Box */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100 p-4 d-flex flex-column">
            <h5 className="fw-bold text-dark mb-3">Reservation Summary</h5>

            <div className="p-3 rounded bg-pastel-subtle border border-pastel mb-3">
              <div className="small text-muted mb-1">Nightly Pricing</div>
              <div className="text-pastel-primary fs-2 fw-bold">
                ${parseFloat(room.roomPricePerDay).toFixed(2)}
                <span className="text-muted fs-6 fw-normal"> / night</span>
              </div>
              <div className="small text-muted mt-1">
                <i className="bi bi-shield-check text-pastel-green-dark me-1"></i> Taxes and basic service included
              </div>
            </div>

            <ul className="list-group list-group-flush mb-4 small">
              <li className="list-group-item px-0 d-flex justify-content-between align-items-center bg-transparent border-pastel">
                <span className="text-muted">Room Number</span>
                <strong>{room.roomNumber}</strong>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between align-items-center bg-transparent border-pastel">
                <span className="text-muted">Room Type</span>
                <strong>{room.roomType?.roomTypeName}</strong>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between align-items-center bg-transparent border-pastel">
                <span className="text-muted">Max Occupancy</span>
                <strong>{room.roomMaxCapacity} Guests</strong>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between align-items-center bg-transparent border-pastel">
                <span className="text-muted">Availability</span>
                <span className={`badge ${room.roomStatus === 1 ? 'bg-pastel-green text-pastel-green-dark' : 'bg-secondary'}`}>
                  {room.roomStatus === 1 ? 'Available for Booking' : 'Not Available'}
                </span>
              </li>
            </ul>

            <div className="d-grid gap-2 mt-auto">
              {room.roomStatus === 1 ? (
                !isStaff && (
                  <button
                    type="button"
                    className="btn btn-pastel-primary btn-lg fw-bold shadow-sm"
                    onClick={handleBookNow}
                  >
                    <i className="bi bi-calendar-check me-2"></i> Book This Room Now
                  </button>
                )
              ) : (
                <button type="button" className="btn btn-secondary btn-lg" disabled>
                  Room Currently Unavailable
                </button>
              )}
              <Link to="/rooms" className="btn btn-outline-pastel">
                <i className="bi bi-arrow-left me-1"></i> Back to All Rooms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;

