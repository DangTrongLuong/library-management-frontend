import React, { useState, useEffect, useRef } from "react";
import { User, LogOut, ChevronRight, X, Menu } from "lucide-react";
import "../styles/NavBar.css";
import logo_library from "../assets/logocmc.png";
import admin from "../assets/admin.png";
// Nếu dùng React Router, uncomment dòng dưới:
// import { useNavigate } from "react-router-dom";

const NavBar = ({ userName = "Người dùng", onToggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="logo-section">
          {isMobile && (
            <button className="toggle-sidebar-btn" onClick={onToggleSidebar}>
              <Menu size={24} />
            </button>
          )}
          <div className="logo-image">
            <img src={logo_library} alt="logo library" className="img"></img>
          </div>
          {!isMobile && (
            <div className="logo-text-content">
              <span className="logo-text">LMS</span>
              <p>Library Management System</p>
            </div>
          )}
        </div>

        <div className="user-section">
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <div className="avatar">
              <div className="admin-avatar">
                <img src={admin} className="img-admin"></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
