import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/CreateBorrow.css";

const CreateBorrow = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("borrows");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    readerId: "",
    bookId: "",
    borrowDate: "",
    dueDate: "",
    notes: "",
  });
  const [readerName, setReaderName] = useState("");
  const [bookTitle, setBookTitle] = useState("");
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
    setActiveMenuItem(pathToItem[location.pathname] || "borrows");
  }, [location.pathname]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, borrowDate: today }));
  }, []);

  const handleReaderIdChange = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, readerId: value });
    if (value.trim()) {
      try {
        const response = await axios.get(`/api/readers/getReader/${value}`);
        setReaderName(response.data.name);
      } catch (error) {
        setReaderName("");
        toast.error("Reader not found!");
      }
    } else {
      setReaderName("");
    }
  };

  const handleBookIdChange = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, bookId: value });
    if (value.trim()) {
      try {
        const response = await axios.get(`/api/books/getBook/${value}`);
        setBookTitle(response.data.bookTitle);
      } catch (error) {
        setBookTitle("");
        toast.error("Book not found!");
      }
    } else {
      setBookTitle("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.readerId?.trim()) {
      newErrors.readerId = "Reader ID is required";
    }

    if (!formData.bookId?.trim()) {
      newErrors.bookId = "Book ID is required";
    }

    if (!formData.borrowDate) {
      newErrors.borrowDate = "Borrow date is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (
      formData.dueDate &&
      formData.borrowDate &&
      new Date(formData.dueDate) < new Date(formData.borrowDate)
    ) {
      newErrors.dueDate = "Due date cannot be before borrow date";
    }

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
      await axios.post("/api/borrows/createBorrow", formData);
      toast.success("Borrow added successfully!");
      setTimeout(() => {
        navigate("/borrows");
      }, 2000);
    } catch (error) {
      console.error("Error creating borrow:", error);
      toast.error(error.response?.data?.message || "Failed to add borrow!");
    }
  };

  const handleCancel = () => {
    navigate("/borrows");
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
          <div className="create-borrow-header">
            <button
              onClick={handleCancel}
              className="create-borrow-btn-back"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="create-borrow-h1">
              Borrow Management/ Add New Borrow
            </h1>
          </div>

          <div className="create-borrow-wrapper">
            <div className="create-borrow-container">
              <form onSubmit={handleSubmit} className="create-borrow-form">
                <div className="create-borrow-section">
                  <h2>Borrow Information</h2>

                  <div className="create-borrow-row">
                    <div className="create-borrow-group">
                      <label htmlFor="readerId">
                        Reader ID{" "}
                        <span className="create-borrow-required">*</span>
                      </label>
                      <input
                        id="readerId"
                        name="readerId"
                        value={formData.readerId}
                        onChange={handleReaderIdChange}
                        placeholder="Enter reader ID"
                        className={`create-borrow-input ${
                          errors.readerId ? "error" : ""
                        }`}
                      />
                      {errors.readerId && (
                        <span className="create-borrow-error">
                          {errors.readerId}
                        </span>
                      )}
                      {readerName && (
                        <>
                          <label
                            htmlFor="readerId"
                            style={{ marginTop: "10px" }}
                          >
                            Reader Name{" "}
                            <span className="create-borrow-required">*</span>
                          </label>
                          <input
                            id="name"
                            name="name"
                            readOnly
                            value={readerName}
                            placeholder="Name reader"
                            className={`create-borrow-input ${
                              errors.name ? "error" : ""
                            }`}
                          />
                        </>
                        // <span className="create-borrow-display">
                        //   Reader Name: {readerName}
                        // </span>
                      )}
                    </div>

                    <div className="create-borrow-group">
                      <label htmlFor="bookId">
                        Book ID{" "}
                        <span className="create-borrow-required">*</span>
                      </label>
                      <input
                        id="bookId"
                        name="bookId"
                        value={formData.bookId}
                        onChange={handleBookIdChange}
                        placeholder="Enter book ID"
                        className={`create-borrow-input ${
                          errors.bookId ? "error" : ""
                        }`}
                      />
                      {errors.bookId && (
                        <span className="create-borrow-error">
                          {errors.bookId}
                        </span>
                      )}
                      {bookTitle && (
                        <>
                          <label htmlFor="bookId" style={{ marginTop: "10px" }}>
                            Book Name{" "}
                            <span className="create-borrow-required">*</span>
                          </label>
                          <input
                            id="bookTitle"
                            name="bookTitle"
                            readOnly
                            value={bookTitle}
                            placeholder="Name reader"
                            className={`create-borrow-input ${
                              errors.name ? "error" : ""
                            }`}
                          />
                        </>
                        // <span className="create-borrow-display">
                        //   Book Title: {bookTitle}
                        // </span>
                      )}
                    </div>
                  </div>

                  <div className="create-borrow-row">
                    <div className="create-borrow-group" hidden>
                      <label htmlFor="borrowDate">
                        Borrow Date{" "}
                        <span className="create-borrow-required">*</span>
                      </label>
                      <input
                        id="borrowDate"
                        name="borrowDate"
                        type="date"
                        value={new Date().toISOString().split("T")[0]}
                        onChange={handleChange}
                        className={`create-borrow-input ${
                          errors.borrowDate ? "error" : ""
                        }`}
                      />
                      {errors.borrowDate && (
                        <span className="create-borrow-error">
                          {errors.borrowDate}
                        </span>
                      )}
                    </div>

                    <div className="create-borrow-group">
                      <label htmlFor="dueDate">
                        Due Date{" "}
                        <span className="create-borrow-required">*</span>
                      </label>
                      <input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={formData.dueDate}
                        onChange={handleChange}
                        className={`create-borrow-input ${
                          errors.dueDate ? "error" : ""
                        }`}
                      />
                      {errors.dueDate && (
                        <span className="create-borrow-error">
                          {errors.dueDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="create-borrow-group">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Enter notes"
                      className="create-borrow-textarea"
                    />
                  </div>
                </div>

                <div className="create-borrow-actions">
                  <button type="submit" className="create-borrow-btn-submit">
                    Add Borrow
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="create-borrow-btn-cancel"
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

export default CreateBorrow;
