//Trải nghiệm AI ngay trong các ứng dụng bạn yêu thích … Dùng Gemini để tạo bản nháp và tinh chỉnh nội dung, đồng thời sử dụng Gemini Pro để khai thác AI thế hệ mới của Google với giá 489.000 ₫ 0 ₫ cho 1 tháng
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, DollarSign, FileText, Calendar, CheckCircle } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/EditFine.css";

const EditFine = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("penalties");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fineId: "",
    borrowId: "",
    fineDate: "",
    reason: "",
    amount: "",
    status: "",
  });
  const [errors, setErrors] = useState({});

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
      const response = await axios.get(`/api/fines/${id}`);
      const fine = response.data;
      setFormData({
        fineId: fine.fineId,
        borrowId: fine.borrowId,
        fineDate: fine.fineDate,
        reason: fine.reason,
        amount: fine.amount,
        status: fine.status,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching fine:", error);
      toast.error("Failed to load fine information!");
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.borrowId?.trim()) {
      newErrors.borrowId = "Borrow ID is required";
    }

    if (!formData.reason?.trim()) {
      newErrors.reason = "Reason is required";
    } else if (formData.reason.length > 255) {
      newErrors.reason = "Reason must be at most 255 characters";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    if (!formData.fineDate) {
      newErrors.fineDate = "Fine date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.error("Please fix the errors in the form!");
    return;
  }

  try {
    const payload = {
      ...formData,
      fineDate: formData.fineDate ? `${formData.fineDate}T00:00:00` : null, // thêm giờ mặc định
    };

    await axios.put(`/api/fines/${(id)}`, payload);
    toast.success("Fine updated successfully!");
    setTimeout(() => {
      navigate("/penalties");
    }, 2000);
  } catch (error) {
    console.error("Error updating fine:", error);
    const message = error.response?.data?.message || "Failed to update fine!";
    toast.error(message);
  }
};
  const handleCancel = () => {
    navigate("/penalties");
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
            <div className="edit-fine-loading">Loading...</div>
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
          <div className="edit-fine-header">
            <button
              onClick={handleCancel}
              className="edit-fine-btn-back"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="edit-fine-h1">Fine Management / Edit Fine</h1>
          </div>

          <div className="edit-fine-wrapper">
            <form onSubmit={handleSubmit} className="edit-fine-form">
              <div className="edit-fine-section">
                <h2>Fine Information</h2>

                <div className="edit-fine-row">
                  <div className="edit-fine-group">
                    <label htmlFor="borrowId">
                      Borrow ID <span className="edit-fine-required">*</span>
                    </label>
                    <input
                      id="borrowId"
                      name="borrowId"
                      value={formData.borrowId}
                      onChange={handleChange}
                      placeholder="Enter Borrow ID"
                      className={`edit-fine-input ${
                        errors.borrowId ? "error" : ""
                      }`}
                    />
                    {errors.borrowId && (
                      <span className="edit-fine-error">{errors.borrowId}</span>
                    )}
                  </div>

                  <div className="edit-fine-group">
                    <label htmlFor="fineDate">
                      Fine Date <span className="edit-fine-required">*</span>
                    </label>
                    <input
                      id="fineDate"
                      name="fineDate"
                      type="date"
                      value={formData.fineDate}
                      onChange={handleChange}
                      className={`edit-fine-input ${
                        errors.fineDate ? "error" : ""
                      }`}
                    />
                    {errors.fineDate && (
                      <span className="edit-fine-error">{errors.fineDate}</span>
                    )}
                  </div>
                </div>

                <div className="edit-fine-row">
                  <div className="edit-fine-group">
                    <label htmlFor="reason">
                      Reason <span className="edit-fine-required">*</span>
                    </label>
                    <input
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="Enter reason"
                      className={`edit-fine-input ${
                        errors.reason ? "error" : ""
                      }`}
                    />
                    {errors.reason && (
                      <span className="edit-fine-error">{errors.reason}</span>
                    )}
                  </div>

                  <div className="edit-fine-group">
                    <label htmlFor="amount">
                      Amount <span className="edit-fine-required">*</span>
                    </label>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter fine amount"
                      className={`edit-fine-input ${
                        errors.amount ? "error" : ""
                      }`}
                    />
                    {errors.amount && (
                      <span className="edit-fine-error">{errors.amount}</span>
                    )}
                  </div>
                </div>

                <div className="edit-fine-group">
                  <label htmlFor="status">
                    Status <span className="edit-fine-required">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`edit-fine-input ${
                      errors.status ? "error" : ""
                    }`}
                  >
                    <option value="">Select status</option>
                    <option value="UNPAID">UNPAID</option>
                    <option value="PAID">PAID</option>
                  </select>
                  {errors.status && (
                    <span className="edit-fine-error">{errors.status}</span>
                  )}
                </div>
              </div>

              <div className="edit-fine-actions">
                <button type="submit" className="edit-fine-btn-submit">
                  Update Fine
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="edit-fine-btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditFine;