import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axios";
import "./Login.css"; // shared auth styles

const DEPARTMENTS = ["CSE", "ECE", "EEE", "ICE"];

export default function Register() {
  const { role }        = useParams();              // "faculty" | "hod"
  const resolvedRole    = role === "hod" ? "hod" : "professor";
  const roleLabel       = role === "hod" ? "HOD" : "Faculty";

  const { login }       = useAuth();
  const navigate        = useNavigate();

  const [step, setStep]       = useState("email"); // "email" | "otp" | "details"
  const [email, setEmail]     = useState("");
  const [otp, setOtp]         = useState("");
  const [form, setForm]       = useState({ name: "", password: "", confirmPassword: "", department: "" });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const stepIndex = { email: 0, otp: 1, details: 2 }[step];

  // ── Countdown timer for resend ──────────────────────────────
  const startCountdown = () => {
    setCountdown(60);
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(t); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  // ── Step 1: Send OTP ────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email });
      setSuccess(`OTP sent to ${email}. Check your inbox.`);
      setStep("otp");
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ──────────────────────────────────────────────
  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email });
      setSuccess("New OTP sent!");
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setSuccess("Email verified! Complete your profile below.");
      setError("");
      setStep("details");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Register ────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim())
      return setError("Full name is required.");
    if (!form.department)
      return setError("Please select a department.");
    if (form.password.length < 8)
      return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match.");

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name:       form.name.trim(),
        email,
        password:   form.password,
        department: form.department,
        role:       resolvedRole,
      });
      login(res.data.user);
      navigate("/login-success");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* ── Header ── */}
        <div className="auth-header">
          <div className="auth-logo">📚</div>
          <h1 className="auth-title">LibRecommend</h1>
          <p className="auth-subtitle">NITT Library System</p>
        </div>

        <h2 className="auth-heading">Register as {roleLabel}</h2>

        {/* ── Step indicator ── */}
        <div className="auth-steps">
          {[
            { label: "Verify Email" },
            { label: "Enter OTP"   },
            { label: "Your Details"},
          ].map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="auth-step-divider" />}
              <div
                className={`auth-step ${
                  i < stepIndex ? "done" : i === stepIndex ? "active" : ""
                }`}
              >
                <div className="auth-step-num">
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span>{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {error   && <div className="auth-error">{error}</div>}
        {success && !error && <div className="auth-success">{success}</div>}

        {/* ══════════════════════════════════════════════
            STEP 1 — Email
        ══════════════════════════════════════════════ */}
        {step === "email" && (
          <form onSubmit={handleSendOtp} className="auth-form">
            <div className="auth-field">
              <label>NITT Email address</label>
              <input
                type="email"
                placeholder="yourname@nitt.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP →"}
            </button>
          </form>
        )}

        {/* ══════════════════════════════════════════════
            STEP 2 — OTP
        ══════════════════════════════════════════════ */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <div className="auth-field">
              <label>6-digit OTP sent to {email}</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="auth-otp-input"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP →"}
            </button>

            <button
              type="button"
              className="auth-btn auth-btn--outline"
              onClick={handleResendOtp}
              disabled={countdown > 0 || loading}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
            </button>

            <button
              type="button"
              className="auth-btn auth-btn--outline"
              onClick={() => { setStep("email"); setOtp(""); setError(""); setSuccess(""); }}
            >
              ← Change email
            </button>
          </form>
        )}

        {/* ══════════════════════════════════════════════
            STEP 3 — Details
        ══════════════════════════════════════════════ */}
        {step === "details" && (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder={role === "hod" ? "Dr. Full Name" : "Prof. Full Name"}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                autoFocus
              />
            </div>

            <div className="auth-field">
              <label>Department</label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                required
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Creating account..." : `Create ${roleLabel} Account`}
            </button>
          </form>
        )}

        {/* Footer links */}
        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Sign in</Link>
          <br />
          {role === "faculty"
            ? <><Link to="/register/hod">Register as HOD instead</Link></>
            : <><Link to="/register/faculty">Register as Faculty instead</Link></>
          }
        </p>
      </div>

      <div className="auth-page-footer">
        © {new Date().getFullYear()} National Institute of Technology, Tiruchirappalli
      </div>
    </div>
  );
}