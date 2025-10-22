import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import axios from "axios";
import "../styles/Borrow.css";

const Borrow = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("borrows");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const pathToItem = {
      "/": "home",
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

  const handleMenuClick = (itemId) => setActiveMenuItem(itemId);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const fetchBorrowings = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/borrowings/search", {
        params: { readerCode: searchTerm, bookCode: searchTerm, sortBy },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, [searchTerm, sortBy]);

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

        <main className="main-content borrow-container">
  <h1 className="borrow-header">Borrow Management</h1>

  <div className="borrow-actions">
    <input
      type="text"
      placeholder="Search by reader code or book code..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="borrow-search"
    />
    <select
      onChange={(e) => setSortBy(e.target.value)}
      value={sortBy}
      className="borrow-sort"
    >
      <option value="title">Sort by Title (A-Z)</option>
      <option value="readerCode">Sort by Reader Code</option>
    </select>
    <button className="borrow-add-btn">+ Add Borrow</button>
  </div>

  <div className="borrow-list">
    {results.length === 0 ? (
      <p>No borrow records found.</p>
    ) : (
      results.map((item) => (
        <div key={item.id} className="borrow-card">
          <h4>{item.title}</h4>
          <p><strong>Reader:</strong> {item.readerCode}</p>
          <p><strong>Book:</strong> {item.bookCode}</p>
          <p><strong>Borrow Date:</strong> {item.borrowDate}</p>
          <p><strong>Return Date:</strong> {item.returnDate}</p>
          <div className="borrow-card-actions">
            <button className="edit-btn">✏️</button>
            <button className="delete-btn">🗑️</button>
            <button className="view-btn">👁️</button>
          </div>
        </div>
      ))
    )}
  </div>
</main>
      </div>
    </div>
  );
};

export default Borrow;