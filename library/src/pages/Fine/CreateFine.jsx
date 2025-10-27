//Trải nghiệm AI ngay trong các ứng dụng bạn yêu thích … Dùng Gemini để tạo bản nháp và tinh chỉnh nội dung, đồng thời sử dụng Gemini Pro để khai thác AI thế hệ mới của Google với giá 489.000 ₫ 0 ₫ cho 1 tháng
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/CreateFine.css";

const CreateFine = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("penalties");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [borrows, setBorrows] = useState([]);
  const [formData, setFormData] = useState({
    borrowId: "",
    reason: "",
    amount: "",
    paymentStatus: "UNPAID",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  // 🟩 Load borrow list
  useEffect(() => {
    axios
      axios.get("http://localhost:8080/api/borrows/getAllBorrows")
      .then((res) => setBorrows(res.data))
      .catch(() => toast.error("Failed to load borrow records!"));
  }, []);

  // 🟦 Active sidebar highlight
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

  // 🟨 Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.borrowId) {
      newErrors.borrowId = "Borrow record is required";
    }

    if (!formData.reason) {
      newErrors.reason = "Fine reason is required";
    }

    if (!formData.amount) {
      newErrors.amount = "Fine amount is required";
    } else if (isNaN(formData.amount) || formData.amount <= 0) {
      newErrors.amount = "Fine amount must be a positive number";
    }

    if (formData.notes && formData.notes.length > 255) {
      newErrors.notes = "Notes must be at most 255 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🟩 Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // 🟧 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form!");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/fines", {
        borrowId: formData.borrowId,
        reason: formData.reason,
        amount: parseFloat(formData.amount),
        paymentStatus: formData.paymentStatus,
        notes: formData.notes,
      });

      toast.success("Fine added successfully!");
      setTimeout(() => {
        navigate("/penalties");
      }, 2000);
    } catch (error) {
      console.error("Error creating fine:", error);
      const message = error.response?.data?.message || "Failed to add fine!";
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
          <div className="create-fine-header">
            <button
              onClick={handleCancel}
              className="create-fine-btn-back"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="create-fine-h1">Fine Management / Add New Fine</h1>
          </div>

          <div className="create-fine-wrapper">
            <form onSubmit={handleSubmit} className="create-fine-form">
              <div className="create-fine-section">
                <h2>Fine Information</h2>
                <div className="fine-green-line"></div>

                <div className="create-fine-row">
                  <div className="create-fine-group">
                    <label htmlFor="borrowId">
                      Borrow Record <span className="create-fine-required">*</span>
                    </label>
                    <select
                      id="borrowId"
                      name="borrowId"
                      value={formData.borrowId}
                      onChange={handleChange}
                      className={`create-fine-input ${
                        errors.borrowId ? "error" : ""
                      }`}
                    >

                   <option value="">Select Borrow Record</option>
                     {borrows.map((b) => (
                   <option key={b.borrowId} value={b.borrowId}>
                     {b.borrowCode || `Record #${b.borrowId}`}
                   </option>
                    ))}

                    </select>
                    {errors.borrowId && (
                      <span className="create-fine-error">{errors.borrowId}</span>
                    )}
                  </div>

                  <div className="create-fine-group">
                    <label htmlFor="reason">
                      Fine Reason <span className="create-fine-required">*</span>
                    </label>
                    <select
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      className={`create-fine-input ${
                        errors.reason ? "error" : ""
                      }`}
                    >
                      <option value="">Select Reason</option>
                      <option value="LATE_RETURN">Late Return</option>
                      <option value="DAMAGED_BOOK">Damaged Book</option>
                      <option value="LOST_BOOK">Lost Book</option>
                    </select>
                    {errors.reason && (
                      <span className="create-fine-error">{errors.reason}</span>
                    )}
                  </div>
                </div>

                <div className="create-fine-row">
                  <div className="create-fine-group">
                    <label htmlFor="amount">
                      Fine Amount (VND){" "}
                      <span className="create-fine-required">*</span>
                    </label>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter fine amount"
                      className={`create-fine-input ${
                        errors.amount ? "error" : ""
                      }`}
                    />
                    {errors.amount && (
                      <span className="create-fine-error">{errors.amount}</span>
                    )}
                  </div>

                  <div className="create-fine-group">
                    <label htmlFor="paymentStatus">Payment Status</label>
                    <select
                      id="paymentStatus"
                      name="paymentStatus"
                      value={formData.paymentStatus}
                      onChange={handleChange}
                      className="create-fine-input"
                    >
                      <option value="UNPAID">Unpaid</option>
                      <option value="PAID">Paid</option>
                    </select>
                  </div>
                </div>

                <div className="create-fine-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Enter additional notes"
                    className="create-fine-input"
                    rows="3"
                  ></textarea>
                  {errors.notes && (
                    <span className="create-fine-error">{errors.notes}</span>
                  )}
                </div>
              </div>

              <div className="create-fine-actions">
                <button type="submit" className="create-fine-btn-submit">
                  Add Fine
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="create-fine-btn-cancel"
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

export default CreateFine;