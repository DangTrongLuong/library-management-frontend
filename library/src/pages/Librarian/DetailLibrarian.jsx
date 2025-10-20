import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Mail, Phone, Calendar, DollarSign } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/LibrarianDetail.css";

const LibrarianDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("librarians");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [librarian, setLibrarian] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pathToItem = {
      "/": "home",
      "/books": "books",
      "/readers": "readers",
      "/categorys": "category",
      "/librarians": "librarians",
      "/borrows": "borrows",
      "/penalties": "penalties",
      "/reports": "reports",
    };
    setActiveMenuItem(pathToItem[location.pathname] || "librarians");
  }, [location.pathname]);

  useEffect(() => {
    fetchLibrarian();
  }, [id]);

  const fetchLibrarian = async () => {
    try {
      const response = await axios.get(`/api/librarians/getLibrarian/${id}`);
      setLibrarian(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching librarian:", error);
      toast.error("Failed to load librarian details!");
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/librarians");
  };

  const handleEdit = () => {
    navigate(`/librarians/editLibrarian/${id}`);
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

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
            <div className="detail-loading-librarian">Loading...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!librarian) {
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
            <div className="detail-error-librarian">Librarian not found</div>
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
          <div className="detail-header-librarian">
            <button
              onClick={handleBack}
              className="detail-btn-back-librarian"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="detail-librarian-h1">
              Librarian Management / {librarian.librarianName}
            </h1>
          </div>

          <div className="detail-librarian-wrapper">
            <div className="detail-container-librarian">
              {/* Header Card */}
              <div className="detail-card-librarian detail-header-card-librarian">
                <div className="detail-card-header">
                  <div className="detail-avatar-librarian">
                    {librarian.librarianName.charAt(0).toUpperCase()}
                  </div>
                  <div className="detail-header-info">
                    <h2>{librarian.librarianName}</h2>
                    <p className="detail-id">ID: {librarian.librarianId}</p>
                    <span
                      className={`detail-status detail-status-${librarian.status?.toLowerCase()}`}
                    >
                      {librarian.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="detail-card-librarian">
                <h3 className="detail-card-title">Personal Information</h3>
                <div className="detail-grid-librarian">
                  <div className="detail-item-librarian">
                    <label>Full Name</label>
                    <p>{librarian.librarianName}</p>
                  </div>

                  <div className="detail-item-librarian">
                    <label>Gender</label>
                    <p>{librarian.gender || "Not set"}</p>
                  </div>

                  <div className="detail-item-librarian">
                    <label>Phone</label>
                    <p>{librarian.phone}</p>
                  </div>

                  <div className="detail-item-librarian">
                    <label>Email</label>
                    <p className="detail-email">{librarian.email}</p>
                  </div>

                  <div className="detail-item-librarian">
                    <label>Start Date</label>
                    <p>{formatDate(librarian.startDate)}</p>
                  </div>

                  <div className="detail-item-librarian">
                    <label>Address</label>
                    <p>{librarian.address || "Not set"}</p>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="detail-card-librarian">
                <h3 className="detail-card-title">Work Information</h3>
                <div className="detail-grid-librarian">
                  <div className="detail-item-librarian">
                    <label>Shift</label>
                    <p>
                      {librarian.shiftName}
                      {librarian.timeShift && ` (${librarian.timeShift})`}
                    </p>
                  </div>

                  <div className="detail-item-librarian">
                    <label>Hours Per Day</label>
                    <p>{librarian.hoursPerDay} hours</p>
                  </div>

                  <div className="detail-item-librarian">
                    <label>Hourly Wage</label>
                    <p className="detail-wage">
                      {librarian.hourlyWage.toLocaleString()} VND
                    </p>
                  </div>

                  <div className="detail-item-librarian">
                    <label>Monthly Salary</label>
                    <p className="detail-salary">
                      {librarian.totalSalary.toLocaleString()} VND
                    </p>
                  </div>

                  <div className="detail-item-librarian">
                    <label>Salary Month</label>
                    <p>{librarian.salaryMonth || "Not set"}</p>
                  </div>

                  <div className="detail-item-librarian">
                    <label>Status</label>
                    <p>
                      <span
                        className={`detail-status-badge detail-status-${librarian.status?.toLowerCase()}`}
                      >
                        {librarian.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="detail-card-librarian">
                <h3 className="detail-card-title">Additional Information</h3>
                <div className="detail-full-width-librarian">
                  <div className="detail-item-librarian">
                    <label>Notes</label>
                    <p className="detail-notes">
                      {librarian.notes || "No notes"}
                    </p>
                  </div>
                </div>

                <div className="detail-grid-librarian">
                  <div className="detail-item-librarian">
                    <label>Created Date</label>
                    <p className="detail-meta">
                      {formatDate(librarian.createdAt)}
                    </p>
                  </div>

                  <div className="detail-item-librarian">
                    <label>Last Updated</label>
                    <p className="detail-meta">
                      {formatDate(librarian.updatedAt) || "Never"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="detail-actions-librarian">
                <button
                  onClick={handleEdit}
                  className="detail-btn-edit-librarian"
                >
                  Edit Information
                </button>
                <button
                  onClick={handleBack}
                  className="detail-btn-back-action-librarian"
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

export default LibrarianDetail;
