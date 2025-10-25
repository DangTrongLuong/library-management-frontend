// src/pages/Category/EditCategory.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/EditCategory.css";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeMenuItem, setActiveMenuItem] = useState("category");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    typeName: "",
    description: "",
    shelfPosition: "",
    note: "",
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
    setActiveMenuItem(pathToItem[location.pathname] || "category");
  }, [location.pathname]);

  useEffect(() => {
    fetchCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`/api/categories/${id}`);
      const category = response.data;

      // SET tất cả field tương ứng với backend DTO
      setFormData({
        typeName: category.typeName || "",        // note: backend field must be typeName
        description: category.description || "",
        shelfPosition: category.shelfPosition || "",
        note: category.note || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching category:", error);
      toast.error("Failed to load category information!");
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.typeName?.trim()) {
      newErrors.typeName = "Category name is required";
    } else if (formData.typeName.length > 100) {
      newErrors.typeName = "Name must be at most 100 characters";
    }

    // shelfPosition bắt buộc (theo yêu cầu bạn trước đó)
    if (!formData.shelfPosition?.trim()) {
      newErrors.shelfPosition = "Shelf position is required";
    }

    if (formData.description && formData.description.length > 255) {
      newErrors.description = "Description must be at most 255 characters";
    }

    // note optional: không validate bắt buộc

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form!");
      return;
    }

    try {
      // Gọi API update - giữ endpoint hiện tại của bạn
      await axios.put(`/api/categories/${id}`, formData);
      toast.success("Category updated successfully!");
      setTimeout(() => {
        navigate("/categorys");
      }, 1000);
    } catch (error) {
      console.error("Error updating category:", error);
      const message = error.response?.data?.message || "Failed to update category!";
      toast.error(message);
    }
  };

  const handleCancel = () => navigate("/categorys");

  if (loading) {
    return (
      <div className="my-project-container">
        <NavBar userName="Admin" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="main-layout">
          <SideBar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="main-content">
            <div className="edit-category-loading">Loading...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="my-project-container">
      <ToastContainer autoClose={3000} />
      <NavBar userName="Admin" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="main-layout">
        <SideBar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="main-content">
          <div className="edit-category-header">
            <button onClick={handleCancel} className="edit-category-btn-back" title="Back to list">
              <ArrowLeft size={20} />
            </button>
            <h1 className="edit-category-h1">Category Management / Edit Category</h1>
          </div>

          <div className="edit-category-wrapper">
            <form onSubmit={handleSubmit} className="edit-category-form">
              <div className="edit-category-section">
                <h2>Category Information</h2>

                <div className="edit-category-group">
                  <label htmlFor="typeName">
                    Category Name <span className="edit-category-required">*</span>
                  </label>
                  <input
                    id="typeName"
                    name="typeName"
                    value={formData.typeName}
                    onChange={handleChange}
                    placeholder="Enter category name"
                    className={`edit-category-input ${errors.typeName ? "error" : ""}`}
                  />
                  {errors.typeName && <span className="edit-category-error">{errors.typeName}</span>}
                </div>

                <div className="edit-category-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter description (optional)"
                    className="edit-category-textarea"
                    rows={3}
                  />
                  {errors.description && <span className="edit-category-error">{errors.description}</span>}
                </div>

                <div className="edit-category-group">
                  <label htmlFor="shelfPosition">
                    Shelf Position <span className="edit-category-required">*</span>
                  </label>
                  <input
                    id="shelfPosition"
                    name="shelfPosition"
                    value={formData.shelfPosition}
                    onChange={handleChange}
                    placeholder="E.g. Floor 1 - A3"
                    className={`edit-category-input ${errors.shelfPosition ? "error" : ""}`}
                  />
                  {errors.shelfPosition && <span className="edit-category-error">{errors.shelfPosition}</span>}
                </div>

                <div className="edit-category-group">
                  <label htmlFor="note">Note (optional)</label>
                  <input
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Enter note (optional)"
                    className="edit-category-input"
                  />
                </div>
              </div>

              <div className="edit-category-actions">
                <button type="submit" className="edit-category-btn-submit">Update Category</button>
                <button type="button" onClick={handleCancel} className="edit-category-btn-cancel">Cancel</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditCategory;
