export default function Login() {
  const loginWithDAuth = () => {
    window.location.href = "http://localhost:8080/auth/dauth";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>NITT Library Recommendation Portal</h2>

        <p style={styles.text}>
          This portal allows faculty members to recommend books for the
          institute library and enables the Head of Department to review and
          approve recommendations.
        </p>

        <p style={styles.text}>
          Please sign in using your NITT institutional account to continue.
        </p>

        <button style={styles.button} onClick={loginWithDAuth}>
          Sign in with NITT
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
  },
  title: {
    marginBottom: "16px",
    fontWeight: "600",
  },
  text: {
    marginBottom: "16px",
    color: "#333",
    fontSize: "15px",
    lineHeight: "1.5",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#1f3a8a",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "15px",
    cursor: "pointer",
  },
};
