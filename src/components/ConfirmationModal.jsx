import './ConfirmationModal.css';
import PropTypes from 'prop-types';

export default function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="confirmation-modal">
      <div className="confirmation-modal-content">
        <h3>Confirm Deletion</h3>
        <p>{message}</p>
        <div className="confirmation-modal-buttons">
          <button onClick={onConfirm} className="confirm-btn">Yes, Delete</button>
          <button onClick={onCancel} className="cancel-btn">No, Cancel</button>
        </div>
      </div>
    </div>
  );
}

ConfirmationModal.propTypes = {
  message: PropTypes.bool.isRequired,
  onConfirm: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};
