import React from "react";
import "./SearchBar.css";
import {
  copyTableData,
  downloadCSV,
  printTable,
} from "../../utils/tableActions.js";

const SearchBar = ({ search, setSearch, handleSearch, clearSearch, data }) => {
  return (
    <div className="searchRow">
      <label>Search:</label>
      <input
        className="searchInput"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Title / Author / Professor / Department"
      />

      <button onClick={handleSearch}>Search</button>
      <button onClick={clearSearch}>Clear</button>
      <button onClick={() => downloadCSV(data)}>CSV</button>
      <button onClick={() => copyTableData(data)}>Copy</button>
      <button onClick={printTable}>Print</button>
    </div>
  );
};

export default SearchBar;
