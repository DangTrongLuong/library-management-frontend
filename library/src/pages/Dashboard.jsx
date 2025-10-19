import React, { useState } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { Book, User, Package, BarChart3 } from "lucide-react";
import "../styles/Dashboard.css";

const Dashboard = ({ setLoading }) => {
  const [activeMenuItem, setActiveMenuItem] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <div className="content-inner">
            <h1 className="page-title">
              Chào mừng đến với Hệ thống Quản lý Thư viện
            </h1>
            <p className="page-subtitle">Giao diẹn test</p>

            <div className="card-grid">
              <div className="card">
                <Book size={40} color="#0084FF" />
                <h3 className="card-title">Quản lý Sách</h3>
                <p className="card-text">Thêm, sửa, xóa thông tin sách</p>
              </div>

              <div className="card">
                <User size={40} color="#0084FF" />
                <h3 className="card-title">Quản lý Độc giả</h3>
                <p className="card-text">Quản lý thông tin độc giả</p>
              </div>

              <div className="card">
                <Package size={40} color="#0084FF" />
                <h3 className="card-title">Mượn trả</h3>
                <p className="card-text">Xử lý mượn và trả sách</p>
              </div>

              <div className="card">
                <BarChart3 size={40} color="#0084FF" />
                <h3 className="card-title">Báo cáo</h3>
                <p className="card-text">Thống kê và báo cáo</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
