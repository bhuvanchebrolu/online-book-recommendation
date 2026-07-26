import React from "react";
import "./BottomActions.css";

const BottomActions = ({ onApprove, onReject, selectedCount = 0 }) => {
  return (
    <div className="bottomActions">
      <span className="bottomActions__count">
        {selectedCount > 0
          ? `${selectedCount} book${selectedCount > 1 ? "s" : ""} selected`
          : "No books selected"}
      </span>
      <div className="bottomActions__btns">
        <button
          className="actionBtn actionBtn--approve"
          onClick={onApprove}
          disabled={selectedCount === 0}
        >
          ✓ Approve selected
        </button>
        <button
          className="actionBtn actionBtn--reject"
          onClick={onReject}
          disabled={selectedCount === 0}
        >
          ✕ Reject selected
        </button>
      </div>
    </div>
  );
};

export default BottomActions;