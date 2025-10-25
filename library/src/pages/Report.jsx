import React, { useState, useRef, useEffect } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import "../styles/Report.css";

import axios from "axios";

const Report = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("reports");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredReports, setFilteredReports] = useState([]);
  const itemsPerPage = 10;
  const sortDropdownRef = useRef(null);

  const handleMenuClick = (itemId) => setActiveMenuItem(itemId);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8080/api/reports/getAllReport"
        );
        setReports(response.data);
        setFilteredReports(response.data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getSortLabel = () =>
    `Sort by Title ${sortOrder === "asc" ? "(A-Z)" : "(Z-A)"}`;

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    setSortDropdownOpen(false);
  };

  const handleAddReport = () => {
    alert("Điều hướng đến trang tạo báo cáo");
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = reports.filter(
      (report) =>
        report.reportId.toString().includes(term) ||
        report.reportType.toLowerCase().includes(term) ||
        report.content.toLowerCase().includes(term)
    );
    setFilteredReports(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

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
          <h1 className="report-management">Reports Management</h1>

          <div className="report-controls">
            <input
              type="text"
              placeholder="Search by title, category..."
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
                className="report-sort-dropdown"
              >
                <span>{getSortLabel()}</span>
                <span
                  className={`report-dropdown-icon ${
                    sortDropdownOpen ? "open" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {sortDropdownOpen && (
                <div className="report-sort-dropdown-menu">
                  <button
                    className="report-sort-option"
                    onClick={() => handleSort("title", "asc")}
                  >
                    Title (A-Z)
                  </button>
                  <button
                    className="report-sort-option"
                    onClick={() => handleSort("title", "desc")}
                  >
                    Title (Z-A)
                  </button>
                </div>
              )}
            </div>

            <button onClick={handleAddReport} className="report-btn-add">
              + Add Report
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
                <th>Report Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Content</th>
                <th>Creator</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="no-data-report">
                    Loading reports...
                  </td>
                </tr>
              ) : currentReports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data-report">
                    No reports found
                  </td>
                </tr>
              ) : (
                currentReports.map((report) => (
                  <tr key={report.reportId} className="table-row-report">
                    <td>{report.reportId}</td>
                    <td>{report.reportType}</td>
                    <td>{formatDate(report.startDate)}</td>
                    <td>{formatDate(report.endDate)}</td>
                    <td>{report.content}</td>
                    <td>{report.creator?.username || "Unknown"}</td>
                    <td className="action-cell-report">
                      <button
                        title="Edit"
                        onClick={() => handleEdit(report.reportId)}
                        className="btn btn-edit-report"
                      >
                        <Edit size={20} className="menu-action-report-icon" />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(report.reportId)}
                        className="btn btn-delete-report"
                      >
                        <Trash2 size={20} className="menu-action-report-icon" />
                      </button>
                      <button
                        title="Detail"
                        onClick={() => handleDetail(report.reportId)}
                        className="btn btn-detail-report"
                      >
                        <Eye size={20} className="menu-action-report-icon" />
                      </button>
                    </td>
                  </tr>
                ))
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
        </main>
      </div>
    </div>
  );
};

export default Report;