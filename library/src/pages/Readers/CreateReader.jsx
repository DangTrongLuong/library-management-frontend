import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/CreateReader.css";

const CreateReader = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("readers");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    numberPhone: "",
    email: "",
    address: "",
    registrationDate: "",
    cardType: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, registrationDate: today }));
  }, []);

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
      await axios.post("/api/readers/createReader", formData);
      toast.success("Reader added successfully!");
      setTimeout(() => {
        navigate("/readers");
      }, 2000);
    } catch (error) {
      console.error("Error creating reader:", error);
      const message = error.response?.data?.message || "Failed to add reader!";
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
          <div className="create-reader-header">
            <button
              onClick={handleCancel}
              className="create-reader-btn-back"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="create-reader-h1">
              Reader Management/ Add New Reader
            </h1>
          </div>

          <div className="create-reader-wrapper">
            <form onSubmit={handleSubmit} className="create-reader-form">
              <div className="create-reader-section">
                <h2>Reader Information</h2>

                <div className="create-reader-row">
                  <div className="create-reader-group">
                    <label htmlFor="name">
                      Full Name{" "}
                      <span className="create-reader-required">*</span>
                    </label>
                    <div className="create-reader-input-wrapper">
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className={`create-reader-input ${
                          errors.name ? "error" : ""
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <span className="create-reader-error">{errors.name}</span>
                    )}
                  </div>

                  <div className="create-reader-group">
                    <label htmlFor="numberPhone">
                      Phone Number{" "}
                      <span className="create-reader-required">*</span>
                    </label>
                    <div className="create-reader-input-wrapper">
                      <input
                        id="numberPhone"
                        name="numberPhone"
                        value={formData.numberPhone}
                        onChange={handleChange}
                        placeholder="0xxxxxxxxx"
                        className={`create-reader-input ${
                          errors.numberPhone ? "error" : ""
                        }`}
                      />
                    </div>
                    {errors.numberPhone && (
                      <span className="create-reader-error">
                        {errors.numberPhone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="create-reader-row">
                  <div className="create-reader-group">
                    <label htmlFor="email">
                      Email <span className="create-reader-required">*</span>
                    </label>
                    <div className="create-reader-input-wrapper">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className={`create-reader-input ${
                          errors.email ? "error" : ""
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <span className="create-reader-error">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="create-reader-group">
                    <label htmlFor="cardType">
                      Card Type{" "}
                      <span className="create-reader-required">*</span>
                    </label>
                    <select
                      id="cardType"
                      name="cardType"
                      value={formData.cardType}
                      onChange={handleChange}
                      className={`create-reader-input ${
                        errors.cardType ? "error" : ""
                      }`}
                    >
                      <option value="">Select card type</option>
                      <option value="BRONZE">BRONZE</option>
                      <option value="SILVER">SILVER</option>
                      <option value="VIP">VIP</option>
                    </select>
                    {errors.cardType && (
                      <span className="create-reader-error">
                        {errors.cardType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="create-reader-group">
                  <label htmlFor="address">Address</label>
                  <div className="create-reader-input-wrapper">
                    <input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                      className="create-reader-input"
                    />
                  </div>
                  {errors.address && (
                    <span className="create-reader-error">
                      {errors.address}
                    </span>
                  )}
                </div>

                {/* <div className="create-reader-row">
                  <div className="create-reader-group">
                    <label htmlFor="registrationDate">Registration Date</label>
                    <div className="create-reader-input-wrapper">
                      <input
                        id="registrationDate"
                        name="registrationDate"
                        type="date"
                        value={formData.registrationDate}
                        onChange={handleChange}
                        className="create-reader-input"
                      />
                    </div>
                  </div>
                </div> */}
              </div>

              <div className="create-reader-actions">
                <button type="submit" className="create-reader-btn-submit">
                  Add Reader
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="create-reader-btn-cancel"
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

export default CreateReader;
