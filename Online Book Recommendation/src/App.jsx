import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Form from './pages/Form'
import AllRecommend from './pages/AllRecommend';
import ApprovalPage from './hod/pages/ApprovalPage';
import RecommmendationStatusPage from './hod/pages/RecommmendationStatusPage';
import Message from './Message/Message';


export default function App() {
  return (
    <BrowserRouter>

      <Message/>
      <Routes>
        <Route path="/hod/approval" element={<ApprovalPage/>}/> 
        <Route path="/hod/processed" element={<RecommmendationStatusPage/>}/>
        <Route path="/recommend" element={<AllRecommend/>}/>
        <Route path="/recommend/new" element={<Form/>}/>
      </Routes>
    </BrowserRouter>
  )
}
