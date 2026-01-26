import React, { useState } from 'react'
import "./SearchBar.css";
import { useMessage } from '../../context/MessageContext';
const SearchBar = ({setSearch}) => {
    const [input,setInput]=useState("");
    const handleSearch=()=>{
        setSearch(input);
        showMessage("Applied filter successfully","success");
    };
    const {showMessage}=useMessage();
  return (
    <div className='searchWrapper'>
        <label className="searchLabel">Search for:</label>
        <input
            type="text"
            className='searchInput'
            placeholder='Search title,author,department,itemType...'
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            
        />
        <button className='searchBtn' onClick={handleSearch}>GO</button>
    </div>
  )
}

export default SearchBar
