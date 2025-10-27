import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/EditBorrow.css";

const EditBorrow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("borrows");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    readerId: "",
    bookId: "",
    borrowDate: "",
    dueDate: "",
    notes: "",
    status: "BORROWED",
  });
  const [readerName, setReaderName] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

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
    fetchBorrow();
  }, [id]);

  const fetchBorrow = async () => {
    try {
      const response = await axios.get(`/api/borrows/getBorrow/${id}`);
      setFormData({
        readerId: response.data.readerId,
        bookId: response.data.bookId,
        borrowDate: response.data.borrowDate,
        dueDate: response.data.dueDate,
        notes: response.data.notes || "",
        status: response.data.status || "BORROWED",
      });
      setReaderName(response.data.readerName);
      setBookTitle(response.data.bookTitle);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching borrow:", error);
      toast.error("Failed to load borrow information!");
      setLoading(false);
    }
  };

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
      await axios.put(`/api/borrows/updateBorrow/${id}`, formData);
      toast.success("Borrow updated successfully!");
      setTimeout(() => {
        navigate("/borrows");
      }, 2000);
    } catch (error) {
      console.error("Error updating borrow:", error);
      toast.error(error.response?.data?.message || "Failed to update borrow!");
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
            <div className="edit-borrow-loading">Loading...</div>
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
          <div className="edit-borrow-header">
            <button
              onClick={handleCancel}
              className="edit-borrow-btn-back"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="edit-borrow-h1">Edit Borrow</h1>
          </div>

          <div className="edit-borrow-wrapper">
            <div className="edit-borrow-container">
              <form onSubmit={handleSubmit} className="edit-borrow-form">
                <div className="edit-borrow-section">
                  <h2>Borrow Information</h2>

                  <div className="edit-borrow-row">
                    <div className="edit-borrow-group">
                      <label htmlFor="readerId">Reader ID </label>
                      <input
                        id="readerId"
                        name="readerId"
                        value={formData.readerId}
                        onChange={handleReaderIdChange}
                        placeholder="Enter reader ID"
                        className={`edit-borrow-input ${
                          errors.readerId ? "error" : ""
                        }`}
                      />
                      {errors.readerId && (
                        <span className="edit-borrow-error">
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
                      )}
                    </div>

                    <div className="edit-borrow-group">
                      <label htmlFor="bookId">Book ID</label>
                      <input
                        id="bookId"
                        name="bookId"
                        value={formData.bookId}
                        onChange={handleBookIdChange}
                        placeholder="Enter book ID"
                        className={`edit-borrow-input ${
                          errors.bookId ? "error" : ""
                        }`}
                      />
                      {errors.bookId && (
                        <span className="edit-borrow-error">
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
                      )}
                    </div>
                  </div>

                  <div className="edit-borrow-row">
                    <div className="edit-borrow-group">
                      <label htmlFor="borrowDate">Borrow Date </label>
                      <input
                        id="borrowDate"
                        name="borrowDate"
                        type="date"
                        // min={new Date().toISOString().split("T")[0]}
                        value={formData.borrowDate}
                        onChange={handleChange}
                        className={`edit-borrow-input ${
                          errors.borrowDate ? "error" : ""
                        }`}
                      />
                      {errors.borrowDate && (
                        <span className="edit-borrow-error">
                          {errors.borrowDate}
                        </span>
                      )}
                    </div>

                    <div className="edit-borrow-group">
                      <label htmlFor="dueDate">Due Date</label>
                      <input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        // min={new Date().toISOString().split("T")[0]}
                        value={formData.dueDate}
                        onChange={handleChange}
                        className={`edit-borrow-input ${
                          errors.dueDate ? "error" : ""
                        }`}
                      />
                      {errors.dueDate && (
                        <span className="edit-borrow-error">
                          {errors.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="edit-borrow-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="edit-borrow-select"
                    >
                      <option value="BORROWED">Borrowed</option>
                      <option value="RETURNED">Returned</option>
                      <option value="OVERDUE">Overdue</option>
                    </select>
                  </div>

                  <div className="edit-borrow-group">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Enter notes"
                      className="edit-borrow-textarea"
                    />
                  </div>
                </div>

                <div className="edit-borrow-actions">
                  <button type="submit" className="edit-borrow-btn-submit">
                    Update Borrow
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="edit-borrow-btn-cancel"
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

export default EditBorrow;
