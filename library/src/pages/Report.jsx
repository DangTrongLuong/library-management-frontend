import React, { useState, useRef, useEffect } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import "../styles/Report.css";

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
        </main>
      </div>
    </div>
  );
};

export default Report;