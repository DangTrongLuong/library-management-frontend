import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/EditLibrarian.css";

const EditLibrarian = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("librarians");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    librarianName: "",
    phone: "",
    email: "",
    shiftId: "",
    hourlyWage: "",
    gender: "",
    startDate: "",
    address: "",
    status: "ACTIVE",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const shifts = [
    { shiftId: 1, shiftName: "Morning" },
    { shiftId: 2, shiftName: "Afternoon" },
    { shiftId: 3, shiftName: "Evening" },
    { shiftId: 4, shiftName: "Fulltime" },
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
    setActiveMenuItem(pathToItem[location.pathname] || "librarians");
  }, [location.pathname]);

  useEffect(() => {
    fetchLibrarian();
  }, [id]);

  const fetchLibrarian = async () => {
    try {
      const response = await axios.get(`/api/librarians/getLibrarian/${id}`);
      setFormData({
        ...response.data,
        startDate: response.data.startDate
          ? response.data.startDate.split("T")[0]
          : "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching librarian:", error);
      toast.error("Failed to load librarian information!");
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.librarianName?.trim()) {
      newErrors.librarianName = "Name is required";
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^0[0-9]{9,10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10-11 digits starting with 0";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.shiftId) {
      newErrors.shiftId = "Shift is required";
    }

    if (!formData.hourlyWage) {
      newErrors.hourlyWage = "Hourly wage is required";
    } else if (parseFloat(formData.hourlyWage) < 0) {
      newErrors.hourlyWage = "Hourly wage must be >= 0";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.address?.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "shiftName") {
      const selectedShift = shifts.find((shift) => shift.shiftName === value);
      setFormData({
        ...formData,
        shiftId: selectedShift ? selectedShift.shiftId : "",
      });
      if (errors.shiftId) {
        setErrors({ ...errors, shiftId: "" });
      }
    } else {
      setFormData({ ...formData, [name]: value });
      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form!");
      return;
    }

    try {
      await axios.put(`/api/librarians/updateLibrarian/${id}`, {
        ...formData,
        hourlyWage: parseFloat(formData.hourlyWage),
      });
      toast.success("Librarian updated successfully!");

      setTimeout(() => {
        navigate("/librarians");
        S;
      }, 2000);
    } catch (error) {
      console.error("Error updating librarian:", error);
      toast.error(
        error.response?.data?.message || "Failed to update librarian!"
      );
    }
  };

  const handleCancel = () => {
    navigate("/librarians");
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

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
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
            <div className="loading-librarian">Loading...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="my-project-container">
      <ToastContainer autoClose={2000} />
      <NavBar userName="Admin" onToggleSidebar={toggleSidebar} />

      <div className="main-layout">
        <SideBar
          activeItem={activeMenuItem}
          onItemClick={handleMenuClick}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />

        <main className="main-content">
          <div className="edit-form-header-librarian">
            <button
              onClick={handleCancel}
              className="edit-btn-back-librarian"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="edit-librarian-h1">
              Librarian Management / Edit Librarian
            </h1>
          </div>

          <div className="edit-librarian-wrapper">
            <div className="edit-form-container-librarian">
              <form onSubmit={handleSubmit} className="edit-form-librarian">
                <div className="edit-form-section-librarian">
                  <h2>Personal Information</h2>

                  <div className="edit-form-group-librarian">
                    <label htmlFor="librarianName">Name</label>
                    <input
                      id="librarianName"
                      name="librarianName"
                      value={formData.librarianName || ""}
                      onChange={handleChange}
                      placeholder="Enter librarian name"
                      className={`edit-form-input-librarian ${
                        errors.librarianName ? "error" : ""
                      }`}
                    />
                    {errors.librarianName && (
                      <span className="edit-error-message-librarian">
                        {errors.librarianName}
                      </span>
                    )}
                  </div>

                  <div className="edit-form-row-librarian">
                    <div className="edit-form-group-librarian">
                      <label htmlFor="phone">Phone</label>
                      <input
                        id="phone"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        placeholder="e.g., 0912345678"
                        className={`edit-form-input-librarian ${
                          errors.phone ? "error" : ""
                        }`}
                      />
                      {errors.phone && (
                        <span className="edit-error-message-librarian">
                          {errors.phone}
                        </span>
                      )}
                    </div>

                    <div className="edit-form-group-librarian">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className={`edit-form-input-librarian ${
                          errors.email ? "error" : ""
                        }`}
                      />
                      {errors.email && (
                        <span className="edit-error-message-librarian">
                          {errors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="edit-form-row-librarian">
                    <div className="edit-form-group-librarian">
                      <label htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender || ""}
                        onChange={handleChange}
                        className={`edit-form-input-librarian ${
                          errors.gender ? "error" : ""
                        }`}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && (
                        <span className="edit-error-message-librarian">
                          {errors.gender}
                        </span>
                      )}
                    </div>

                    <div className="edit-form-group-librarian">
                      <label htmlFor="startDate">Start Date</label>
                      <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate || ""}
                        onChange={handleChange}
                        min={getMinDate()}
                        className={`edit-form-input-librarian ${
                          errors.startDate ? "error" : ""
                        }`}
                      />
                      {errors.startDate && (
                        <span className="edit-error-message-librarian">
                          {errors.startDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="edit-form-group-librarian">
                    <label htmlFor="address">Address</label>
                    <input
                      id="address"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      placeholder="Enter address"
                      className={`edit-form-input-librarian ${
                        errors.address ? "error" : ""
                      }`}
                    />
                    {errors.address && (
                      <span className="edit-error-message-librarian">
                        {errors.address}
                      </span>
                    )}
                  </div>
                </div>

                <div className="edit-form-section-librarian">
                  <h2>Work Information</h2>

                  <div className="edit-form-row-librarian">
                    <div className="edit-form-group-librarian">
                      <label htmlFor="shiftId">Shift</label>
                      <select
                        id="shiftId"
                        name="shiftName"
                        value={
                          shifts.find(
                            (shift) =>
                              shift.shiftId === parseInt(formData.shiftId)
                          )?.shiftName || ""
                        }
                        onChange={handleChange}
                        className={`edit-form-input-librarian ${
                          errors.shiftId ? "error" : ""
                        }`}
                      >
                        <option value="">Select shift</option>
                        {shifts.map((shift) => (
                          <option key={shift.shiftId} value={shift.shiftName}>
                            {shift.shiftName}
                          </option>
                        ))}
                      </select>
                      {errors.shiftId && (
                        <span className="edit-error-message-librarian">
                          {errors.shiftId}
                        </span>
                      )}
                    </div>

                    <div className="edit-form-group-librarian">
                      <label htmlFor="hourlyWage">Hourly Wage (VND) </label>
                      <input
                        id="hourlyWage"
                        name="hourlyWage"
                        type="number"
                        value={formData.hourlyWage || ""}
                        onChange={handleChange}
                        placeholder="Enter hourly wage"
                        min="0"
                        className={`edit-form-input-librarian ${
                          errors.hourlyWage ? "error" : ""
                        }`}
                      />
                      {errors.hourlyWage && (
                        <span className="edit-error-message-librarian">
                          {errors.hourlyWage}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="edit-form-group-librarian">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status || ""}
                      onChange={handleChange}
                      className="edit-form-input-librarian"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>

                  <div className="edit-form-group-librarian">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes || ""}
                      onChange={handleChange}
                      placeholder="Enter additional notes"
                      className="edit-form-textarea-librarian"
                    />
                  </div>
                </div>

                <div className="edit-form-actions-librarian">
                  <button type="submit" className="edit-btn-submit-librarian">
                    Update Librarian
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="edit-btn-cancel-librarian"
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

export default EditLibrarian;
