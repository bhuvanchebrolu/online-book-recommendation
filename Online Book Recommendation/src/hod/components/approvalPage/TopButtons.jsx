import React from 'react'
import "./TopButton.css";

const TopButtons = ({selectAll,clearAll,displayAll,filtered}) => {
  return (
    <div className='topActions'>
        <button onClick={selectAll}>Select All</button>
        <button onClick={clearAll}>Clear All</button>
        <button onClick={displayAll}>Show all ({filtered.length})</button>
    </div>
  )
}

export default TopButtons
