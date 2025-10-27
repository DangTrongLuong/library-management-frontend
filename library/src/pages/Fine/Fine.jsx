import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { Edit, Trash2, Eye, ChevronDown } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Fine.css";

const Fine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("penalties");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fines, setFines] = useState([]);
  console.log(fines);
  const [filteredFines, setFilteredFines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const sortDropdownRef = useRef(null);
  const itemsPerPage = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFineId, setDeleteFineId] = useState(null);

  useEffect(() => {
    fetchFines();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = fines.filter(
      (fine) =>
        String(fine.id).toLowerCase().includes(term) ||
        String(fine.borrowId || "")
          .toLowerCase()
          .includes(term) ||
        (fine.reason && fine.reason.toLowerCase().includes(term)) ||
        (fine.paymentStatus && fine.paymentStatus.toLowerCase().includes(term))
    );
    setFilteredFines(filtered);
    setCurrentPage(1);
  }, [searchTerm, fines]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchFines = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/fines");
      setFines(response.data.content || response.data);
      setFilteredFines(response.data.content || response.data);
    } catch (error) {
      toast.error("Error fetching fines list!");
      setFines([]);
      setFilteredFines([]);
    }
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setSortDropdownOpen(false);
    const sorted = [...filteredFines].sort((a, b) => {
      const dateA = new Date(a.fineDate);
      const dateB = new Date(b.fineDate);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
    setFilteredFines(sorted);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    setDeleteFineId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/fines/${deleteFineId}`);
      fetchFines();
      toast.success("Fine deleted successfully!");
      setShowDeleteModal(false);
      setDeleteFineId(null);
    } catch (error) {
      console.error("Error deleting fine:", error);
      toast.error("Cannot delete fine!");
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteFineId(null);
  };

  const totalPages = Math.ceil(filteredFines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFines = filteredFines.slice(startIndex, endIndex);

  const handlePageChange = (page) => setCurrentPage(page);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleMenuClick = (itemId) => setActiveMenuItem(itemId);
  const handleAddFine = () => navigate("/penalties/create");
  const handleDetail = (id) => navigate(`/penalties/detail/${id}`);
  const handleEdit = (id) => navigate(`/penalties/edit/${id}`);

  return (
    <div className="my-project-container">
      <ToastContainer autoClose={3000} />
      <NavBar userName="Admin" onToggleSidebar={toggleSidebar} />
      <div className="main-layout">
        <SideBar
          activeItem={activeMenuItem}
          onItemClick={handleMenuClick}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="main-content">
          <div className="fine-header">
            <h1 className="fine-title">Fine Management</h1>
          </div>

          <div className="fine-controls">
            <input
              type="text"
              placeholder="Search by Fine ID, Borrow ID, Reason, Status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="fine-search-input"
            />
            <div className="fine-sort-dropdown-container" ref={sortDropdownRef}>
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="fine-sort-dropdown"
              >
                Sort by Fine Date {sortOrder === "asc" ? "↑" : "↓"}
                <ChevronDown
                  size={16}
                  className={`fine-dropdown-icon ${
                    sortDropdownOpen ? "open" : ""
                  }`}
                />
              </button>
              {sortDropdownOpen && (
                <div className="fine-sort-dropdown-menu">
                  <button
                    className="fine-sort-option"
                    onClick={() => handleSort("asc")}
                  >
                    Fine Date (Oldest-Newest)
                  </button>
                  <button
                    className="fine-sort-option"
                    onClick={() => handleSort("desc")}
                  >
                    Fine Date (Newest-Oldest)
                  </button>
                </div>
              )}
            </div>
            <button onClick={handleAddFine} className="fine-add-btn">
              + Add Fine
            </button>
          </div>

          <div className="fine-table-container">
            <table className="fine-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Borrow ID</th>
                  <th>Reader</th>
                  <th>Book</th>
                  <th>Reason</th>
                  <th>Amount</th>
                  <th>Fine Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentFines.length > 0 ? (
                  currentFines.map((fine) => (
                    <tr key={fine.id}>
                      <td>{fine.id}</td>
                      <td>{fine.borrowId}</td>
                      <td>{fine.readerName}</td>
                      <td>{fine.bookTitle}</td>
                      <td>{fine.reasonDescription}</td>
                      <td>{fine.amount} VND</td>
                      <td>
                        {fine.fineDate
                          ? format(new Date(fine.fineDate), "dd/MM/yyyy HH:mm")
                          : ""}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            fine.paymentStatus === "PAID"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {fine.paymentStatusDescription}
                        </span>
                      </td>
                      <td className="fine-actions">
                        <button
                          className="btn btn-edit-fine"
                          title="Edit"
                          onClick={() => handleEdit(fine.id)}
                        >
                          <Edit size={20} className="menu-action-fine-icon" />
                        </button>
                        <button
                          className="btn btn-delete-fine"
                          title="Delete"
                          onClick={() => handleDelete(fine.id)}
                        >
                          <Trash2 size={20} className="menu-action-fine-icon" />
                        </button>
                        <button
                          className="btn btn-detail-fine"
                          title="Detail"
                          onClick={() => handleDetail(fine.id)}
                        >
                          <Eye size={20} className="menu-action-fine-icon" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="fine-no-data">
                      No fines found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredFines.length > 0 && (
            <div className="fine-pagination">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="fine-btn-page"
              >
                &lt;&lt;
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="fine-btn-page"
              >
                &lt;
              </button>
              <span className="fine-page-info">
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="fine-btn-page"
              >
                &gt;
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="fine-btn-page"
              >
                &gt;&gt;
              </button>
            </div>
          )}

          {showDeleteModal && (
            <div className="modal-overlay-fine">
              <div className="modal-content-fine">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this fine?</p>
                <div className="modal-buttons-fine">
                  <button
                    onClick={confirmDelete}
                    className="modal-btn-confirm-fine"
                  >
                    Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="modal-btn-cancel-fine"
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

export default Fine;
