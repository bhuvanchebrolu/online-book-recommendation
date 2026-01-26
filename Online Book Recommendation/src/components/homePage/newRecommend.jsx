import React from 'react'
import { useNavigate } from 'react-router-dom';
import "./newRecommend.css";

const NewRecommendBtn = () => {
    const navigate=useNavigate();
  return (
    <div >
        <button onClick={()=>{
            navigate("/recommend/new");
        }} className='newRecBtn'>+ New Recommendation</button>
    </div>
  )
}

export default NewRecommendBtn
