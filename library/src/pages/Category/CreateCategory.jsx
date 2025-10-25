import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/CreateCategory.css";

const CreateCategory = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("category");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    typeName: "",
    description: "",
    shelfPosition: "",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
    setActiveMenuItem(pathToItem[location.pathname] || "category");
  }, [location.pathname]);

  // --- Validate form fields ---
  const validateForm = () => {
    const newErrors = {};

    if (!formData.typeName?.trim()) {
      newErrors.typeName = "Category name is required";
    } else if (formData.typeName.length > 100) {
      newErrors.typeName = "Category name must be less than 100 characters";
    }

    if (formData.description && formData.description.length > 255) {
      newErrors.description = "Description must be less than 255 characters";
    }

    if (formData.shelfPosition && formData.shelfPosition.length > 100) {
      newErrors.shelfPosition =
        "Shelf position must be less than 100 characters";
    }

    if (formData.note && formData.note.length > 255) {
      newErrors.note = "Note must be less than 255 characters";
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
      await axios.post("/api/categories", formData);
      toast.success("Category added successfully!");
      setTimeout(() => {
        navigate("/categorys");
      }, 1500);
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(error.response?.data?.message || "Failed to add category!");
    }
  };

  const handleCancel = () => {
    navigate("/categorys");
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
          <div className="create-category-header">
            <button
              onClick={handleCancel}
              className="create-category-btn-back"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="create-category-h1">
              Category Management / Add New Category
            </h1>
          </div>

          <div className="create-category-wrapper">
            <div className="create-category-container">
              <form onSubmit={handleSubmit} className="create-category-form">
                <div className="create-category-section">
                  <h2>Category Information</h2>

                  {/* Category Name */}
                  <div className="create-category-group">
                    <label htmlFor="typeName">
                      Category Name{" "}
                      <span className="create-category-required">*</span>
                    </label>
                    <input
                      id="typeName"
                      name="typeName"
                      value={formData.typeName}
                      onChange={handleChange}
                      placeholder="Enter category name"
                      className={`create-category-input ${
                        errors.typeName ? "error" : ""
                      }`}
                    />
                    {errors.typeName && (
                      <span className="create-category-error">
                        {errors.typeName}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="create-category-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter category description"
                      rows="3"
                      className="create-category-input"
                    ></textarea>
                    {errors.description && (
                      <span className="create-category-error">
                        {errors.description}
                      </span>
                    )}
                  </div>

                  {/* Shelf Position */}
                  <div className="create-category-group">
                    <label htmlFor="shelfPosition">Shelf Position</label>
                    <input
                      id="shelfPosition"
                      name="shelfPosition"
                      value={formData.shelfPosition}
                      onChange={handleChange}
                      placeholder="e.g., A3-2 (kệ A3, ngăn 2)"
                      className={`create-category-input ${
                        errors.shelfPosition ? "error" : ""
                      }`}
                    />
                    {errors.shelfPosition && (
                      <span className="create-category-error">
                        {errors.shelfPosition}
                      </span>
                    )}
                  </div>

                  {/* Note */}
                  <div className="create-category-group">
                    <label htmlFor="note">Note</label>
                    <textarea
                      id="note"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="Enter additional notes"
                      rows="2"
                      className="create-category-input"
                    ></textarea>
                    {errors.note && (
                      <span className="create-category-error">
                        {errors.note}
                      </span>
                    )}
                  </div>
                </div>

                <div className="create-category-actions">
                  <button type="submit" className="create-category-btn-submit">
                    Add Category
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="create-category-btn-cancel"
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

export default CreateCategory;
