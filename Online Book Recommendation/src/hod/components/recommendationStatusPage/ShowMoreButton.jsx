import React from 'react'
import "./ShowMoreButton.css";
const ShowMoreButton = ({total,onClick}) => {
  return (
    <div className='showMoreWrapper'>
        <button className='showMoreBtn' onClick={onClick}>
            Show All({total})
        </button>
    </div>
  )
}

export default ShowMoreButton
