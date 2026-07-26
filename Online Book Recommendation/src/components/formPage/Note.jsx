import React from 'react';
import './Note.css';

const notes = [
  "Central Library collections consist of four categories. Multiple copies of TextBooks and Book Bank can be recommended as per requirement.",
  "To recommend a book under more than one category, add the quantity and select the collection category accordingly.",
  "Books recommended for a department library will be transferred to the concerned department.",
];

export default function Note() {
  return (
    <div className="note">
      <div className="note__header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Important Notes
      </div>
      <ol className="note__list">
        {notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ol>
    </div>
  );
}