import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit, Trash2, Eye, ChevronDown, Plus } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Books.css";

const Books = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("books");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const sortDropdownRef = useRef(null);

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
    setActiveMenuItem(pathToItem[location.pathname] || "home");
  }, [location.pathname]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("/api/books/getAllBooks");
      setBooks(response.data);

      setFilteredBooks(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to load book list!");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredBooks(books);
    } else {
      try {
        const response = await axios.get(`/api/books/search?keyword=${term}`);
        setFilteredBooks(response.data);
      } catch (error) {
        console.error("Error searching books:", error);
        toast.error("Search failed!");
      }
    }
    setCurrentPage(1);
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    setSortDropdownOpen(false);

    const sorted = [...filteredBooks].sort((a, b) => {
      let valueA, valueB;

      if (field === "title") {
        valueA = a.bookTitle.toLowerCase();
        valueB = b.bookTitle.toLowerCase();
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (field === "author") {
        valueA = a.author.toLowerCase();
        valueB = b.author.toLowerCase();
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });

    setFilteredBooks(sorted);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    navigate("/books/createBook");
  };

  const handleEdit = (id) => {
    navigate(`/books/editBook/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteBookId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/books/deleteBook/${deleteBookId}`);
      fetchBooks();
      setShowDeleteModal(false);
      setDeleteBookId(null);
      toast.success("Book deleted successfully!");
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Cannot delete book!");
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteBookId(null);
  };

  const handleDetail = (id) => {
    navigate(`/books/detailBook/${id}`);
  };

  const handleMenuClick = (itemId) => {
    setActiveMenuItem(itemId);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getSortLabel = () => {
    if (sortField === "title") {
      return `Sort by Title ${sortOrder === "asc" ? "(A-Z)" : "(Z-A)"}`;
    } else if (sortField === "author") {
      return `Sort by Author ${sortOrder === "asc" ? "(A-Z)" : "(Z-A)"}`;
    }
    return "Sort";
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
          <h1 className="books-management">Books Management</h1>

          <div className="books-controls">
            <input
              type="text"
              placeholder="Search by title, author, category..."
              value={searchTerm}
              onChange={handleSearch}
              className="books-search-input"
            />

            <div
              className="books-sort-dropdown-container"
              ref={sortDropdownRef}
            >
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="books-btn books-sort-dropdown"
              >
                <span>{getSortLabel()}</span>
                <ChevronDown
                  size={18}
                  className={`books-dropdown-icon ${
                    sortDropdownOpen ? "open" : ""
                  }`}
                />
              </button>

              {sortDropdownOpen && (
                <div className="books-sort-dropdown-menu">
                  <button
                    className="books-btn books-sort-option"
                    onClick={() => handleSort("title", "asc")}
                  >
                    Title (A-Z)
                  </button>
                  <button
                    className="books-btn books-sort-option"
                    onClick={() => handleSort("title", "desc")}
                  >
                    Title (Z-A)
                  </button>
                  <div className="books-sort-divider"></div>
                  <button
                    className="books-btn books-sort-option"
                    onClick={() => handleSort("author", "asc")}
                  >
                    Author (A-Z)
                  </button>
                  <button
                    className="books-btn books-sort-option"
                    onClick={() => handleSort("author", "desc")}
                  >
                    Author (Z-A)
                  </button>
                </div>
              )}
            </div>

            <button onClick={handleAdd} className="books-btn-add">
              <Plus size={20} />
              Add Book
            </button>
          </div>

          <div className="books-summary">
            <span>
              Total: {currentBooks.length} / {filteredBooks.length}
            </span>
          </div>

          <div className="books-grid">
            {Array.isArray(currentBooks) && currentBooks.length > 0 ? (
              currentBooks.map((book) => (
                <div key={book.bookId} className="books-card">
                  <div
                    className="books-card-image"
                    onClick={() => handleDetail(book.bookId)}
                  >
                    {book.imageUrl ? (
                      <img
                        src={`http://localhost:8080/${book.imageUrl}`}
                        alt={book.bookTitle}
                        onError={(e) => {
                          e.target.src = "/placeholder-book.png";
                        }}
                      />
                    ) : (
                      <div className="books-no-image">No Image</div>
                    )}
                  </div>

                  <div className="books-card-content">
                    <h3 className="books-card-title">
                      <strong>Book Name:</strong> {book.bookTitle}{" "}
                      {/* <span style={{ fontSize: "14px" }}>({book.bookId})</span> */}
                    </h3>
                    <p className="books-card-author">
                      <strong>Author:</strong> {book.author}
                    </p>

                    <p className="books-card-quantity">
                      <strong>Quantity:</strong> {book.quantity}
                    </p>
                  </div>

                  <div className="books-card-actions">
                    <button
                      title="Edit"
                      onClick={() => handleEdit(book.bookId)}
                      className="books-btn books-btn-edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDelete(book.bookId)}
                      className="books-btn books-btn-delete"
                    >
                      <Trash2 size={18} />
                    </button>
                    {/* <button
                      title="Detail"
                      onClick={() => handleDetail(book.bookId)}
                      className="books-btn books-btn-detail"
                    >
                      <Eye size={18} />
                    </button> */}
                  </div>
                </div>
              ))
            ) : (
              <div className="books-no-data">No books found</div>
            )}
          </div>

          {filteredBooks.length > 0 && (
            <div className="books-pagination">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="books-btn-page"
                title="First page"
              >
                &lt;&lt;
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="books-btn-page"
                title="Previous page"
              >
                &lt;
              </button>

              <span className="books-page-info">
                Page {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="books-btn-page"
                title="Next page"
              >
                &gt;
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="books-btn-page"
                title="Last page"
              >
                &gt;&gt;
              </button>
            </div>
          )}

          {showDeleteModal && (
            <div className="books-modal-overlay">
              <div className="books-modal-content">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this book?</p>
                <div className="books-modal-buttons">
                  <button
                    onClick={confirmDelete}
                    className="books-modal-btn-confirm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="books-modal-btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Books;
