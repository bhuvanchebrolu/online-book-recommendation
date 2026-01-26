import React from "react";
import "./ConfirmModal.css";

const ConfirmModal = ({
  open,
  title,
  books,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div className="modalOverlay">
      <div className="modalBox">
        <h3 className="modalTitle">{title}</h3>

        <div className="modalMessage">
          {books.length > 0 ? (
            <ul>
              {books.map((b) => (
                <li key={b._id}>{b.title}</li>
              ))}
            </ul>
          ) : (
            <p>No books selected.</p>
          )}
        </div>
        <div className="modalActions">
            <button className="confirmBtn" onClick={onConfirm}>{confirmText}</button>
            <button className="cancelBtn" onClick={onCancel}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
