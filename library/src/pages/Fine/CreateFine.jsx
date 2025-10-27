import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader } from "lucide-react";
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
  const [calculatingAmount, setCalculatingAmount] = useState(false);
  const [formData, setFormData] = useState({
    borrowId: "",
    reason: "",
    amount: "",
    paymentStatus: "UNPAID",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const reasonOptions = [
    { value: "LOST_BOOK", label: "Lost Book" },
    { value: "DAMAGED_BOOK", label: "Damaged Book" },
    { value: "OVERDUE", label: "Overdue" },
  ];

  // Load borrow list
  useEffect(() => {
    fetchBorrows();
  }, []);

  // Active sidebar highlight
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

  const fetchBorrows = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/borrows/getAllBorrows"
      );
      setBorrows(response.data);
    } catch (error) {
      toast.error("Failed to load borrow records!");
      console.error("Error fetching borrows:", error);
    }
  };

  // Calculate fine amount when reason changes
  const calculateAmount = async (borrowId, reason) => {
    if (!borrowId || !reason) {
      setFormData((prev) => ({ ...prev, amount: "" }));
      return;
    }

    setCalculatingAmount(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/fines/calculate-amount",
        {
          borrowId: borrowId,
          reason: reason,
        }
      );
      setFormData((prev) => ({ ...prev, amount: response.data.toString() }));
    } catch (error) {
      console.error("Error calculating amount:", error);
      toast.error("Failed to calculate fine amount!");
      setFormData((prev) => ({ ...prev, amount: "" }));
    } finally {
      setCalculatingAmount(false);
    }
  };

  // Validation
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

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Auto-calculate amount when reason changes
    if (name === "reason") {
      calculateAmount(formData.borrowId, value);
    }
  };

  const handleBorrowChange = (e) => {
    const borrowId = e.target.value;
    setFormData({ ...formData, borrowId });

    if (errors.borrowId) {
      setErrors({ ...errors, borrowId: "" });
    }

    // Re-calculate amount with new borrow if reason is already selected
    if (formData.reason) {
      calculateAmount(borrowId, formData.reason);
    }
  };

  // Submit form
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
        paymentStatus: formData.paymentStatus,
        notes: formData.notes || null,
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
                      Borrow Record{" "}
                      <span className="create-fine-required">*</span>
                    </label>
                    <select
                      id="borrowId"
                      name="borrowId"
                      value={formData.borrowId}
                      onChange={handleBorrowChange}
                      className={`create-fine-input ${
                        errors.borrowId ? "error" : ""
                      }`}
                    >
                      <option value="">Select Borrow Record</option>
                      {borrows.map((b) => (
                        <option key={b.borrowId} value={b.borrowId}>
                          {b.borrowId} — {b.readerName}
                        </option>
                      ))}
                    </select>
                    {errors.borrowId && (
                      <span className="create-fine-error">
                        {errors.borrowId}
                      </span>
                    )}
                  </div>

                  <div className="create-fine-group">
                    <label htmlFor="reason">
                      Fine Reason{" "}
                      <span className="create-fine-required">*</span>
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
                      {reasonOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
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
                      {calculatingAmount && (
                        <Loader size={16} className="inline animate-spin" />
                      )}
                    </label>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Amount will be calculated"
                      readOnly
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
