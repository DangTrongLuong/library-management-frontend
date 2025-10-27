import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit, Trash2, Eye, ChevronDown, Plus } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import "../../styles/Readers.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reader = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("readers");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [readers, setReaders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredreaders, setFilteredreaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReaderId, setdeleteReaderId] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const sortDropdownRef = useRef(null);

  useEffect(() => {
    const pathToItem = {
      "/dashboard": "home",
      "/books": "books",
      "/readers": "readers",
      "/categorys": "category",
      "/borrows": "borrows",
      "/penalties": "penalties",
      "/reports": "reports",
    };
    setActiveMenuItem(pathToItem[location.pathname] || "readers");
  }, [location.pathname]);

  useEffect(() => {
    fetchReaders();
  }, []);

  const fetchReaders = async () => {
    try {
      const response = await axios.get("/api/readers/getAllReaders");
      setReaders(response.data);
      setFilteredreaders(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching readers:", error);
      toast.error("Failed to load librarian list!");
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
    const filtered = readers.filter(
      (reader) =>
        reader.readerId.toLowerCase().includes(term) ||
        reader.name.toLowerCase().includes(term) ||
        reader.numberPhone.toLowerCase().includes(term) ||
        reader.email.includes(term)
    );
    setFilteredreaders(filtered);
    setCurrentPage(1);
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    setSortDropdownOpen(false);

    const sorted = [...filteredreaders].sort((a, b) => {
      let valueA, valueB;

      if (field === "name") {
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (field === "cardType") {
        const cardPriority = {
          BRONZE: 1,
          SILVER: 2,
          VIP: 3,
        };

        valueA = cardPriority[a.cardType] || 0;
        valueB = cardPriority[b.cardType] || 0;

        return order === "asc" ? valueA - valueB : valueB - valueA;
      }
    });

    setFilteredreaders(sorted);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    navigate("/readers/createReader");
  };

  const handleEdit = (id) => {
    navigate(`/readers/editReader/${id}`);
  };

  const handleDelete = (id) => {
    setdeleteReaderId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/readers/deleteReader/${deleteReaderId}`);
      fetchReaders();
      setShowDeleteModal(false);
      setdeleteReaderId(null);
      toast.success("Reader deleted successfully!");
    } catch (error) {
      console.error("Error deleting librarian:", error);
      toast.error("Cannot delete librarian!");
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setdeleteReaderId(null);
  };

  const handleDetail = (id) => {
    navigate(`/readers/detailReader/${id}`);
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

  const totalPages = Math.ceil(filteredreaders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentreaders = filteredreaders.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getSortLabel = () => {
    if (sortField === "name") {
      return `Sort by Name ${sortOrder === "asc" ? "(A-Z)" : "(Z-A)"}`;
    } else if (sortField === "cardType") {
      return `Sort by cardType ${
        sortOrder === "asc" ? "(Low-High)" : "(High-Low)"
      }`;
    }
    return "Sort";
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
          <h1 className="readers-management">Readers Management</h1>

          <div className="controls-readers">
            <input
              type="text"
              placeholder="Search by name, ID, phone, email..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input-readers"
            />

            <div
              className="sort-dropdown-container-readers"
              ref={sortDropdownRef}
            >
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="btn btn-sort-dropdown-readers"
              >
                <span>{getSortLabel()}</span>
                <ChevronDown
                  size={18}
                  className={`dropdown-icon-readers ${
                    sortDropdownOpen ? "open" : ""
                  }`}
                />
              </button>

              {sortDropdownOpen && (
                <div className="sort-dropdown-menu-readers">
                  <button
                    className="btn sort-option-readers"
                    onClick={() => handleSort("name", "asc")}
                  >
                    Name (A-Z)
                  </button>
                  <button
                    className="btn sort-option-readers"
                    onClick={() => handleSort("name", "desc")}
                  >
                    Name (Z-A)
                  </button>
                  <div className="sort-divider-readers"></div>
                  <button
                    className="btn sort-option-readers"
                    onClick={() => handleSort("cardType", "asc")}
                  >
                    Card Type (Low-High)
                  </button>
                  <button
                    className="btn sort-option-readers"
                    onClick={() => handleSort("cardType", "desc")}
                  >
                    Card Type (High-Low)
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleAdd}
              className="btn-action-readers btn-add-readers"
            >
              <Plus size={20} />
              Add Reader
            </button>
          </div>

          <table className="data-table-readers">
            <thead>
              <tr className="table-footer-readers">
                <th colSpan="7" className="footer-info-readers">
                  Total: {filteredreaders.length} / {currentPage * itemsPerPage}
                </th>
              </tr>
              <tr className="table-header-readers">
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Card Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(currentreaders) && currentreaders.length > 0 ? (
                currentreaders.map((reader) => (
                  <tr key={reader.readerId} className="table-row-readers">
                    <td>{reader.readerId}</td>
                    <td>{reader.name}</td>
                    <td>{reader.numberPhone}</td>
                    <td>{reader.email}</td>
                    <td>{reader.address}</td>
                    <td>
                      {reader.cardType === "BRONZE" && (
                        <>
                          BRONZE
                          <i
                            className="fas fa-coins"
                            style={{ color: "#a0a0a0", marginLeft: "5px" }}
                          ></i>
                        </>
                      )}
                      {reader.cardType === "SILVER" && (
                        <>
                          SILVER
                          <i
                            className="fas fa-gem"
                            style={{ color: "#00bfff", marginLeft: "5px" }}
                          ></i>
                        </>
                      )}
                      {reader.cardType === "VIP" && (
                        <>
                          VIP
                          <i
                            className="fas fa-crown"
                            style={{ color: "gold", marginLeft: "5px" }}
                          ></i>
                        </>
                      )}
                    </td>
                    <td className="action-cell-readers">
                      <button
                        title="Edit"
                        onClick={() => handleEdit(reader.readerId)}
                        className="btn btn-edit-readers"
                      >
                        <Edit size={20} className="menu-action-readers-icon" />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(reader.readerId)}
                        className="btn btn-delete-readers"
                      >
                        <Trash2
                          size={20}
                          className="menu-action-readers-icon"
                        />
                      </button>
                      <button
                        title="Detail"
                        onClick={() => handleDetail(reader.readerId)}
                        className="btn btn-detail-readers"
                      >
                        <Eye size={20} className="menu-action-readers-icon" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data-readers">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {filteredreaders.length > 0 && (
            <div className="pagination-readers">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="btn-page-readers"
                title="First page"
              >
                &lt;&lt;
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-page-readers"
                title="Previous page"
              >
                &lt;
              </button>

              <span className="page-info-readers">
                Page {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-page-readers"
                title="Next page"
              >
                &gt;
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="btn-page-readers"
                title="Last page"
              >
                &gt;&gt;
              </button>
            </div>
          )}

          {showDeleteModal && (
            <div className="modal-overlay-readers">
              <div className="modal-content-readers">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this reader?</p>
                <div className="modal-buttons-readers">
                  <button
                    onClick={confirmDelete}
                    className="modal-btn-confirm-readers"
                  >
                    Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="modal-btn-cancel-readers"
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

export default Reader;
