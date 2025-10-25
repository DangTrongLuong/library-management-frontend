import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit, Trash2, ChevronDown, Plus } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import "../../styles/Category.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Category.css";

const Category = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("category");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortField, setSortField] = useState("typeName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();
  const sortDropdownRef = useRef(null);

  // 🟩 Cập nhật menu đang chọn
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
    setActiveMenuItem(pathToItem[location.pathname] || "category");
  }, [location.pathname]);

  // 🟩 Lấy danh sách category
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
      setFilteredCategories(res.data);
      setCurrentPage(1);
    } catch (error) {
      toast.error("Failed to load category list!");
      console.error("Error fetching categories:", error);
    }
  };

  // 🟩 Tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = categories.filter(
      (cat) =>
        cat.typeName?.toLowerCase().includes(term) ||
        cat.shelfPosition?.toLowerCase().includes(term) ||
        cat.note?.toLowerCase().includes(term)
    );
    setFilteredCategories(filtered);
    setCurrentPage(1);
  };

  // 🟩 Sắp xếp
  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    setSortDropdownOpen(false);

    const sorted = [...filteredCategories].sort((a, b) => {
      const valA = (a[field] || "").toLowerCase();
      const valB = (b[field] || "").toLowerCase();
      return order === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    setFilteredCategories(sorted);
  };

  // 🟩 CRUD
  const handleAdd = () => navigate("/categorys/createCategory");
  const handleEdit = (id) => navigate(`/categorys/editCategory/${id}`);

  const handleDelete = (id) => {
    setDeleteCategoryId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/categories/${deleteCategoryId}`);
      fetchCategories();
      toast.success("Category deleted successfully!");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Cannot delete category!");
      console.error(error);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  // 🟩 Phân trang
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  const getSortLabel = () =>
    `Sort by ${sortField === "typeName" ? "Name" : sortField} ${
      sortOrder === "asc" ? "(A-Z)" : "(Z-A)"
    }`;

  return (
    <div className="my-project-container">
      <ToastContainer autoClose={3000} />
      <NavBar
        userName="Admin"
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="main-layout">
        <SideBar
          activeItem={activeMenuItem}
          onItemClick={setActiveMenuItem}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="main-content">
          <h2 className="category-management">Category Management</h2>

          <div className="controls-category">
            <input
              type="text"
              placeholder="Search by name, position, or note..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input-category"
            />

            <div
              className="sort-dropdown-container-category"
              ref={sortDropdownRef}
            >
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="btn btn-sort-dropdown-category"
              >
                <span>{getSortLabel()}</span>
                <ChevronDown
                  size={18}
                  className={`dropdown-icon-category ${
                    sortDropdownOpen ? "open" : ""
                  }`}
                />
              </button>

              {sortDropdownOpen && (
                <div className="sort-dropdown-menu-category">
                  <button
                    className="sort-option-category"
                    onClick={() => handleSort("typeName", "asc")}
                  >
                    Name (A-Z)
                  </button>
                  <button
                    className="sort-option-category"
                    onClick={() => handleSort("typeName", "desc")}
                  >
                    Name (Z-A)
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleAdd}
              className="btn-action-category btn-add-category"
            >
              <Plus size={20} />
              Add Category
            </button>
          </div>

          <div className="table-wrapper-category">
            <table className="data-table-category">
              <thead>
                <tr className="table-footer-category">
                  <th colSpan="7" className="footer-info-category">
                    Total: {filteredCategories.length} /{" "}
                    {currentPage * itemsPerPage}
                  </th>
                </tr>
                <tr className="table-header-category">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Shelf Position</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.length > 0 ? (
                  currentCategories.map((cat) => (
                    <tr key={cat.categoryId} className="table-row-category">
                      <td>{cat.categoryId}</td>
                      <td>{cat.typeName}</td>
                      <td>{cat.description || "—"}</td>
                      <td>{cat.shelfPosition || "—"}</td>
                      <td>{cat.note || "—"}</td>
                      <td className="action-cell-category">
                        <button
                          title="Edit"
                          onClick={() => handleEdit(cat.categoryId)}
                          className="btn btn-edit-category"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(cat.categoryId)}
                          className="btn btn-delete-category"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data-category">
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredCategories.length > 0 && (
            <div className="pagination-category">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="btn-page-category"
              >
                &lt;&lt;
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-page-category"
              >
                &lt;
              </button>
              <span className="page-info-category">
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-page-category"
              >
                &gt;
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="btn-page-category"
              >
                &gt;&gt;
              </button>
            </div>
          )}

          {showDeleteModal && (
            <div className="modal-overlay-category">
              <div className="modal-content-category">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this category?</p>
                <div className="modal-buttons-category">
                  <button
                    onClick={confirmDelete}
                    className="modal-btn-confirm-category"
                  >
                    Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="modal-btn-cancel-category"
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

export default Category;
