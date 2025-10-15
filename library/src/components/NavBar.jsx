import React, { useState, useEffect, useRef } from "react";
import { User, LogOut, ChevronRight, X, Menu } from "lucide-react";
import "../styles/NavBar.css";
import logo_library from "../assets/logo_library.png";
// Nếu dùng React Router, uncomment dòng dưới:
// import { useNavigate } from "react-router-dom";

const NavBar = ({ userName = "Người dùng", onToggleSidebar }) => {
  const [showLogout, setShowLogout] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const userSectionRef = useRef(null);

  const handleLogout = () => {
    window.location.reload();
  };

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleClickOutside = (event) => {
      if (
        userSectionRef.current &&
        !userSectionRef.current.contains(event.target)
      ) {
        setShowLogout(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
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
            <span className="logo-text">HỆ THỐNG QUẢN LÝ THƯ VIỆN</span>
          )}
        </div>

        <div className="user-section" ref={userSectionRef}>
          <div className="user-info" onClick={toggleLogout}>
            <div className="avatar">
              <User size={20} color="#fff" />
            </div>
            <span className="user-name">{userName}</span>
            <ChevronRight
              size={16}
              className={`chevron ${showLogout ? "open" : ""}`}
            />
          </div>

          {showLogout && (
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
