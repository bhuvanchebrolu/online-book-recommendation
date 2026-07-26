import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Layout.css";

const Layout = ({ user, onLogout, children }) => (
  <div className="layout">
    <Navbar user={user} onLogout={onLogout} />
    <main className="layout__main">{children}</main>
    <Footer />
  </div>
);

export default Layout;