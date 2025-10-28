import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/EditReport.css";

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("reports");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    fromDate: "",
    toDate: "",
    content: "",
    createdBy: "",
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const reportTypes = [
    { value: "SALARY", label: "Salary Report" },
    { value: "READER", label: "Reader Report" },
    { value: "BOOK", label: "Book Report" },
    { value: "BORROW", label: "Borrow Report" },
  ];

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
    setActiveMenuItem(pathToItem[location.pathname] || "reports");
  }, [location.pathname]);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(`/api/reports/getReport/${id}`);
      setFormData({
        ...response.data,
        fromDate: response.data.fromDate
          ? response.data.fromDate.split("T")[0]
          : "",
        toDate: response.data.toDate ? response.data.toDate.split("T")[0] : "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to load report information!");
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) newErrors.type = "Report type is required";
    if (!formData.createdBy?.trim())
      newErrors.createdBy = "Created by is required";
    if (!formData.fromDate) newErrors.fromDate = "From date is required";
    if (!formData.toDate) newErrors.toDate = "To date is required";
    if (
      formData.fromDate &&
      formData.toDate &&
      new Date(formData.fromDate) > new Date(formData.toDate)
    )
      newErrors.toDate = "To date must be after from date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(`/api/reports/updateReport/${id}`, formData);
      toast.success("Report updated successfully!");
      setTimeout(() => navigate("/reports"), 2000);
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error(error.response?.data?.message || "Failed to update report!");
    }
  };

  const handleCancel = () => {
    navigate("/reports");
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="app-container-report">
      <ToastContainer position="top-right" autoClose={3000} />
      <NavBar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeMenuItem={activeMenuItem}
        handleMenuClick={handleMenuClick}
        userName="Admin"
      />
      <SideBar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        activeMenuItem={activeMenuItem}
        handleMenuClick={handleMenuClick}
      />

      <main className="main-content">
        <div className="edit-report-wrapper">
          <div className="edit-form-header-report">
            <button
              onClick={handleCancel}
              className="edit-btn-back-report"
              title="Back to reports"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="edit-report-h1">Report Management/ Edit Report</h1>
          </div>

          <div className="edit-form-container-report">
            <form onSubmit={handleSubmit} className="edit-form-report">
              <div className="edit-form-section-report">
                <h2>Basic Information</h2>
                <div className="edit-form-row-report">
                  <div className="edit-form-group-report">
                    <label htmlFor="type">
                      Report Type <span className="required-report">*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type || ""}
                      onChange={handleChange}
                      className={`edit-form-input-report ${
                        errors.type ? "error" : ""
                      }`}
                    >
                      <option value="">Select report type</option>
                      {reportTypes.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.type && (
                      <span className="edit-error-message-report">
                        {errors.type}
                      </span>
                    )}
                  </div>

                  <div className="edit-form-group-report">
                    <label htmlFor="createdBy">
                      Created By <span className="required-report">*</span>
                    </label>
                    <input
                      id="createdBy"
                      name="createdBy"
                      type="text"
                      value={formData.createdBy || ""}
                      onChange={handleChange}
                      placeholder="Enter creator name"
                      className={`edit-form-input-report ${
                        errors.createdBy ? "error" : ""
                      }`}
                    />
                    {errors.createdBy && (
                      <span className="edit-error-message-report">
                        {errors.createdBy}
                      </span>
                    )}
                  </div>
                </div>

                <div className="edit-form-row-report">
                  <div className="edit-form-group-report">
                    <label htmlFor="fromDate">
                      From Date <span className="required-report">*</span>
                    </label>
                    <input
                      id="fromDate"
                      name="fromDate"
                      type="date"
                      value={formData.fromDate || ""}
                      onChange={handleChange}
                      className={`edit-form-input-report ${
                        errors.fromDate ? "error" : ""
                      }`}
                    />
                    {errors.fromDate && (
                      <span className="edit-error-message-report">
                        {errors.fromDate}
                      </span>
                    )}
                  </div>

                  <div className="edit-form-group-report">
                    <label htmlFor="toDate">
                      To Date <span className="required-report">*</span>
                    </label>
                    <input
                      id="toDate"
                      name="toDate"
                      type="date"
                      value={formData.toDate || ""}
                      onChange={handleChange}
                      className={`edit-form-input-report ${
                        errors.toDate ? "error" : ""
                      }`}
                    />
                    {errors.toDate && (
                      <span className="edit-error-message-report">
                        {errors.toDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="edit-form-section-report">
                <h2>Additional Information</h2>
                <div className="edit-form-group-report">
                  <label htmlFor="content">Notes</label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content || ""}
                    onChange={handleChange}
                    placeholder="Enter additional notes"
                    className="edit-form-textarea-report"
                  />
                </div>
              </div>

              <div className="edit-form-actions-report">
                <button type="submit" className="edit-btn-submit-report">
                  Update Report
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="edit-btn-cancel-report"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditReport;
