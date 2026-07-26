import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./newRecommend.css";

const NewRecommendBtn = () => {
  const navigate = useNavigate();
  return (
    <button
      className="newRecBtn"
      onClick={() => navigate("/recommend/new")}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      New Recommendation
    </button>
  );
};

export default NewRecommendBtn;