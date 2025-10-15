import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

const Borrow = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("muon-tra");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const pathToItem = {
      "/": "trang-chu",
      "/books": "sach",
      "/readers": "doc-gia",
      "/categorys": "the-loai",
      "/librarians": "thu-thu",
      "/borrows": "muon-tra",
      "/penalties": "phat",
      "/reports": "bao-cao",
    };
    setActiveMenuItem(pathToItem[location.pathname] || "trang-chu");
  }, [location.pathname]);

  const handleMenuClick = (itemId) => {
    setActiveMenuItem(itemId);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="my-project-container">
      <NavBar userName="Admin" onToggleSidebar={toggleSidebar} />

      <div className="main-layout">
        <SideBar
          activeItem={activeMenuItem}
          onItemClick={handleMenuClick}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />

        <main className="main-content">
          Mọi người code chức năng Mượn trả trong thẻ Main nhé
        </main>
      </div>
    </div>
  );
};

export default Borrow;
