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
              onChange={(e) => setSearchTerm(e.target.value)}
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
            <thead className="table-header-report">
              <tr>
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
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data-report">
                    No reports found
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.reportId} className="table-row-report">
                    <td>{report.reportId}</td>
                    <td>{report.reportType}</td>
                    <td>{formatDate(report.startDate)}</td>
                    <td>{formatDate(report.endDate)}</td>
                    <td>{report.content}</td>
                    <td>{report.creator?.username || "Unknown"}</td>
                    <td className="action-cell-report">
                      <button className="btn-action-report btn-edit-report">
                        Edit
                      </button>
                      <button className="btn-action-report btn-delete-report">
                        Delete
                      </button>
                      <button className="btn-action-report btn-detail-report">
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default Report;