import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      navigate("/login", { replace: true });
    });
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>You have been logged out</h2>
        <p style={styles.text}>
          Your session has ended successfully. Please log in again if you wish
          to continue using the portal.
        </p>
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
    width: "400px",
    padding: "28px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  text: {
    marginTop: "12px",
    fontSize: "15px",
    color: "#333",
  },
};
