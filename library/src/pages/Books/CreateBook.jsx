import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Upload, X } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/CreateBook.css";

const CreateBook = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("books");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    bookTitle: "",
    author: "",
    publicationYear: "",
    categoryId: "",
    nxb: "",
    quantity: 0,
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
    setActiveMenuItem(pathToItem[location.pathname] || "books");
  }, [location.pathname]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories!");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.bookTitle?.trim()) {
      newErrors.bookTitle = "Book title is required";
    }

    if (!formData.author?.trim()) {
      newErrors.author = "Author is required";
    }

    if (!formData.publicationYear) {
      newErrors.publicationYear = "Publication year is required";
    } else if (formData.publicationYear < 1500) {
      newErrors.publicationYear = "Publication year must be >= 1500";
    } else if (formData.publicationYear > currentYear) {
      newErrors.publicationYear = `Publication year cannot exceed ${currentYear}`;
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (formData.quantity < 0) {
      newErrors.quantity = "Quantity must be >= 0";
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB!");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form!");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("bookTitle", formData.bookTitle);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("publicationYear", formData.publicationYear);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("nxb", formData.nxb || "");
      formDataToSend.append("quantity", formData.quantity);

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      await axios.post("/api/books/createBook", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Book added successfully!");
      setTimeout(() => {
        navigate("/books");
      }, 2000);
    } catch (error) {
      console.error("Error creating book:", error);
      toast.error(error.response?.data?.message || "Failed to add book!");
    }
  };

  const handleCancel = () => {
    navigate("/books");
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

  const getMinYear = () => {
    return 1500;
  };

  const getMaxYear = () => {
    return new Date().getFullYear();
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
          <div className="create-book-header">
            <button
              onClick={handleCancel}
              className="create-book-btn-back"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="create-book-h1">Books Management / Add New Book</h1>
          </div>

          <div className="create-book-wrapper">
            <div className="create-book-container">
              <form onSubmit={handleSubmit} className="create-book-form">
                {/* Book Information */}
                <div className="create-book-section">
                  <h2>Book Information</h2>

                  <div className="create-book-group">
                    <label htmlFor="bookTitle">
                      Book Title <span className="create-book-required">*</span>
                    </label>
                    <input
                      id="bookTitle"
                      name="bookTitle"
                      value={formData.bookTitle}
                      onChange={handleChange}
                      placeholder="Enter book title"
                      className={`create-book-input ${
                        errors.bookTitle ? "error" : ""
                      }`}
                    />
                    {errors.bookTitle && (
                      <span className="create-book-error">
                        {errors.bookTitle}
                      </span>
                    )}
                  </div>

                  <div className="create-book-row">
                    <div className="create-book-group">
                      <label htmlFor="author">
                        Author <span className="create-book-required">*</span>
                      </label>
                      <input
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Enter author name"
                        className={`create-book-input ${
                          errors.author ? "error" : ""
                        }`}
                      />
                      {errors.author && (
                        <span className="create-book-error">
                          {errors.author}
                        </span>
                      )}
                    </div>

                    <div className="create-book-group">
                      <label htmlFor="publicationYear">
                        Publication Year{" "}
                        <span className="create-book-required">*</span>
                      </label>
                      <input
                        id="publicationYear"
                        name="publicationYear"
                        type="number"
                        value={formData.publicationYear}
                        onChange={handleChange}
                        placeholder="e.g., 2024"
                        min={getMinYear()}
                        max={getMaxYear()}
                        className={`create-book-input ${
                          errors.publicationYear ? "error" : ""
                        }`}
                      />
                      {errors.publicationYear && (
                        <span className="create-book-error">
                          {errors.publicationYear}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="create-book-row">
                    <div className="create-book-group">
                      <label htmlFor="categoryId">
                        Category <span className="create-book-required">*</span>
                      </label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className={`create-book-input ${
                          errors.categoryId ? "error" : ""
                        }`}
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.categoryId} value={cat.categoryId}>
                            {cat.typeName}
                          </option>
                        ))}
                      </select>
                      {errors.categoryId && (
                        <span className="create-book-error">
                          {errors.categoryId}
                        </span>
                      )}
                    </div>

                    <div className="create-book-group">
                      <label htmlFor="nxb">Publisher</label>
                      <input
                        id="nxb"
                        name="nxb"
                        value={formData.nxb}
                        onChange={handleChange}
                        placeholder="Enter publisher name"
                        className="create-book-input"
                      />
                    </div>
                  </div>

                  <div className="create-book-group">
                    <label htmlFor="quantity">
                      Quantity <span className="create-book-required">*</span>
                    </label>
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="Enter quantity"
                      min="0"
                      className={`create-book-input ${
                        errors.quantity ? "error" : ""
                      }`}
                    />
                    {errors.quantity && (
                      <span className="create-book-error">
                        {errors.quantity}
                      </span>
                    )}
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="create-book-section">
                  <h2>Book Image</h2>
                  <div className="create-book-image-upload">
                    {imagePreview ? (
                      <div className="create-book-image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="create-book-remove-image"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <label className="create-book-upload-label">
                        <Upload size={40} />
                        <span>Click to upload image</span>
                        <span className="create-book-upload-hint">
                          PNG, JPG up to 5MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          hidden
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="create-book-actions">
                  <button type="submit" className="create-book-btn-submit">
                    Add Book
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="create-book-btn-cancel"
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

export default CreateBook;
