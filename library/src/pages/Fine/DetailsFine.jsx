//Trải nghiệm AI ngay trong các ứng dụng bạn yêu thích … Dùng Gemini để tạo bản nháp và tinh chỉnh nội dung, đồng thời sử dụng Gemini Pro để khai thác AI thế hệ mới của Google với giá 489.000 ₫ 0 ₫ cho 1 tháng
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Calendar, Edit, DollarSign, FileText } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/DetailsFine.css";

const DetailFine = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("penalties");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fine, setFine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pathToItem = {
      "/dashboard": "home",
      "/books": "books",
      "/readers": "readers",
      "/categorys": "category",
      "/librarians": "librarians",
      "/borrows": "borrows",
      "/penalties": "penalties",
      "/reports": "reports",
    };
    setActiveMenuItem(pathToItem[location.pathname] || "penalties");
  }, [location.pathname]);

  useEffect(() => {
    fetchFine();
  }, [id]);

  const fetchFine = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/fines/${id}`);
      setFine(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching fine:", error);
      toast.error("Failed to load fine details!");
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/penalties");
  };

  const handleEdit = () => {
    navigate(`/penalties/edit/${id}`);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleMenuClick = (itemId) => {
    setActiveMenuItem(itemId);
  };

  if (loading) {
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
            <div className="detail-fine-loading">Loading...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!fine) {
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
            <div className="detail-fine-error">Fine not found</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="my-project-container">
      <ToastContainer autoClose={3000} />
      <NavBar userName="Admin" onToggleSidebar={toggleSidebar} />

      <div className="main-layout">
        <SideBar
          activeItem={activeMenuItem}
          onItemClick={handleMenuClick}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />

        <main className="main-content">
          <div className="detail-fine-header">
            <button
              onClick={handleBack}
              className="detail-fine-btn-back"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="detail-fine-h1">
              Fine Management / Fine Details
            </h1>
          </div>

          <div className="detail-fine-wrapper">
            <div className="detail-fine-container">
              <div className="detail-fine-icon-section">
                <div className="detail-fine-icon">
                  <DollarSign size={32} />
                </div>
              </div>

              <div className="detail-fine-info-section">
                <h2 className="detail-fine-title">Fine Information</h2>

                <div className="detail-fine-info-item">
                  <span className="detail-fine-label">Fine ID:</span>
                  <span className="detail-fine-value">{fine.fineId}</span>
                </div>

                <div className="detail-fine-info-item">
                  <span className="detail-fine-label">Borrow ID:</span>
                  <span className="detail-fine-value">{fine.borrowId}</span>
                </div>

                <div className="detail-fine-info-item">
                  <span className="detail-fine-label">Fine Amount:</span>
                  <span className="detail-fine-value">
                    {fine.amount} VND
                  </span>
                </div>

                <div className="detail-fine-info-item">
                  <span className="detail-fine-label">Fine Date:</span>
                  <span className="detail-fine-value">{fine.fineDate}</span>
                </div>

                <div className="detail-fine-info-item">
                  <span className="detail-fine-label">Reason:</span>
                  <span className="detail-fine-value">{fine.reason}</span>
                </div>

                <div className="detail-fine-info-item">
                  <span className="detail-fine-label">Status:</span>
                  <span className="detail-fine-value">{fine.status}</span>
                </div>

                <div className="detail-fine-info-item">
                  <span className="detail-fine-label">Created At:</span>
                  <span className="detail-fine-value">{fine.createdAt}</span>
                </div>

                <div className="detail-fine-info-item">
                  <span className="detail-fine-label">Updated At:</span>
                  <span className="detail-fine-value">
                    {fine.updatedAt || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-fine-actions">
              <button onClick={handleEdit} className="detail-fine-btn-edit">
                <Edit size={20} />
                Edit Fine
              </button>
              <button onClick={handleBack} className="detail-fine-btn-cancel">
                Back to List
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetailFine;