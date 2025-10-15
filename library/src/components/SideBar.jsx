import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  Book,
  User,
  FolderOpen,
  Package,
  Mail,
  BarChart3,
  ChevronRight,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/SideBar.css";
import "../styles/ProgressBar.css";

const SideBar = ({ activeItem, onItemClick, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const sidebarRef = useRef(null);

  const menuItems = [
    {
      id: "trang-chu",
      icon: Home,
      label: "Trang chủ",
      hasSubmenu: true,
      path: "/dashboard",
    },
    { id: "sach", icon: Book, label: "Sách", hasSubmenu: true, path: "/books" },
    {
      id: "doc-gia",
      icon: User,
      label: "Độc giả",
      hasSubmenu: true,
      path: "/readers",
    },
    {
      id: "the-loai",
      icon: FolderOpen,
      label: "Thể loại",
      hasSubmenu: true,
      path: "/categorys",
    },
    {
      id: "thu-thu",
      icon: User,
      label: "Thủ thư",
      hasSubmenu: true,
      path: "/librarians",
    },
    {
      id: "muon-tra",
      icon: Package,
      label: "Mượn trả",
      hasSubmenu: true,
      path: "/borrows",
    },
    {
      id: "phat",
      icon: Mail,
      label: "Phạt",
      hasSubmenu: true,
      path: "/penalties",
    },
    {
      id: "bao-cao",
      icon: BarChart3,
      label: "Báo cáo",
      hasSubmenu: true,
      path: "/reports",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleClickOutside = (event) => {
      if (
        isMobile &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".toggle-sidebar-btn")
      ) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isOpen, onClose]);

  const handleItemClick = (itemId, path) => {
    setIsLoading(true);
    onItemClick(itemId);

    if (isMobile) {
      setTimeout(() => {
        navigate(path);
        onClose();
        setTimeout(() => setIsLoading(false), 1000);
      }, 600);
    } else {
      setTimeout(() => {
        navigate(path);
        setTimeout(() => setIsLoading(false), 1000);
      }, 600);
    }
  };

  return (
    <>
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}
      <div className={`progress-bar ${isLoading ? "active" : ""}`}></div>
      <aside
        ref={sidebarRef}
        className={`sidebar ${isMobile && isOpen ? "open" : ""} ${
          isMobile && !isOpen ? "closed" : ""
        }`}
      >
        {isMobile && (
          <button className="close-sidebar-btn" onClick={onClose}>
            <X size={24} />
          </button>
        )}
        <div className="sidebar-content">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <div
                key={item.id}
                className={`menu-item ${isActive ? "active" : ""}`}
                onClick={() => handleItemClick(item.id, item.path)}
              >
                <Icon size={20} className="menu-icon" />
                <span className="menu-label">{item.label}</span>
                {item.hasSubmenu && (
                  <ChevronRight size={16} className="menu-chevron" />
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
