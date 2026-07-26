import React from "react";
import "./SearchBar.css";
import { copyTableData, downloadCSV, printTable } from "../../../utils/tableActions";

const SearchBar = ({ search, setSearch, handleSearch, clearSearch, data }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="searchRow">
      {/* Search input */}
      <div className="searchRow__inputWrap">
        {/* <span className="searchRow__icon">🔍</span> */}
        <input
          className="searchInput"
          placeholder="Search by title, author, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <button className="searchRow__btn searchRow__btn--primary" onClick={handleSearch}>
        Search
      </button>
      <button className="searchRow__btn" onClick={clearSearch}>
        Clear
      </button>

      {/* Divider */}
      <div className="searchRow__divider" />

      <button className="searchRow__btn" onClick={() => downloadCSV(data)} title="Download CSV">
        CSV
      </button>
      <button className="searchRow__btn" onClick={() => copyTableData(data)} title="Copy to clipboard">
        Copy
      </button>
      <button className="searchRow__btn" onClick={printTable} title="Print">
        Print
      </button>
    </div>
  );
};

export default SearchBar;