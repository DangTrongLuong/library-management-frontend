import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit, Trash2, Eye, ChevronDown, Plus } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Category.css";

const Category = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("category");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortField, setSortField] = useState("categoryName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
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
    setActiveMenuItem(pathToItem[location.pathname] || "home");
  }, [location.pathname]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
      setFilteredCategories(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load category list!");
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

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredCategories(categories);
    } else {
      try {
        const response = await axios.get(
          `/api/categorys/search?keyword=${term}`
        );
        setFilteredCategories(response.data);
      } catch (error) {
        console.error("Error searching categories:", error);
        toast.error("Search failed!");
      }
    }
    setCurrentPage(1);
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    setSortDropdownOpen(false);

    const sorted = [...filteredCategories].sort((a, b) => {
      const valueA = a[field]?.toLowerCase() || "";
      const valueB = b[field]?.toLowerCase() || "";
      return order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    setFilteredCategories(sorted);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    navigate("/categorys/createCategory");
  };

  const handleEdit = (id) => {
    navigate(`/categorys/updateCategory/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteCategoryId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/categories/${deleteCategoryId}`);
      fetchCategories();
      setShowDeleteModal(false);
      setDeleteCategoryId(null);
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Cannot delete category!");
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteCategoryId(null);
  };

  const handleDetail = (id) => {
    navigate(`/categorys/detailCategory/${id}`);
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

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getSortLabel = () => {
    if (sortField === "categoryName") {
      return `Sort by Name ${sortOrder === "asc" ? "(A-Z)" : "(Z-A)"}`;
    } else if (sortField === "shelfPosition") {
      return `Sort by Shelf ${sortOrder === "asc" ? "(A-Z)" : "(Z-A)"}`;
    }
    return "Sort";
  };

  return (
    <div className="my-project-container">
      <ToastContainer autoClose={2000} />
      <NavBar userName="Admin" onToggleSidebar={toggleSidebar} />

      <div className="main-layout">
        <SideBar
          activeItem={activeMenuItem}
          onItemClick={handleMenuClick}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />

        <main className="main-content">
          <h1 className="category-management">Category Management</h1>

          <div className="category-controls">
            <input
              type="text"
              placeholder="Search by name, shelf position, note..."
              value={searchTerm}
              onChange={handleSearch}
              className="category-search-input"
            />

            <div
              className="category-sort-dropdown-container"
              ref={sortDropdownRef}
            >
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="category-btn category-sort-dropdown"
              >
                <span>{getSortLabel()}</span>
                <ChevronDown
                  size={18}
                  className={`category-dropdown-icon ${
                    sortDropdownOpen ? "open" : ""
                  }`}
                />
              </button>

              {sortDropdownOpen && (
                <div className="category-sort-dropdown-menu">
                  <button
                    className="category-btn category-sort-option"
                    onClick={() => handleSort("categoryName", "asc")}
                  >
                    Name (A-Z)
                  </button>
                  <button
                    className="category-btn category-sort-option"
                    onClick={() => handleSort("categoryName", "desc")}
                  >
                    Name (Z-A)
                  </button>
                  <div className="category-sort-divider"></div>
                  <button
                    className="category-btn category-sort-option"
                    onClick={() => handleSort("shelfPosition", "asc")}
                  >
                    Shelf (A-Z)
                  </button>
                  <button
                    className="category-btn category-sort-option"
                    onClick={() => handleSort("shelfPosition", "desc")}
                  >
                    Shelf (Z-A)
                  </button>
                </div>
              )}
            </div>

            <button onClick={handleAdd} className="category-btn-add">
              <Plus size={20} />
              Add Category
            </button>
          </div>

          <div className="category-summary">
            <span>
              Total: {currentCategories.length} / {filteredCategories.length}
            </span>
          </div>

          <div className="category-grid">
            {Array.isArray(currentCategories) &&
            currentCategories.length > 0 ? (
              currentCategories.map((cat) => (
                <div key={cat.categoryId} className="category-card">
                  <div className="category-card-content">
                    <h3 className="category-card-title">{cat.categoryName}</h3>
                    <p className="category-card-info">
                      <strong>Description:</strong> {cat.description || "N/A"}
                    </p>
                    <p className="category-card-info">
                      <strong>Shelf:</strong> {cat.shelfPosition || "N/A"}
                    </p>
                    <p className="category-card-info">
                      <strong>Note:</strong> {cat.note || "N/A"}
                    </p>
                  </div>

                  <div className="category-card-actions">
                    <button
                      title="Edit"
                      onClick={() => handleEdit(cat.categoryId)}
                      className="category-btn category-btn-edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDelete(cat.categoryId)}
                      className="category-btn category-btn-delete"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      title="Detail"
                      onClick={() => handleDetail(cat.categoryId)}
                      className="category-btn category-btn-detail"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="category-no-data">No categories found</div>
            )}
          </div>

          {filteredCategories.length > 0 && (
            <div className="category-pagination">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="category-btn-page"
              >
                &lt;&lt;
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="category-btn-page"
              >
                &lt;
              </button>

              <span className="category-page-info">
                Page {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="category-btn-page"
              >
                &gt;
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="category-btn-page"
              >
                &gt;&gt;
              </button>
            </div>
          )}

          {showDeleteModal && (
            <div className="category-modal-overlay">
              <div className="category-modal-content">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this category?</p>
                <div className="category-modal-buttons">
                  <button
                    onClick={confirmDelete}
                    className="category-modal-btn-confirm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="category-modal-btn-cancel"
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
