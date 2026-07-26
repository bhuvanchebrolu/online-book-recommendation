import React from "react";
import "./TopButton.css";

const TopButtons = ({ selectAll, clearAll, displayAll, filtered }) => {
  return (
    <div className="topActions">
      <div className="topActions__left">
        <button onClick={selectAll}>Select all</button>
        <button onClick={clearAll}>Clear all</button>
        <button onClick={displayAll}>Show all ({filtered.length})</button>
      </div>
    </div>
  );
};

export default TopButtons;