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

  const isApprove = confirmText?.toLowerCase().includes("approve");

  return (
    <div className="modalOverlay" onClick={onCancel}>
      <div className="modalBox" onClick={(e) => e.stopPropagation()}>

        {/* Icon + title */}
        <div className="modalHeader">
          <div className={`modalIcon ${isApprove ? "modalIcon--approve" : "modalIcon--reject"}`}>
            {isApprove ? "✓" : "✕"}
          </div>
          <h3 className="modalTitle">{title}</h3>
        </div>

        {/* Book list */}
        <div className="modalBody">
          {books.length > 0 ? (
            <>
              <p className="modalBodyLabel">
                {books.length} book{books.length > 1 ? "s" : ""} will be affected:
              </p>
              <ul className="modalBookList">
                {books.map((b) => (
                  <li key={b.id} className="modalBookItem">
                    <span className="modalBookTitle">{b.title}</span>
                    <span className="modalBookAuthor">{b.author}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="modalBodyLabel">No books selected.</p>
          )}
        </div>

        {/* Actions */}
        <div className="modalActions">
          <button className="modalBtn modalBtn--cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`modalBtn ${isApprove ? "modalBtn--approve" : "modalBtn--reject"}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;