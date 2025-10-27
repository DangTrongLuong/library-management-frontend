import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader } from "lucide-react";
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
  const [borrows, setBorrows] = useState([]);
  const [calculating, setCalculating] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    borrowId: "",
    fineDate: "",
    reason: "",
    amount: "",
    status: "",
  });

  const [errors, setErrors] = useState({});

  const reasonOptions = [
    { value: "LOST_BOOK", label: "Lost Book" },
    { value: "OVERDUE", label: "Overdue" },
    { value: "DAMAGED_BOOK", label: "Damaged Book" },
  ];

  // --- Sidebar active
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

  // --- Load data
  useEffect(() => {
    fetchBorrows();
    fetchFine();
  }, [id]);

  const fetchBorrows = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/borrows/getAllBorrows"
      );
      setBorrows(res.data.content || res.data);
    } catch (err) {
      toast.error("Failed to load borrow list!");
      console.error(err);
    }
  };

  const fetchFine = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/fines/${id}`);
      const fine = response.data;
      setFormData({
        borrowId: fine.borrowId || "",
        fineDate: fine.fineDate ? fine.fineDate.split("T")[0] : "",
        reason: fine.reason || "",
        amount: fine.amount || "",
        status: fine.status || "",
      });
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load fine information!");
      setLoading(false);
    }
  };

  // --- Auto calculate amount
  useEffect(() => {
    const calculateAmount = async () => {
      if (!formData.borrowId || !formData.reason) return;
      setCalculating(true);
      try {
        const res = await axios.post(
          "http://localhost:8080/api/fines/calculate-amount",
          {
            borrowId: formData.borrowId,
            reason: formData.reason,
          }
        );
        setFormData((prev) => ({
          ...prev,
          amount: res.data.toString(),
        }));
      } catch (err) {
        console.error("Error calculating fine amount:", err);
        toast.error("Failed to calculate fine amount!");
      } finally {
        setCalculating(false);
      }
    };

    calculateAmount();
  }, [formData.borrowId, formData.reason]);

  // --- Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.borrowId) newErrors.borrowId = "Borrow ID is required";
    if (!formData.reason) newErrors.reason = "Reason is required";
    if (!formData.amount || Number(formData.amount) <= 0)
      newErrors.amount = "Amount must be positive";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.fineDate) newErrors.fineDate = "Fine date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
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
        fineDate: formData.fineDate ? `${formData.fineDate}T00:00:00` : null,
      };
      await axios.put(`http://localhost:8080/api/fines/${id}`, payload);
      toast.success("Fine updated successfully!");
      setTimeout(() => navigate("/penalties"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update fine!");
    }
  };

  const handleCancel = () => navigate("/penalties");
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const handleMenuClick = (itemId) => setActiveMenuItem(itemId);

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
            <div className="edit-fine-container">
              <form onSubmit={handleSubmit} className="edit-fine-form">
                <div className="edit-fine-section">
                  <h2>Fine Information</h2>

                  {/* Borrow ID + Fine Date */}
                  <div className="edit-fine-row">
                    <div className="edit-fine-group">
                      <label htmlFor="borrowId">
                        Borrow ID <span className="edit-fine-required">*</span>
                      </label>
                      <select
                        id="borrowId"
                        name="borrowId"
                        value={formData.borrowId}
                        onChange={handleChange}
                        className={`edit-fine-input ${
                          errors.borrowId ? "error" : ""
                        }`}
                      >
                        <option value="">Select Borrow ID</option>
                        {borrows.map((b) => (
                          <option key={b.borrowId} value={b.borrowId}>
                            {b.borrowId} — {b.readerName}
                          </option>
                        ))}
                      </select>
                      {errors.borrowId && (
                        <span className="edit-fine-error">
                          {errors.borrowId}
                        </span>
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
                        <span className="edit-fine-error">
                          {errors.fineDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reason + Amount */}
                  <div className="edit-fine-row">
                    <div className="edit-fine-group">
                      <label htmlFor="reason">
                        Reason <span className="edit-fine-required">*</span>
                      </label>
                      <select
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className={`edit-fine-input ${
                          errors.reason ? "error" : ""
                        }`}
                      >
                        <option value="">Select reason</option>
                        {reasonOptions.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                      {errors.reason && (
                        <span className="edit-fine-error">{errors.reason}</span>
                      )}
                    </div>

                    <div className="edit-fine-group">
                      <label htmlFor="amount">
                        Amount (VND){" "}
                        <span className="edit-fine-required">*</span>
                        {calculating && (
                          <Loader size={16} className="inline animate-spin" />
                        )}
                      </label>
                      <input
                        id="amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        readOnly
                        placeholder="Auto-calculated"
                        className={`edit-fine-input ${
                          errors.amount ? "error" : ""
                        }`}
                      />
                      {errors.amount && (
                        <span className="edit-fine-error">{errors.amount}</span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
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

                {/* Actions */}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditFine;
