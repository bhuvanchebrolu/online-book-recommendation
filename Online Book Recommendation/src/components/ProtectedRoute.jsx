import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
  return (
    <div style={{ textAlign: "center", marginTop: "40vh" }}>
      <p>Loading your account…</p>
    </div>
  );
}

  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}
