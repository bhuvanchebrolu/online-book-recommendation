import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function LoginSuccess() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "hod") navigate("/hod/approval");
      else if (user.role === "professor") navigate("/recommend");
      else navigate("/recommend/new");
    } else if (!loading && !user) {
      navigate("/login"); // redirect if unauthorized
    }
  }, [user, loading]);

  return <p>Logging you in...</p>;
}
