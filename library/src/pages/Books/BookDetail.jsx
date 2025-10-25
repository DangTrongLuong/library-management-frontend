import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  BookOpen,
  User,
  Calendar,
  Package,
  Book,
  Edit as EditIcon,
} from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/BookDetail.css";

const DetailBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("books");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [book, setBook] = useState(null);
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
    setActiveMenuItem(pathToItem[location.pathname] || "books");
  }, [location.pathname]);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`/api/books/getBook/${id}`);
      setBook(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching book:", error);
      toast.error("Failed to load book details!");
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/books");
  };

  const handleEdit = () => {
    navigate(`/books/editBook/${id}`);
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
            <div className="detail-book-loading">Loading...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!book) {
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
            <div className="detail-book-error">Book not found</div>
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
          <div className="detail-book-header">
            <button
              onClick={handleBack}
              className="detail-book-btn-back"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="detail-book-h1">Books Management / Book Details</h1>
          </div>

          <div className="detail-book-wrapper">
            <div className="detail-book-container">
              <div className="detail-book-image-section">
                {book.imageUrl ? (
                  <img
                    src={`http://localhost:8080${book.imageUrl}`}
                    alt={book.bookTitle}
                    className="detail-book-image"
                    onError={(e) => {
                      e.target.src = "/placeholder-book.png";
                    }}
                  />
                ) : (
                  <div className="detail-book-no-image">No Image</div>
                )}
              </div>

              <div className="detail-book-info-section">
                <h2 className="detail-book-title">{book.bookTitle}</h2>

                <div className="detail-book-info-item">
                  <User size={20} className="detail-book-icon" />
                  <span className="detail-book-label">Author:</span>
                  <span className="detail-book-value">{book.author}</span>
                </div>

                <div className="detail-book-info-item">
                  <Calendar size={20} className="detail-book-icon" />
                  <span className="detail-book-label">Publication Year:</span>
                  <span className="detail-book-value">
                    {book.publicationYear}
                  </span>
                </div>

                <div className="detail-book-info-item">
                  <Book size={20} className="detail-book-icon" />
                  <span className="detail-book-label">Category:</span>
                  <span className="detail-book-value">
                    {book.categoryName || "N/A"}
                  </span>
                </div>

                <div className="detail-book-info-item">
                  <BookOpen size={20} className="detail-book-icon" />
                  <span className="detail-book-label">Publisher:</span>
                  <span className="detail-book-value">{book.nxb || "N/A"}</span>
                </div>

                <div className="detail-book-info-item">
                  <Package size={20} className="detail-book-icon" />
                  <span className="detail-book-label">Quantity:</span>
                  <span className="detail-book-value">{book.quantity}</span>
                </div>
              </div>
            </div>

            <div className="detail-book-actions">
              <button onClick={handleEdit} className="detail-book-btn-edit">
                <EditIcon size={20} />
                Edit Book
              </button>
              <button onClick={handleBack} className="detail-book-btn-cancel">
                Back to List
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetailBook;
