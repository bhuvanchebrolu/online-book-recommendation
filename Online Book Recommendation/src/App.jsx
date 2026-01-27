import { Routes, Route, Navigate } from "react-router-dom";
import Form from './pages/Form';
import AllRecommend from './pages/AllRecommend';
import ApprovalPage from './hod/pages/ApprovalPage';
import RecommmendationStatusPage from './hod/pages/RecommmendationStatusPage';
import Message from './Message/Message';
import Login from './Login';
import Logout from "./Logout";
import LoginSuccess from './login-success';
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Message />

      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout/>}/>
        <Route path="/login-success" element={<LoginSuccess />} />

        {/* HOD ONLY */}
        <Route
          path="/hod/approval"
          element={
            <ProtectedRoute roles={["hod"]}>
              <ApprovalPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hod/processed"
          element={
            <ProtectedRoute roles={["hod"]}>
              <RecommmendationStatusPage />
            </ProtectedRoute>
          }
        />

        {/* PROFESSOR */}
        <Route
          path="/recommend"
          element={
            <ProtectedRoute roles={["professor", "hod"]}>
              <AllRecommend />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommend/new"
          element={
            <ProtectedRoute roles={["professor", "hod"]}>
              <Form />
            </ProtectedRoute>
          }
        />

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login-success" />} />
      </Routes>
    </>
  );
}
