import React from 'react'
import "./Hero.css";

export default function Hero() {
  return (
    <div>
      <h1 className='heroHeading'>Online Book Recommendation System</h1>
      <div className='heroInstrn'>
        <div>Welcome to the Online Book Recommendation System.The Faculty members can recommend the book(s) for the central library through the online system</div> 
        <div>Please fill out the form to make a new recommendation. The online system will automatically sought the approval form to the concerned HoD/HoC/HoS.You will receive an email once your department head approves/disapprove your recommendation</div>
        <div>Please free to contact Library details</div>
        <div>Approving authority :<span className='libraryHOD'> LIBRARY HOD (HoD) </span></div>
      </div>
    </div>
  )
}
