import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axios";
import "./Login.css";

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user);
      navigate("/login-success");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">📚</div>
          <h1 className="auth-title">LibRecommend</h1>
          <p className="auth-subtitle">NITT Library System</p>
        </div>

        <h2 className="auth-heading">Sign in to your account</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="yourname@nitt.edu"
              value={form.email}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{" "}
          <Link to="/register/faculty">Register as Faculty</Link>
          {" · "}
          <Link to="/register/hod">Register as HOD</Link>
        </p>
      </div>

      <div className="auth-page-footer">
        © {new Date().getFullYear()} National Institute of Technology, Tiruchirappalli
      </div>
    </div>
  );
}