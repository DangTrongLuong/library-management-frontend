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

    // Xóa sách
const handleDeleteBook = async (book) => {
  if (window.confirm(`Bạn có chắc chắn muốn xóa sách "${book.bookTitle}"?`)) {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL; // ví dụ: http://localhost:8080
      const response = await fetch(`${baseUrl}/api/books/${book.bookId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Xóa sách thất bại");
      }

      alert("Xóa sách thành công!");
      // Cập nhật lại danh sách sách
      setBooks((prevBooks) => prevBooks.filter((b) => b.bookId !== book.bookId));
    } catch (error) {
      console.error("Đã xảy ra lỗi khi xóa sách:", error);
      alert("Không thể xóa sách!");
    }
  }
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
                <th>ID</th><th>Tên sách</th><th>Tác giả</th><th>Năm XB</th><th>NXB</th><th>Số lượng</th><th>Hình ảnh</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
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
                    
                    <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDeleteBook(book.bookId)}> Xóa
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal thêm sách */}
          {showModal && (
            <div className="modal show d-block">
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

                  <button className="btn btn-success" onClickonClick={handleAddBook}>Lưu</button>
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