import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    {/* Option C accent strip */}
    <div className="footer__accent-strip" />

    <div className="footer__inner">

      {/* Brand — Option C style */}
      <div className="footer__brand">
        <div className="footer__brand-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="15" height="15" rx="2" fill="#E74C3C"/>
            <rect x="20" y="1" width="15" height="15" rx="2" fill="#3498DB"/>
            <rect x="1" y="20" width="15" height="15" rx="2" fill="#2ECC71"/>
            <rect x="20" y="20" width="15" height="15" rx="2" fill="#F1C40F"/>
          </svg>
        </div>
        <div>
          <div className="footer__brand-title">LibRecommend</div>
          <div className="footer__brand-sub">NITT · EST. 1964</div>
        </div>
      </div>

      {/* Quick Links — Option B style */}
      <div className="footer__links">
        <span className="footer__links-title">Quick Links</span>
        <a href="https://www.nitt.edu" target="_blank" rel="noreferrer">NITT Official Website</a>
        <a href="https://library.nitt.edu" target="_blank" rel="noreferrer">NITT Library Portal</a>
        <a href="mailto:library@nitt.edu">Contact Library</a>
      </div>

      {/* Contact — Option B style */}
      <div className="footer__contact">
        <span className="footer__links-title">Contact</span>
        <span>library@nitt.edu</span>
        <span>+91-431-2503000</span>
        <span>Tiruchirappalli – 620015</span>
      </div>

    </div>

    <div className="footer__bottom">
      <span>© {new Date().getFullYear()} NIT Tiruchirappalli. All rights reserved.</span>
      <span>Developed by NITT Library Team</span>
    </div>
  </footer>
);

export default Footer;