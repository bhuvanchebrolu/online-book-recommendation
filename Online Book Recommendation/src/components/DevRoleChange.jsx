import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function DevRoleChanger() {
  const { user, fetchUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const changeRole = async (newRole) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/auth/dev/change-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        alert(`Role changed to ${newRole}! Refreshing...`);
        await fetchUser(); // Refresh user data
        window.location.reload(); // Reload to update UI
      } else {
        alert("Failed to change role");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3>🔧 Dev Tools (Testing Only)</h3>
        <p>Current Role: <strong>{user.role}</strong></p>
        <div style={styles.buttonGroup}>
          <button
            onClick={() => changeRole("student")}
            disabled={loading || user.role === "student"}
            style={styles.button}
          >
            Switch to Student
          </button>
          <button
            onClick={() => changeRole("professor")}
            disabled={loading || user.role === "professor"}
            style={styles.button}
          >
            Switch to Professor
          </button>
          <button
            onClick={() => changeRole("hod")}
            disabled={loading || user.role === "hod"}
            style={styles.button}
          >
            Switch to HOD
          </button>
          <button
            onClick={() => changeRole("admin")}
            disabled={loading || user.role === "admin"}
            style={styles.button}
          >
            Switch to Admin
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
  card: {
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    border: "2px solid #f59e0b",
    minWidth: "280px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "12px",
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#1f3a8a",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
};