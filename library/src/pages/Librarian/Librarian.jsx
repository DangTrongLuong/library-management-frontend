import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit, Trash2, Eye, ChevronDown, Plus } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import "../../styles/Librarian.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Librarian = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("librarians");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [librarians, setLibrarians] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLibrarians, setFilteredLibrarians] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLibrarianId, setDeleteLibrarianId] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const sortDropdownRef = useRef(null);

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
    setActiveMenuItem(pathToItem[location.pathname] || "librarians");
  }, [location.pathname]);

  useEffect(() => {
    fetchLibrarians();
  }, []);

  const fetchLibrarians = async () => {
    try {
      const response = await axios.get("/api/librarians/getAllLibrarian");
      setLibrarians(response.data);
      setFilteredLibrarians(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching librarians:", error);
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
    const filtered = librarians.filter(
      (lib) =>
        lib.librarianId.toLowerCase().includes(term) ||
        lib.librarianName.toLowerCase().includes(term) ||
        lib.phone.includes(term) ||
        lib.email.toLowerCase().includes(term)
    );
    setFilteredLibrarians(filtered);
    setCurrentPage(1);
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    setSortDropdownOpen(false);

    const sorted = [...filteredLibrarians].sort((a, b) => {
      let valueA, valueB;

      if (field === "name") {
        valueA = a.librarianName.toLowerCase();
        valueB = b.librarianName.toLowerCase();
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (field === "salary") {
        valueA = parseFloat(a.totalSalary) || 0;
        valueB = parseFloat(b.totalSalary) || 0;
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }
    });

    setFilteredLibrarians(sorted);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    navigate("/librarians/createLibrarian");
  };

  const handleEdit = (id) => {
    navigate(`/librarians/editLibrarian/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteLibrarianId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `/api/librarians/deleteLibrarian/${deleteLibrarianId}`
      );
      fetchLibrarians();
      setShowDeleteModal(false);
      setDeleteLibrarianId(null);
      toast.success("Librarian deleted successfully!");
    } catch (error) {
      console.error("Error deleting librarian:", error);
      toast.error("Cannot delete librarian!");
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteLibrarianId(null);
  };

  const handleDetail = (id) => {
    navigate(`/librarians/detailLibrarian/${id}`);
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

  const totalPages = Math.ceil(filteredLibrarians.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLibrarians = filteredLibrarians.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getSortLabel = () => {
    if (sortField === "name") {
      return `Sort by Name ${sortOrder === "asc" ? "(A-Z)" : "(Z-A)"}`;
    } else if (sortField === "salary") {
      return `Sort by Salary ${
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
          <h1 className="libraian-management">Librarian Management</h1>

          <div className="controls-librarian">
            <input
              type="text"
              placeholder="Search by name, ID, phone, email..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input-librarian"
            />

            <div
              className="sort-dropdown-container-librarian"
              ref={sortDropdownRef}
            >
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="btn btn-sort-dropdown-librarian"
              >
                <span>{getSortLabel()}</span>
                <ChevronDown
                  size={18}
                  className={`dropdown-icon-librarian ${
                    sortDropdownOpen ? "open" : ""
                  }`}
                />
              </button>

              {sortDropdownOpen && (
                <div className="sort-dropdown-menu-librarian">
                  <button
                    className="btn sort-option-librarian"
                    onClick={() => handleSort("name", "asc")}
                  >
                    Name (A-Z)
                  </button>
                  <button
                    className="btn sort-option-librarian"
                    onClick={() => handleSort("name", "desc")}
                  >
                    Name (Z-A)
                  </button>
                  <div className="sort-divider-librarian"></div>
                  <button
                    className="btn sort-option-librarian"
                    onClick={() => handleSort("salary", "asc")}
                  >
                    Salary (Low-High)
                  </button>
                  <button
                    className="btn sort-option-librarian"
                    onClick={() => handleSort("salary", "desc")}
                  >
                    Salary (High-Low)
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleAdd}
              className="btn-action-librarian btn-add-librarian"
            >
              <Plus size={20} />
              Add Librarian
            </button>
          </div>

          <table className="data-table-librarian">
            <thead>
              <tr className="table-footer-librarian">
                <th colSpan="7" className="footer-info-librarian">
                  Total: {filteredLibrarians.length} /{" "}
                  {currentPage * itemsPerPage}
                </th>
              </tr>
              <tr className="table-header-librarian">
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Shift</th>
                <th>Salary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(currentLibrarians) &&
              currentLibrarians.length > 0 ? (
                currentLibrarians.map((lib) => (
                  <tr key={lib.librarianId} className="table-row-librarian">
                    <td>{lib.librarianId}</td>
                    <td>{lib.librarianName}</td>
                    <td>{lib.phone}</td>
                    <td>{lib.email}</td>
                    <td>
                      {lib.shiftName} ({lib.timeShift})
                    </td>
                    <td>{lib.totalSalary.toLocaleString()} VND</td>
                    <td className="action-cell-librarian">
                      <button
                        title="Edit"
                        onClick={() => handleEdit(lib.librarianId)}
                        className="btn btn-edit-librarian"
                      >
                        <Edit
                          size={20}
                          className="menu-action-librarian-icon"
                        />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(lib.librarianId)}
                        className="btn btn-delete-librarian"
                      >
                        <Trash2
                          size={20}
                          className="menu-action-librarian-icon"
                        />
                      </button>
                      <button
                        title="Detail"
                        onClick={() => handleDetail(lib.librarianId)}
                        className="btn btn-detail-librarian"
                      >
                        <Eye size={20} className="menu-action-librarian-icon" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data-librarian">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {filteredLibrarians.length > 0 && (
            <div className="pagination-librarian">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="btn-page-librarian"
                title="First page"
              >
                &lt;&lt;
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-page-librarian"
                title="Previous page"
              >
                &lt;
              </button>

              <span className="page-info-librarian">
                Page {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-page-librarian"
                title="Next page"
              >
                &gt;
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="btn-page-librarian"
                title="Last page"
              >
                &gt;&gt;
              </button>
            </div>
          )}

          {showDeleteModal && (
            <div className="modal-overlay-librarian">
              <div className="modal-content-librarian">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this librarian?</p>
                <div className="modal-buttons-librarian">
                  <button
                    onClick={confirmDelete}
                    className="modal-btn-confirm-librarian"
                  >
                    Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="modal-btn-cancel-librarian"
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

export default Librarian;
