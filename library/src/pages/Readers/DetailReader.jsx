import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
} from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/DetailReader.css";

const DetailReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("readers");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reader, setReader] = useState(null);
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
    setActiveMenuItem(pathToItem[location.pathname] || "readers");
  }, [location.pathname]);

  useEffect(() => {
    fetchReader();
  }, [id]);

  const fetchReader = async () => {
    try {
      const response = await axios.get(`/api/readers/getReader/${id}`);
      setReader(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reader:", error);
      toast.error("Failed to load reader details!");
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/readers");
  };

  const handleEdit = () => {
    navigate(`/readers/editReader/${id}`);
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
            <div className="detail-reader-loading">Loading...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!reader) {
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
            <div className="detail-reader-error">Reader not found</div>
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
          <div className="detail-reader-header">
            <button
              onClick={handleBack}
              className="detail-reader-btn-back"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="detail-reader-h1">
              Readers Management / Reader Details
            </h1>
          </div>

          <div className="detail-reader-wrapper">
            <div className="detail-reader-container">
              <div className="detail-reader-avatar-section">
                <div className="detail-reader-avatar">
                  {reader.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="detail-reader-info-section">
                <h2 className="detail-reader-title">{reader.name}</h2>

                <div className="detail-reader-info-item">
                  <span className="detail-reader-label">Reader ID:</span>
                  <span className="detail-reader-value">{reader.readerId}</span>
                </div>

                <div className="detail-reader-info-item">
                  <span className="detail-reader-label">Phone:</span>
                  <span className="detail-reader-value">
                    {reader.numberPhone}
                  </span>
                </div>

                <div className="detail-reader-info-item">
                  <span className="detail-reader-label">Email:</span>
                  <span className="detail-reader-value">{reader.email}</span>
                </div>

                <div className="detail-reader-info-item">
                  <span className="detail-reader-label">Card Type:</span>
                  <span className="detail-reader-value">{reader.cardType}</span>
                </div>

                <div className="detail-reader-info-item">
                  <span className="detail-reader-label">
                    Registration Date:
                  </span>
                  <span className="detail-reader-value">
                    {reader.registrationDate}
                  </span>
                </div>

                <div className="detail-reader-info-item">
                  <span className="detail-reader-label">Address:</span>
                  <span className="detail-reader-value">
                    {reader.address || "N/A"}
                  </span>
                </div>

                <div className="detail-reader-info-item">
                  <span className="detail-reader-label">Created At:</span>
                  <span className="detail-reader-value">
                    {reader.createdAt}
                  </span>
                </div>

                <div className="detail-reader-info-item">
                  <span className="detail-reader-label">Updated At:</span>
                  <span className="detail-reader-value">
                    {reader.updatedAt || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-reader-actions">
              <button onClick={handleEdit} className="detail-reader-btn-edit">
                <Edit size={20} />
                Edit Reader
              </button>
              <button onClick={handleBack} className="detail-reader-btn-cancel">
                Back to List
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetailReader;
