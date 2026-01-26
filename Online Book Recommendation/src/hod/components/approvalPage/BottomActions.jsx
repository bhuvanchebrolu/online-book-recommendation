import React from 'react'
import "./BottomActions.css";
const BottomActions = ({onApprove, onReject }) => {
  return (
    <div className='bottomActions'>
      <button className='approveBtn' onClick={onApprove}>Approve Selected</button>
      <button className='rejectBtn' onClick={onReject}>Reject Selected</button>
    </div>
  )
}

export default BottomActions 
