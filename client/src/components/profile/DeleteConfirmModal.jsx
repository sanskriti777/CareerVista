import "./EducationModal.css";
import { FaTimes } from "react-icons/fa";

function DeleteConfirmModal({
  isOpen,
  title = "Remove Entry",
  message = "Are you sure you want to remove this item?",
  itemPreview = "",
  onConfirm,
  onCancel,
  isDeleting = false,
  errorMessage = "",
}) {
  if (!isOpen) return null;

  return (
    <div
      className="education-modal-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div
        className="education-modal"
        style={{ maxWidth: "440px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="education-modal-header">
          <h3 id="delete-modal-title">{title}</h3>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Close confirmation dialog"
          >
            <FaTimes />
          </button>
        </div>

        <div className="delete-modal-body">
          {errorMessage && (
            <div className="modal-alert-error" style={{ marginBottom: "14px" }} role="alert">
              {errorMessage}
            </div>
          )}
          <p>{message}</p>
          {itemPreview && (
            <div className="delete-target-preview">{itemPreview}</div>
          )}
        </div>

        <div className="education-modal-footer">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger-confirm"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
