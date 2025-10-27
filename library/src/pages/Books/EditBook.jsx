import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Upload, X } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/EditBook.css";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("books");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    bookTitle: "",
    author: "",
    publicationYear: "",
    categoryId: "",
    nxb: "",
    quantity: 0,
    price: "",
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
    setActiveMenuItem(pathToItem[location.pathname] || "books");
  }, [location.pathname]);

  useEffect(() => {
    fetchCategories();
    fetchBook();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories!");
    }
  };

  const fetchBook = async () => {
    try {
      const response = await axios.get(`/api/books/getBook/${id}`);
      const book = response.data;
      setFormData({
        bookTitle: book.bookTitle,
        author: book.author,
        publicationYear: book.publicationYear,
        categoryId: book.categoryId,
        nxb: book.nxb || "",
        quantity: book.quantity,
        price: book.price,
      });
      if (book.imageUrl) {
        setImagePreview(`http://localhost:8080/${book.imageUrl}`);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching book:", error);
      toast.error("Failed to load book information!");
      setLoading(false);
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

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price is required and must be positive";
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
      formDataToSend.append("price", formData.price);

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      await axios.put(`/api/books/updateBook/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Book updated successfully!");
      setTimeout(() => {
        navigate("/books");
      }, 2000);
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error(error.response?.data?.message || "Failed to update book!");
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
            <div className="edit-book-loading">Loading...</div>
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
          <div className="edit-book-header">
            <button
              onClick={handleCancel}
              className="edit-book-btn-back"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="edit-book-h1">Books Management / Edit Book</h1>
          </div>

          <div className="edit-book-wrapper">
            <div className="edit-book-container">
              <form onSubmit={handleSubmit} className="edit-book-form">
                {/* Book Information */}
                <div className="edit-book-section">
                  <h2>Book Information</h2>

                  <div className="edit-book-group">
                    <label htmlFor="bookTitle">Book Title</label>
                    <input
                      id="bookTitle"
                      name="bookTitle"
                      value={formData.bookTitle}
                      onChange={handleChange}
                      placeholder="Enter book title"
                      className={`edit-book-input ${
                        errors.bookTitle ? "error" : ""
                      }`}
                    />
                    {errors.bookTitle && (
                      <span className="edit-book-error">
                        {errors.bookTitle}
                      </span>
                    )}
                  </div>

                  <div className="edit-book-row">
                    <div className="edit-book-group">
                      <label htmlFor="author">Author</label>
                      <input
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Enter author name"
                        className={`edit-book-input ${
                          errors.author ? "error" : ""
                        }`}
                      />
                      {errors.author && (
                        <span className="edit-book-error">{errors.author}</span>
                      )}
                    </div>

                    <div className="edit-book-group">
                      <label htmlFor="publicationYear">Publication Year </label>
                      <input
                        id="publicationYear"
                        name="publicationYear"
                        type="number"
                        value={formData.publicationYear}
                        onChange={handleChange}
                        placeholder="e.g., 2024"
                        min={getMinYear()}
                        max={getMaxYear()}
                        className={`edit-book-input ${
                          errors.publicationYear ? "error" : ""
                        }`}
                      />
                      {errors.publicationYear && (
                        <span className="edit-book-error">
                          {errors.publicationYear}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="edit-book-row">
                    <div className="edit-book-group">
                      <label htmlFor="categoryId">Category</label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className={`edit-book-input ${
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
                        <span className="edit-book-error">
                          {errors.categoryId}
                        </span>
                      )}
                    </div>

                    <div className="edit-book-group">
                      <label htmlFor="nxb">Publisher</label>
                      <input
                        id="nxb"
                        name="nxb"
                        value={formData.nxb}
                        onChange={handleChange}
                        placeholder="Enter publisher name"
                        className="edit-book-input"
                      />
                    </div>
                  </div>

                  <div className="edit-book-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="Enter quantity"
                      min="0"
                      className={`edit-book-input ${
                        errors.quantity ? "error" : ""
                      }`}
                    />
                    {errors.quantity && (
                      <span className="edit-book-error">{errors.quantity}</span>
                    )}
                  </div>

                  <div className="edit-book-group">
                    <label>Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      min="1"
                      step="1"
                      className={`edit-book-input ${
                        errors.price ? "error" : ""
                      }`}
                    />
                    {errors.price && (
                      <span className="edit-book-error">{errors.price}</span>
                    )}
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="edit-book-section">
                  <h2>Book Image</h2>
                  <div className="edit-book-image-upload">
                    {imagePreview ? (
                      <div className="edit-book-image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="edit-book-remove-image"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <label className="edit-book-upload-label">
                        <Upload size={40} />
                        <span>Click to upload image</span>
                        <span className="edit-book-upload-hint">
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

                <div className="edit-book-actions">
                  <button type="submit" className="edit-book-btn-submit">
                    Update Book
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="edit-book-btn-cancel"
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

export default EditBook;
