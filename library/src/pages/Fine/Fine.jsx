import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Fine.css";

const Fine = () => {
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("penalties");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fines, setFines] = useState([]);
  const [filteredFines, setFilteredFines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const sortDropdownRef = useRef(null);

  useEffect(() => {
    fetchFines();
  }, []);

  useEffect(() => {
    // Filter fines by search term
    const term = searchTerm.toLowerCase();
    const filtered = fines.filter(
      (fine) =>
        String(fine.id).toLowerCase().includes(term) ||
        String(fine.borrow?.id).toLowerCase().includes(term) ||
        (fine.reason && fine.reason.toLowerCase().includes(term)) ||
        (fine.paymentStatus && fine.paymentStatus.toLowerCase().includes(term))
    );
    setFilteredFines(filtered);
    setCurrentPage(1);
  }, [searchTerm, fines]);

  useEffect(() => {
    // Close dropdown when click outside
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
      setFines(response.data);
      setFilteredFines(response.data);
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

  // Pagination
  const totalPages = Math.ceil(filteredFines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFines = filteredFines.slice(startIndex, endIndex);

  const handlePageChange = (page) => setCurrentPage(page);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
          </div>
          <div className="fine-table-container">
            <table className="fine-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Borrow ID</th>
                  <th>Reason</th>
                  <th>Amount</th>
                  <th>Fine Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentFines.length > 0 ? (
                  currentFines.map((fine) => (
                    <tr key={fine.id}>
                      <td>{fine.id}</td>
                      <td>{fine.borrow?.id}</td>
                      <td>{fine.reason}</td>
                      <td>${fine.amount}</td>
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
                          {fine.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="fine-no-data">
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
                title="First page"
              >
                &lt;&lt;
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="fine-btn-page"
                title="Previous page"
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
                title="Next page"
              >
                &gt;
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="fine-btn-page"
                title="Last page"
              >
                &gt;&gt;
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Fine;