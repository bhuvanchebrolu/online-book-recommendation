import React from "react";
import "./SearchBar.css";
import { copyTableData, downloadCSV, printTable } from "../../../utils/tableActions";


const SearchBar = ({ search, setSearch ,handleSearch,clearSearch,data}) => {
  return (
    <div className="searchRow">
      <label>Search:</label>
      <input
        className="searchInput"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={handleSearch}>Go</button>
      <button onClick={clearSearch}>Clear Filter</button>
      <button onClick={()=>downloadCSV(data)}>CSV</button>
      <button onClick={()=>copyTableData(data)}>Copy</button>
      <button onClick={printTable}>Print</button>
    </div>
  );
};

export default SearchBar;
