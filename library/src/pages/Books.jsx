import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import "../styles/Books.css";
import axios from "axios";

const Books = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("books");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  // State tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [newBook, setNewBook] = useState({
    bookTitle: "",
    author: "",
    publicationYear: "",
    nxb: "",
    quantity: 0,
    imageUrl: ""
  });

  // Xác định menu đang active
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

  // Lấy danh sách sách
  useEffect(() => {
    axios.get(`/api/books`)
      .then(response => setBooks(response.data))
      .catch(error => console.error(error));
  }, []);

  // Lấy danh sách category
  useEffect(() => {
    axios.get(`/api/categories`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  // Thêm sách mới
  const handleAddBook = () => {
    if (!selectedCategory) {
      alert("Vui lòng chọn thể loại!");
      return;
    }
    if (!newBook.bookTitle || !newBook.author) {
      alert("Tên sách và tác giả không được để trống!");
      return;
    }

    axios.post(`/api/books?categoryId=${selectedCategory}`, newBook)
      .then(response => {
        setBooks([...books, response.data]);
        setShowModal(false);
        setNewBook({ bookTitle: "", author: "", publicationYear: "", nxb: "", quantity: 0, imageUrl: "" });
        setSelectedCategory("");
      })
      .catch(error => console.error(error));
  };

  // Tìm kiếm sách gọi API
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    axios.get(`/api/books/search?title=${term}`)
      .then(response => {
        setSearchResults(response.data.slice(0, 10)); // tối đa 10 kết quả
        setShowDropdown(true);
      })
      .catch(error => console.error(error));
  };

  const handleSelectBook = (book) => {
    setSearchTerm(book.bookTitle);
    setShowDropdown(false);
  };

  // Tính toán số trang
  const totalPages = Math.ceil(books.length / booksPerPage);

  // Lấy sách của trang hiện tại
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  // Chuyển trang
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Tạo array các số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      else if (currentPage >= totalPages - 2) pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      else pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pageNumbers;
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
          <h2 className="mb-3">Quản lý sách</h2>

          <div className="d-flex mb-3" style={{ gap: "10px", position: "relative" }}>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + Thêm sách mới
            </button>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm sách..."
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
            />
            {showDropdown && searchResults.length > 0 && (
              <ul className="dropdown-menu show" style={{ position: "absolute", top: "38px", left: "160px", width: "300px", maxHeight: "300px", overflowY: "auto" }}>
                {searchResults.map(book => (
                  <li key={book.bookId}>
                    <button className="dropdown-item" onClick={() => handleSelectBook(book)}>
                      {book.bookTitle} - {book.author}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th><th>Tên sách</th><th>Tác giả</th><th>Năm XB</th><th>NXB</th><th>Số lượng</th><th>Hình ảnh</th><th>Sửa/Xoá</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.map(book => (
                <tr key={book.bookId}>
                  <td>{book.bookId}</td>
                  <td>{book.bookTitle}</td>
                  <td>{book.author}</td>
                  <td>{book.publicationYear}</td>
                  <td>{book.nxb}</td>
                  <td>{book.quantity}</td>
                  <td><img src={book.imageUrl} alt="" width="50" /></td>
                  <td>
                    <button className="btn btn-warning btn-sm">Sửa</button>
                    <button className="btn btn-danger btn-sm ms-2">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          {totalPages > 1 && (
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={goToPrevPage} disabled={currentPage === 1}>
                    &laquo; Trước
                  </button>
                </li>
                {getPageNumbers().map((pageNum, index) => (
                  pageNum === '...' ? (
                    <li key={`ellipsis-${index}`} className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  ) : (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => goToPage(pageNum)}>{pageNum}</button>
                    </li>
                  )
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Sau &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          )}

          {/* Modal thêm sách */}
          {showModal && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content p-3">
                  <h5>Thêm sách mới</h5>
                  <input className="form-control mb-2" placeholder="Tên sách" value={newBook.bookTitle} onChange={e => setNewBook({...newBook, bookTitle: e.target.value})}/>
                  <input className="form-control mb-2" placeholder="Tác giả" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})}/>
                  <input className="form-control mb-2" placeholder="Năm xuất bản" type="number" value={newBook.publicationYear} onChange={e => setNewBook({...newBook, publicationYear: parseInt(e.target.value)})}/>
                  <input className="form-control mb-2" placeholder="NXB" value={newBook.nxb} onChange={e => setNewBook({...newBook, nxb: e.target.value})}/>
                  <input className="form-control mb-2" placeholder="Số lượng" type="number" value={newBook.quantity} onChange={e => setNewBook({...newBook, quantity: parseInt(e.target.value)})}/>
                  <input className="form-control mb-2" placeholder="URL hình ảnh" value={newBook.imageUrl} onChange={e => setNewBook({...newBook, imageUrl: e.target.value})}/>

                  <select className="form-control mb-2" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                    <option value="">Chọn thể loại</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.typeName}</option>
                    ))}
                  </select>

                  <button className="btn btn-success" onClick={handleAddBook}>Lưu</button>
                  <button className="btn btn-secondary ms-2" onClick={() => setShowModal(false)}>Đóng</button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Books;

// hien thi hinh anh
//goi api xoa 
// goi api sua 
// goi api them sach 
// search 
