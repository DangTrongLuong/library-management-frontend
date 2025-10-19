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
    const maxPagesToShow = 5; // Hiển thị tối đa 5 nút trang

    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang <= 5, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Nếu nhiều hơn 5 trang, hiển thị thông minh
      if (currentPage <= 3) {
        // Đang ở đầu
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Đang ở cuối
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Đang ở giữa
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
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
          <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
            + Thêm sách mới
          </button>

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
                {/* Nút Previous */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={goToPrevPage} disabled={currentPage === 1}>
                    &laquo; Trước
                  </button>
                </li>

                {/* Các nút số trang */}
                {getPageNumbers().map((pageNum, index) => (
                  pageNum === '...' ? (
                    <li key={`ellipsis-${index}`} className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  ) : (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => goToPage(pageNum)}>
                        {pageNum}
                      </button>
                    </li>
                  )
                ))}

                {/* Nút Next */}
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
            <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <div className="modal-dialog">
                <div className="modal-content p-3">
                  <h5>Thêm sách mới</h5>
                  <input className="form-control mb-2" placeholder="Tên sách" value={newBook.bookTitle} onChange={e => setNewBook({...newBook, bookTitle: e.target.value})}/>
                  <input className="form-control mb-2" placeholder="Tác giả" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})}/>
                  <input className="form-control mb-2" placeholder="Năm xuất bản" type="number" value={newBook.publicationYear} onChange={e => setNewBook({...newBook, publicationYear: parseInt(e.target.value)})}/>
                  <input className="form-control mb-2" placeholder="NXB" value={newBook.nxb} onChange={e => setNewBook({...newBook, nxb: e.target.value})}/>
                  <input className="form-control mb-2" placeholder="Số lượng" type="number" value={newBook.quantity} onChange={e => setNewBook({...newBook, quantity: parseInt(e.target.value)})}/>
                  <input className="form-control mb-2" placeholder="URL hình ảnh" value={newBook.imageUrl} onChange={e => setNewBook({...newBook, imageUrl: e.target.value})}/>

                  {/* Dropdown chọn thể loại */}
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
//mien thi hinh anh
//goi api xoa 
// goi api sua 
// goi api them sach 
// search 
// phan trang danh sach sach