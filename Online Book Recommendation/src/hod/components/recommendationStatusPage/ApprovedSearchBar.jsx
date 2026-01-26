import React from 'react'
import "./ApprovedSearchBar.css";

const ApprovedSearchBar = ({search,setSearch,handleSearch,clearSearch}) => {
  return (
    <div className='approvedSearchBar'>
      <label>Search: </label>
      <input
        type="text"
        value={search}
        placeholder='search by title,author,dept,item type,...'
        onChange={(e)=>setSearch(e.target.value)}
      />
      <button onClick={handleSearch} className='searchBtn'>Go</button>
      <button onClick={clearSearch} className='clearBtn'>Clear</button>
    </div>
  )
}

export default ApprovedSearchBar
