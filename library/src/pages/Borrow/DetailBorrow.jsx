import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, BookOpen, User, Calendar } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/DetailBorrow.css";

const DetailBorrow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("borrows");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [borrow, setBorrow] = useState(null);
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
    setActiveMenuItem(pathToItem[location.pathname] || "borrows");
  }, [location.pathname]);

  useEffect(() => {
    fetchBorrow();
  }, [id]);

  const fetchBorrow = async () => {
    try {
      const response = await axios.get(`/api/borrows/getBorrow/${id}`);
      setBorrow(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching borrow:", error);
      toast.error("Failed to load borrow details!");
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/borrows");
  };

  const handleEdit = () => {
    navigate(`/borrows/editBorrow/${id}`);
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
            <div className="detail-borrow-loading">Loading...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!borrow) {
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
            <div className="detail-borrow-error">Borrow not found</div>
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
          <div className="detail-borrow-header">
            <button
              onClick={handleBack}
              className="detail-borrow-btn-back"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="detail-borrow-h1">
              Borrow Management/ Borrow Details
            </h1>
          </div>

          <div className="detail-borrow-wrapper">
            <div className="detail-borrow-container">
              <div className="detail-borrow-info-section">
                <h2 className="detail-borrow-title">
                  Borrow ID: {borrow.borrowId}
                </h2>

                <div className="detail-borrow-info-item">
                  <span className="detail-borrow-label">Reader ID:</span>
                  <span className="detail-borrow-value">{borrow.readerId}</span>
                </div>

                <div className="detail-borrow-info-item">
                  <span className="detail-borrow-label">Reader Name:</span>
                  <span className="detail-borrow-value">
                    {borrow.readerName}
                  </span>
                </div>

                <div className="detail-borrow-info-item">
                  <span className="detail-borrow-label">Book ID:</span>
                  <span className="detail-borrow-value">{borrow.bookId}</span>
                </div>

                <div className="detail-borrow-info-item">
                  <span className="detail-borrow-label">Book Title:</span>
                  <span className="detail-borrow-value">
                    {borrow.bookTitle}
                  </span>
                </div>
                <div className="detail-borrow-info-item">
                  <span className="detail-borrow-label">Book Image:</span>
                </div>
                <div className="detail-borrow-info-item">
                  <span className="detail-borrow-value">
                    {borrow.imageUrl ? (
                      <img
                        src={`http://localhost:8080/${borrow.imageUrl}`}
                        alt={borrow.bookTitle}
                        className="detail-borrow-book-image"
                        onError={(e) => {
                          e.target.src = "/placeholder-book.png";
                        }}
                      />
                    ) : (
                      <span className="detail-borrow-no-image">No Image</span>
                    )}
                  </span>
                </div>

                <div className="detail-borrow-info-item">
                  <span className="detail-borrow-label">Borrow Date:</span>
                  <span className="detail-borrow-value">
                    {borrow.borrowDate}
                  </span>
                </div>

                <div className="detail-borrow-info-item">
                  <span className="detail-borrow-label">Due Date:</span>
                  <span className="detail-borrow-value">{borrow.dueDate}</span>
                </div>

                <div className="detail-borrow-info-item">
                  <span className="detail-borrow-label">Borrow Price:</span>
                  <span className="detail-borrow-value">
                    {borrow.borrowPrice}
                  </span>
                </div>

                <div className="detail-borrow-info-item">
                  <span className="detail-borrow-label">Status:</span>
                  <span
                    className="detail-borrow-value"
                    style={{
                      color:
                        borrow.status === "BORROWED"
                          ? "goldenrod"
                          : borrow.status === "OVERDUE"
                          ? "red"
                          : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {borrow.status}
                  </span>
                </div>

                <div className="detail-borrow-info-item">
                  <span className="detail-borrow-label">Notes:</span>
                  <span className="detail-borrow-value">
                    {borrow.notes || "N/A"}
                  </span>
                </div>
              </div>

              <div className="detail-borrow-actions">
                <button onClick={handleEdit} className="detail-borrow-btn-edit">
                  Edit Borrow
                </button>
                <button
                  onClick={handleBack}
                  className="detail-borrow-btn-cancel"
                >
                  Back to List
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetailBorrow;
