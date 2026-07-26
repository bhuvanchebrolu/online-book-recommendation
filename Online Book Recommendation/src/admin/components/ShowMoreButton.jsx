import React from "react";
import "./ShowMoreButton.css";

const ShowMoreButton = ({ total, onClick }) => {
  return (
    <div className="showMore">
      <button onClick={onClick}>
        Show all records ({total})
      </button>
    </div>
  );
};

export default ShowMoreButton;
