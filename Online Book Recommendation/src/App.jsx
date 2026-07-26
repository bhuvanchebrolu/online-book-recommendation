import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Form from "./pages/Form";
import AllRecommend from "./pages/AllRecommend";
import ApprovalPage from "./hod/pages/ApprovalPage";
import RecommmendationStatusPage from "./hod/pages/RecommmendationStatusPage";
import Message from "./Message/Message";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./Logout";
import LoginSuccess from "./login-success";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import DevRoleChanger from "./components/DevRoleChange";
import AdminRecommendationsPage from "./admin/pages/AdminRecommendationsPage";
import Layout from "./layouts/Layout";

function StudentMessage() {
  const { logout } = useAuth();
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Access Restricted</h2>
        <p style={styles.text}>
          This portal is only accessible to faculty members and HODs. Students
          do not have access to this system.
        </p>
        <button style={styles.button} onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
  },
  card: {
    width: "420px",
    padding: "32px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  text: {
    marginBottom: "20px",
    color: "#333",
    fontSize: "15px",
    lineHeight: "1.5",
  },
  button: {
    padding: "10px 24px",
    backgroundColor: "#1f3a8a",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "15px",
    cursor: "pointer",
  },
};

const NO_LAYOUT_PREFIXES = [
  "/login",
  "/logout",
  "/login-success",
  "/student-access-denied",
  "/register",
];

export default function App() {
  const { user, logout } = useAuth();
  const location = useLocation(); // ✅ reactive hook instead of window.location

  const isNoLayout = NO_LAYOUT_PREFIXES.some((p) =>
    location.pathname.startsWith(p), // ✅ fixed
  );

  const routes = (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/register/:role" element={<Register />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/login-success" element={<LoginSuccess />} />
      <Route path="/student-access-denied" element={<StudentMessage />} />

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

      {/* PROFESSOR + HOD */}
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

      {/* ADMIN + HOD */}
      <Route
        path="/admin/processed"
        element={
          <ProtectedRoute roles={["hod", "admin"]}>
            <AdminRecommendationsPage />
          </ProtectedRoute>
        }
      />

      {/* DEFAULT */}
      <Route path="/" element={<Navigate to="/login-success" />} />
    </Routes>
  );

  return (
    <>
      <Message />
      {/* {process.env.NODE_ENV !== "production" && <DevRoleChanger />} */}
      {isNoLayout ? (
        routes
      ) : (
        <Layout user={user} onLogout={logout}>
          {routes}
        </Layout>
      )}
    </>
  );
}