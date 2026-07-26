import React, { useState } from 'react';
import "./SearchBar.css";
import { useMessage } from '../../context/MessageContext';

const SearchBar = ({ setSearch }) => {
  const [input, setInput] = useState("");
  const { showMessage } = useMessage();

  const handleSearch = () => {
    setSearch(input);
    if (input.trim()) showMessage("Filter applied", "success");
  };

  const handleClear = () => {
    setInput("");
    setSearch("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="searchWrapper">
      <div className="searchInputGroup">
        {/* <span className="searchIcon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span> */}
        <input
          type="text"
          className="searchInput"
          placeholder="Search by title, author, department, type…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {input && (
          <button className="searchClear" onClick={handleClear} aria-label="Clear search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>
      <button className="searchBtn" onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;