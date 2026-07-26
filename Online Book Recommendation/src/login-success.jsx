import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function LoginSuccess() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === "hod") {
          navigate("/hod/approval", { replace: true });
        } else if (user.role === "professor") {
          navigate("/recommend", { replace: true });
        } else if (user.role === "student") {
          navigate("/student-access-denied", { replace: true });
        }else if(user.role==="admin"){
          navigate("/admin/processed",{replace:true});
        }
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Loading your profile...</p>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      <p>Redirecting...</p>
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
};