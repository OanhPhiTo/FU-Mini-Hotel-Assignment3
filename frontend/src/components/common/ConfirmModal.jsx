import React from 'react';

export const ConfirmModal = ({ show, title, message, confirmText = 'Confirm', confirmVariant = 'danger', onConfirm, onCancel, loading = false }) => {
  if (!show) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">{title || 'Confirm Action'}</h5>
            <button type="button" className="btn-close" disabled={loading} onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">{message || 'Are you sure you want to proceed?'}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" disabled={loading} onClick={onCancel}>
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-${confirmVariant}`}
              disabled={loading}
              onClick={onConfirm}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

