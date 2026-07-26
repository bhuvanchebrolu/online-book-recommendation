import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/axios";
import "./Navbar.css";

const BellIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user?.role === "hod") {
      api
        .get("/api/recommend/pending")
        .then((res) => setPendingCount(res.data.length))
        .catch(() => setPendingCount(0));
    }
  }, [user, location.pathname]);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    onLogout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar__inner">

        {/* Brand */}
        <div className="navbar__brand" onClick={() => navigate("/login-success")}>
          <span className="navbar__brand-icon">📚</span>
          <div className="navbar__brand-text">
            <span className="navbar__brand-title">LibRecommend</span>
            <span className="navbar__brand-sub">NITT Library System</span>
          </div>
        </div>

        {/* Desktop Links */}
        <ul className="navbar__links">

          {/* PROFESSOR + HOD */}
          {(user?.role === "professor" || user?.role === "hod") && (
            <>
              <li>
                <button
                  className={`navbar__link ${isActive("/recommend") ? "navbar__link--active" : ""}`}
                  onClick={() => navigate("/recommend")}
                >
                  All Recommendations
                </button>
              </li>
              <li>
                <button
                  className={`navbar__link ${isActive("/recommend/new") ? "navbar__link--active" : ""}`}
                  onClick={() => navigate("/recommend/new")}
                >
                  + New Recommendation
                </button>
              </li>
            </>
          )}

          {/* HOD ONLY */}
          {user?.role === "hod" && (
            <li>
              <button
                className={`navbar__link ${isActive("/hod/processed") ? "navbar__link--active" : ""}`}
                onClick={() => navigate("/hod/processed")}
              >
                Approved / Rejected
              </button>
            </li>
          )}

          {/* ADMIN ONLY */}
          {user?.role === "admin" && (
            <li>
              <button
                className={`navbar__link ${isActive("/admin/processed") ? "navbar__link--active" : ""}`}
                onClick={() => navigate("/admin/processed")}
              >
                Admin Panel
              </button>
            </li>
          )}
        </ul>

        {/* Right Side */}
        <div className="navbar__right">
          {user && (
            <>
              {/* HOD Bell */}
              {user.role === "hod" && (
                <button
                  className={`navbar__bell ${isActive("/hod/approval") ? "navbar__bell--active" : ""}`}
                  onClick={() => navigate("/hod/approval")}
                  title="Pending Approvals"
                >
                  <BellIcon />
                  {pendingCount > 0 && (
                    <span className="navbar__badge">{pendingCount}</span>
                  )}
                </button>
              )}

              <div className="navbar__user">
                <div className="navbar__avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="navbar__user-info">
                  <span className="navbar__user-name">{user.name}</span>
                  <span className={`navbar__role navbar__role--${user.role}`}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </div>

              <button className="navbar__logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? "navbar__hamburger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="navbar__mobile">
          {(user?.role === "professor" || user?.role === "hod") && (
            <>
              <button onClick={() => { navigate("/recommend"); close(); }}>
                All Recommendations
              </button>
              <button onClick={() => { navigate("/recommend/new"); close(); }}>
                + New Recommendation
              </button>
            </>
          )}
          {user?.role === "hod" && (
            <>
              <button onClick={() => { navigate("/hod/processed"); close(); }}>
                Approved / Rejected
              </button>
              <button onClick={() => { navigate("/hod/approval"); close(); }}>
                <BellIcon /> Pending Approvals
                {pendingCount > 0 && (
                  <span className="navbar__badge navbar__badge--inline">
                    {pendingCount}
                  </span>
                )}
              </button>
            </>
          )}
          {user?.role === "admin" && (
            <button onClick={() => { navigate("/admin/processed"); close(); }}>
              Admin Panel
            </button>
          )}
          <button className="navbar__mobile-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;