import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ChevronLeft } from "lucide-react";
import "../../styles/CreateReport.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateReport = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    fromDate: "",
    toDate: "",
    content: "",
    createdBy: "",
  });

  const reportTypes = [
    { value: "SALARY", label: "SALARY" },
    { value: "READER", label: "READER" },
    { value: "BOOK", label: "BOOK" },
    { value: "BORROW", label: "BORROW" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.type) {
      toast.error("Please select a report type!");
      return;
    }
    if (!formData.fromDate) {
      toast.error("Please select from date!");
      return;
    }
    if (!formData.toDate) {
      toast.error("Please select to date!");
      return;
    }
    if (!formData.createdBy) {
      toast.error("Please enter created by!");
      return;
    }

    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      toast.error("From date cannot be after to date!");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/reports/createReport", formData);
      toast.success("Report created successfully!");
      setTimeout(() => {
        navigate("/reports");
      }, 1500);
    } catch (error) {
      console.error("Error creating report:", error);
      toast.error(error.response?.data?.message || "Failed to create report!");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/reports");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="my-project-container">
      <ToastContainer autoClose={3000} />
      <NavBar userName="Admin" onToggleSidebar={toggleSidebar} />

      <div className="main-layout">
        <SideBar
          activeItem="reports"
          onItemClick={() => {}}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />

        <main className="main-content">
          <div className="form-header-report">
            <button
              onClick={handleBack}
              className="btn-back-report"
              title="Back to reports"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="form-title-report">
              Report management/ Create New Report
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="form-create-report">
            <div className="form-group-report">
              <label htmlFor="type" className="form-label-report">
                Report Type <span className="required-report">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-input-report"
              >
                <option value="">Select report type</option>
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row-report">
              <div className="form-group-report">
                <label htmlFor="fromDate" className="form-label-report">
                  From Date <span className="required-report">*</span>
                </label>
                <input
                  type="date"
                  id="fromDate"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  className="form-input-report"
                />
              </div>

              <div className="form-group-report">
                <label htmlFor="toDate" className="form-label-report">
                  To Date <span className="required-report">*</span>
                </label>
                <input
                  type="date"
                  id="toDate"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  className="form-input-report"
                />
              </div>
            </div>

            <div className="form-group-report">
              <label htmlFor="createdBy" className="form-label-report">
                Created By <span className="required-report">*</span>
              </label>
              <input
                type="text"
                id="createdBy"
                name="createdBy"
                value={formData.createdBy}
                onChange={handleChange}
                placeholder="Enter who created this report"
                className="form-input-report"
              />
            </div>

            <div className="form-group-report">
              <label htmlFor="content" className="form-label-report">
                Additional Notes
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Add any additional notes for this report (optional)"
                className="form-textarea-report"
                rows="6"
              />
            </div>

            <div className="form-buttons-report">
              <button
                type="button"
                onClick={handleBack}
                className="btn-cancel-report"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit-report"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Report"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateReport;
