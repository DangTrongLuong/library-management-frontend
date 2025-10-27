import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit, Trash2, Eye, ChevronDown, Plus } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Borrow.css";

const Borrow = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("borrows");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [borrows, setBorrows] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBorrows, setFilteredBorrows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortField, setSortField] = useState("borrowDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("BORROWED");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBorrowId, setDeleteBorrowId] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const sortDropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);

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
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const response = await axios.get("/api/borrows/getAllBorrows");
      setBorrows(response.data);
      setFilteredBorrows(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching borrows:", error);
      toast.error("Failed to load borrow list!");
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
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = borrows.filter(
      (br) =>
        String(br.borrowId).toLowerCase().includes(term) ||
        br.readerName.toLowerCase().includes(term) ||
        br.bookTitle.toLowerCase().includes(term)
    );

    setFilteredBorrows(filtered);
    setCurrentPage(1);
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    setSortDropdownOpen(false);

    const sorted = [...filteredBorrows].sort((a, b) => {
      let valueA, valueB;

      if (field === "borrowDate") {
        valueA = a.borrowDate;
        valueB = b.borrowDate;
      } else if (field === "dueDate") {
        valueA = a.dueDate;
        valueB = b.dueDate;
      }

      return order === "asc"
        ? new Date(valueA) - new Date(valueB)
        : new Date(valueB) - new Date(valueA);
    });

    setFilteredBorrows(sorted);
    setCurrentPage(1);
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
    setFilterDropdownOpen(false);

    if (status === "ALL") {
      setFilteredBorrows(borrows);
    } else {
      const filtered = borrows.filter((borrow) => borrow.status === status);
      setFilteredBorrows(filtered);
    }

    setCurrentPage(1);
  };

  const handleAdd = () => {
    navigate("/borrows/createBorrow");
  };

  const handleEdit = (id) => {
    navigate(`/borrows/editBorrow/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteBorrowId(id);
    setShowDeleteModal(true);
  };

  const handleDetail = (id) => {
    navigate(`/borrows/detailBorrow/${id}`);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/borrows/deleteBorrow/${deleteBorrowId}`);
      fetchBorrows();
      setShowDeleteModal(false);
      setDeleteBorrowId(null);
      toast.success("Borrow deleted successfully!");
    } catch (error) {
      console.error("Error deleting borrow:", error);
      toast.error("Cannot delete borrow!");
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteBorrowId(null);
  };

  const totalPages = Math.ceil(filteredBorrows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBorrows = filteredBorrows.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
          <div className="borrow-header">
            <h1 className="borrow-title">Borrow Management</h1>
          </div>

          <div className="borrow-controls">
            <input
              type="text"
              placeholder="Search borrows by ID..."
              value={searchTerm}
              onChange={handleSearch}
              className="borrow-search-input"
            />

            <div
              className="borrow-sort-dropdown-container"
              ref={sortDropdownRef}
            >
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="borrow-sort-dropdown"
              >
                Sort by {sortField} {sortOrder === "asc" ? "↑" : "↓"}
                <ChevronDown
                  size={16}
                  className={`borrow-dropdown-icon ${
                    sortDropdownOpen ? "open" : ""
                  }`}
                />
              </button>

              {sortDropdownOpen && (
                <div className="borrow-sort-dropdown-menu">
                  <button
                    className="borrow-sort-option"
                    onClick={() => handleSort("borrowDate", "asc")}
                  >
                    Borrow Date (A-Z)
                  </button>
                  <button
                    className="borrow-sort-option"
                    onClick={() => handleSort("borrowDate", "desc")}
                  >
                    Borrow Date (Z-A)
                  </button>
                  <div className="borrow-sort-divider"></div>
                  <button
                    className="borrow-sort-option"
                    onClick={() => handleSort("dueDate", "asc")}
                  >
                    Due Date (A-Z)
                  </button>
                  <button
                    className="borrow-sort-option"
                    onClick={() => handleSort("dueDate", "desc")}
                  >
                    Due Date (Z-A)
                  </button>
                </div>
              )}
            </div>

            <div
              className="borrow-filter-dropdown-container"
              ref={filterDropdownRef}
            >
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="borrow-filter-dropdown"
              >
                Filter by Status {filterStatus}
                <ChevronDown
                  size={16}
                  className={`borrow-dropdown-icon ${
                    filterDropdownOpen ? "open" : ""
                  }`}
                />
              </button>

              {filterDropdownOpen && (
                <div className="borrow-filter-dropdown-menu">
                  <button
                    className="borrow-filter-option"
                    onClick={() => handleFilter("ALL")}
                  >
                    ALL STATUS
                  </button>
                  <button
                    className="borrow-filter-option"
                    onClick={() => handleFilter("BORROWED")}
                  >
                    BORROWED
                  </button>
                  <button
                    className="borrow-filter-option"
                    onClick={() => handleFilter("OVERDUE")}
                  >
                    OVERDUE
                  </button>
                  <button
                    className="borrow-filter-option"
                    onClick={() => handleFilter("RETURNED")}
                  >
                    RETURNED
                  </button>
                </div>
              )}
            </div>

            <button onClick={handleAdd} className="borrow-add-btn">
              <Plus size={18} /> Add Borrow
            </button>
          </div>

          <div className="borrow-table-container">
            <table className="borrow-table">
              <thead>
                <tr>
                  <th>Borrow ID</th>

                  <th>Reader Name</th>

                  <th>Book Title</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Borrow Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBorrows.length > 0 ? (
                  currentBorrows.map((borrow) => (
                    <tr key={borrow.borrowId}>
                      <td>{borrow.borrowId}</td>

                      <td>{borrow.readerName}</td>

                      <td>{borrow.bookTitle}</td>
                      <td>{borrow.borrowDate}</td>
                      <td>{borrow.dueDate}</td>
                      <td>{borrow.borrowPrice} VND</td>
                      <td
                        style={{
                          color:
                            borrow.status === "BORROWED"
                              ? "goldenrod"
                              : borrow.status === "OVERDUE"
                              ? "red"
                              : "green",
                          fontWeight: "bold",
                        }}
                      >
                        {borrow.status}
                      </td>
                      <td>
                        <button
                          title="Edit"
                          onClick={() => handleEdit(borrow.borrowId)}
                          className="borrow-btn borrow-btn-edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(borrow.borrowId)}
                          className="borrow-btn borrow-btn-delete"
                        >
                          <Trash2 size={18} />
                        </button>

                        <button
                          title="Detail"
                          onClick={() => handleDetail(borrow.borrowId)}
                          className="borrow-btn borrow-btn-detail"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="borrow-no-data">
                      No borrows found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredBorrows.length > 0 && (
            <div className="borrow-pagination">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="borrow-btn-page"
                title="First page"
              >
                &lt;&lt;
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="borrow-btn-page"
                title="Previous page"
              >
                &lt;
              </button>

              <span className="borrow-page-info">
                Page {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="borrow-btn-page"
                title="Next page"
              >
                &gt;
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="borrow-btn-page"
                title="Last page"
              >
                &gt;&gt;
              </button>
            </div>
          )}

          {showDeleteModal && (
            <div className="borrow-modal-overlay">
              <div className="borrow-modal-content">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this borrow?</p>
                <div className="borrow-modal-buttons">
                  <button
                    onClick={confirmDelete}
                    className="borrow-modal-btn-confirm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="borrow-modal-btn-cancel"
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

export default Borrow;
