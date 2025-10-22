import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/EditReader.css";

const EditReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("readers");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    numberPhone: "",
    email: "",
    address: "",
    registrationDate: "",
    cardType: "",
  });
  const [errors, setErrors] = useState({});

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
    setActiveMenuItem(pathToItem[location.pathname] || "readers");
  }, [location.pathname]);

  useEffect(() => {
    fetchReader();
  }, [id]);

  const fetchReader = async () => {
    try {
      const response = await axios.get(`/api/readers/getReader/${id}`);
      const reader = response.data;
      setFormData({
        name: reader.name,
        numberPhone: reader.numberPhone,
        email: reader.email,
        address: reader.address || "",
        registrationDate: reader.registrationDate,
        cardType: reader.cardType,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reader:", error);
      toast.error("Failed to load reader information!");
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be at most 100 characters";
    }

    if (!formData.numberPhone) {
      newErrors.numberPhone = "Phone is required";
    } else if (!/^0[0-9]{9,10}$/.test(formData.numberPhone)) {
      newErrors.numberPhone = "Phone must be 10-11 digits starting with 0";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    } else if (formData.email.length > 100) {
      newErrors.email = "Email must be at most 100 characters";
    }

    if (formData.address && formData.address.length > 255) {
      newErrors.address = "Address must be at most 255 characters";
    }

    if (!formData.cardType) {
      newErrors.cardType = "Card type is required";
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
      await axios.put(`/api/readers/updateReader/${id}`, formData);
      toast.success("Reader updated successfully!");
      setTimeout(() => {
        navigate("/readers");
      }, 2000);
    } catch (error) {
      console.error("Error updating reader:", error);
      const message =
        error.response?.data?.message || "Failed to update reader!";
      toast.error(message);
    }
  };

  const handleCancel = () => {
    navigate("/readers");
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
            <div className="edit-reader-loading">Loading...</div>
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
          <div className="edit-reader-header">
            <button
              onClick={handleCancel}
              className="edit-reader-btn-back"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="edit-reader-h1">Reader Management/ Edit Reader</h1>
          </div>

          <div className="edit-reader-wrapper">
            <form onSubmit={handleSubmit} className="edit-reader-form">
              <div className="edit-reader-section">
                <h2>Reader Information</h2>

                <div className="edit-reader-row">
                  <div className="edit-reader-group">
                    <label htmlFor="name">
                      Full Name <span className="edit-reader-required">*</span>
                    </label>
                    <div className="edit-reader-input-wrapper">
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className={`edit-reader-input ${
                          errors.name ? "error" : ""
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <span className="edit-reader-error">{errors.name}</span>
                    )}
                  </div>

                  <div className="edit-reader-group">
                    <label htmlFor="numberPhone">
                      Phone Number{" "}
                      <span className="edit-reader-required">*</span>
                    </label>
                    <div className="edit-reader-input-wrapper">
                      <input
                        id="numberPhone"
                        name="numberPhone"
                        value={formData.numberPhone}
                        onChange={handleChange}
                        placeholder="0xxxxxxxxx"
                        className={`edit-reader-input ${
                          errors.numberPhone ? "error" : ""
                        }`}
                      />
                    </div>
                    {errors.numberPhone && (
                      <span className="edit-reader-error">
                        {errors.numberPhone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="edit-reader-row">
                  <div className="edit-reader-group">
                    <label htmlFor="email">
                      Email <span className="edit-reader-required">*</span>
                    </label>
                    <div className="edit-reader-input-wrapper">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className={`edit-reader-input ${
                          errors.email ? "error" : ""
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <span className="edit-reader-error">{errors.email}</span>
                    )}
                  </div>

                  <div className="edit-reader-group">
                    <label htmlFor="cardType">
                      Card Type <span className="edit-reader-required">*</span>
                    </label>
                    <select
                      id="cardType"
                      name="cardType"
                      value={formData.cardType}
                      onChange={handleChange}
                      className={`edit-reader-input ${
                        errors.cardType ? "error" : ""
                      }`}
                    >
                      <option value="">Select card type</option>
                      <option value="BRONZE">BRONZE</option>
                      <option value="SILVER">SILVER</option>
                      <option value="VIP">VIP</option>
                    </select>
                    {errors.cardType && (
                      <span className="edit-reader-error">
                        {errors.cardType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="edit-reader-group">
                  <label htmlFor="address">Address</label>
                  <div className="edit-reader-input-wrapper">
                    <input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                      className="edit-reader-input"
                    />
                  </div>
                  {errors.address && (
                    <span className="edit-reader-error">{errors.address}</span>
                  )}
                </div>

                <div className="edit-reader-row">
                  <div className="edit-reader-group-date">
                    <label htmlFor="registrationDate">Registration Date</label>
                    <div className="edit-reader-input-wrapper">
                      <input
                        id="registrationDate"
                        name="registrationDate"
                        type="date"
                        value={formData.registrationDate}
                        onChange={handleChange}
                        className="edit-reader-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="edit-reader-actions">
                <button type="submit" className="edit-reader-btn-submit">
                  Update Reader
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="edit-reader-btn-cancel"
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

export default EditReader;
