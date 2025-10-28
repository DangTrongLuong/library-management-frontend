import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit, Trash2, Eye, ChevronDown, Plus } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import "../../styles/Report.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Report = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("reports");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortField, setSortField] = useState("fromDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReportId, setDeleteReportId] = useState(null);
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
    setActiveMenuItem(pathToItem[location.pathname] || "reports");
  }, [location.pathname]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get("/api/reports/getAllReport");
      setReports(response.data);
      setFilteredReports(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load report list!");
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

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = reports.filter(
      (report) =>
        report.type.toLowerCase().includes(term) ||
        report.typeDescription.toLowerCase().includes(term) ||
        report.createdBy.toLowerCase().includes(term)
    );
    setFilteredReports(filtered);
    setCurrentPage(1);
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    setSortDropdownOpen(false);

    const sorted = [...filteredReports].sort((a, b) => {
      let valueA, valueB;

      if (field === "type") {
        valueA = a.typeDescription.toLowerCase();
        valueB = b.typeDescription.toLowerCase();
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (field === "fromDate") {
        valueA = new Date(a.fromDate);
        valueB = new Date(b.fromDate);
        return order === "asc" ? valueA - valueB : valueB - valueA;
      } else if (field === "createdAt") {
        valueA = new Date(a.createdAt);
        valueB = new Date(b.createdAt);
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }
    });

    setFilteredReports(sorted);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    navigate("/reports/createReport");
  };

  const handleEdit = (id) => {
    navigate(`/reports/editReport/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteReportId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/reports/deleteReport/${deleteReportId}`);
      fetchReports();
      setShowDeleteModal(false);
      setDeleteReportId(null);
      toast.success("Report deleted successfully!");
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Cannot delete report!");
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteReportId(null);
  };

  const handleDetail = (id) => {
    navigate(`/reports/detailReport/${id}`);
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

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getSortLabel = () => {
    if (sortField === "type") {
      return `Sort by Type ${sortOrder === "asc" ? "(A-Z)" : "(Z-A)"}`;
    } else if (sortField === "fromDate") {
      return `Sort by From Date ${
        sortOrder === "asc" ? "(Oldest)" : "(Newest)"
      }`;
    } else if (sortField === "createdAt") {
      return `Sort by Created ${sortOrder === "asc" ? "(Oldest)" : "(Newest)"}`;
    }
    return "Sort";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
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
          <h1 className="report-management">Report Management</h1>

          <div className="report-controls">
            <input
              type="text"
              placeholder="Search by type, description, created by..."
              value={searchTerm}
              onChange={handleSearch}
              className="report-search-input"
            />

            <div
              className="report-sort-dropdown-container"
              ref={sortDropdownRef}
            >
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="btn report-sort-dropdown"
              >
                <span>{getSortLabel()}</span>
                <ChevronDown
                  size={18}
                  className={`report-dropdown-icon ${
                    sortDropdownOpen ? "open" : ""
                  }`}
                />
              </button>

              {sortDropdownOpen && (
                <div className="report-sort-dropdown-menu">
                  <button
                    className="btn report-sort-option"
                    onClick={() => handleSort("type", "asc")}
                  >
                    Type (A-Z)
                  </button>
                  <button
                    className="btn report-sort-option"
                    onClick={() => handleSort("type", "desc")}
                  >
                    Type (Z-A)
                  </button>
                  <div className="sort-divider-report"></div>
                  <button
                    className="btn report-sort-option"
                    onClick={() => handleSort("fromDate", "asc")}
                  >
                    From Date (Oldest)
                  </button>
                  <button
                    className="btn report-sort-option"
                    onClick={() => handleSort("fromDate", "desc")}
                  >
                    From Date (Newest)
                  </button>
                  <div className="sort-divider-report"></div>
                  <button
                    className="btn report-sort-option"
                    onClick={() => handleSort("createdAt", "asc")}
                  >
                    Created (Oldest)
                  </button>
                  <button
                    className="btn report-sort-option"
                    onClick={() => handleSort("createdAt", "desc")}
                  >
                    Created (Newest)
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleAdd}
              className="btn-action-report report-btn-add"
            >
              <Plus size={20} />
              Add Report
            </button>
          </div>

          <table className="data-table-report">
            <thead>
              <tr className="table-footer-report">
                <th colSpan="7" className="footer-info-report">
                  Total: {filteredReports.length} / {currentPage * itemsPerPage}
                </th>
              </tr>
              <tr className="table-header-report">
                <th>ID</th>
                <th>Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(currentReports) && currentReports.length > 0 ? (
                currentReports.map((report, index) => (
                  <tr key={report.id} className="table-row-report">
                    <td>{index + 1}</td>
                    <td>{report.typeDescription}</td>
                    <td>{formatDate(report.fromDate)}</td>
                    <td>{formatDate(report.toDate)}</td>
                    <td>{report.createdBy}</td>
                    <td>{formatDate(report.createdAt)}</td>
                    <td className="action-cell-report">
                      <button
                        title="Edit"
                        onClick={() => handleEdit(report.id)}
                        className="btn btn-edit-report"
                      >
                        <Edit size={20} className="menu-action-report-icon" />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(report.id)}
                        className="btn btn-delete-report"
                      >
                        <Trash2 size={20} className="menu-action-report-icon" />
                      </button>
                      <button
                        title="Detail"
                        onClick={() => handleDetail(report.id)}
                        className="btn btn-detail-report"
                      >
                        <Eye size={20} className="menu-action-report-icon" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data-report">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {filteredReports.length > 0 && (
            <div className="pagination-report">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="btn-page-report"
                title="First page"
              >
                &lt;&lt;
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-page-report"
                title="Previous page"
              >
                &lt;
              </button>

              <span className="page-info-report">
                Page {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-page-report"
                title="Next page"
              >
                &gt;
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="btn-page-report"
                title="Last page"
              >
                &gt;&gt;
              </button>
            </div>
          )}

          {showDeleteModal && (
            <div className="modal-overlay-report">
              <div className="modal-content-report">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this report?</p>
                <div className="modal-buttons-report">
                  <button
                    onClick={confirmDelete}
                    className="modal-btn-confirm-report"
                  >
                    Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="modal-btn-cancel-report"
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

export default Report;
