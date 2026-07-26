import React from 'react';
import "./Hero.css";

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero__badge">NITT Central Library</div>
      <h1 className="hero__title">Online Book Recommendation System</h1>
      <p className="hero__subtitle">
        Faculty members and department heads can recommend books for the central library collection through this portal.
      </p>

      <div className="hero__cards">
        <div className="hero__card">
          <div className="hero__card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div>
            <div className="hero__card-title">Fill the form</div>
            <div className="hero__card-desc">Submit your book recommendation with all relevant details</div>
          </div>
        </div>

        <div className="hero__card">
          <div className="hero__card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div>
            <div className="hero__card-title">HoD approval</div>
            <div className="hero__card-desc">Your recommendation is automatically routed to your HoD for review</div>
          </div>
        </div>

        <div className="hero__card">
          <div className="hero__card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div>
            <div className="hero__card-title">Email notification</div>
            <div className="hero__card-desc">You'll receive a confirmation once the decision is made</div>
          </div>
        </div>
      </div>

      <div className="hero__contact">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        For queries, contact the library. Approving authority: <strong>Librarian</strong>
      </div>
    </div>
  );
}