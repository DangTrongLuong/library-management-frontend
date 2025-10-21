import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
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
  const [editBook, setEditBook] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  const [searchTerm, setSearchTerm] = useState("");

  const [newBook, setNewBook] = useState({
    bookTitle: "",
    author: "",
    publicationYear: "",
    nxb: "",
    quantity: 0,
    image: null,
    imageUrl: "",
  });

  // Active menu
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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Load data
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Delete book
  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sách này không?")) return;

    axios
      .delete(`http://localhost:8080/api/books/${id}`)
      .then(() => {
        setBooks((prev) => prev.filter((book) => book.bookId !== id));
        alert("Đã xoá sách thành công!");
      })
      .catch((err) => {
        console.error(err);
        alert("Xóa thất bại.");
      });
  };

  // Open add modal
  const handleAddClick = () => {
    setEditBook(null);
    setNewBook({
      bookTitle: "",
      author: "",
      publicationYear: "",
      nxb: "",
      quantity: 0,
      image: null,
      imageUrl: "",
    });
    setSelectedCategory("");
    setShowModal(true);
  };

  // Add new book
  const handleAddBook = async () => {
    try {
      if (!newBook.bookTitle || !newBook.author || !selectedCategory) {
        alert("Vui lòng nhập đầy đủ thông tin sách!");
        return;
      }

      const formData = new FormData();
      formData.append("bookTitle", newBook.bookTitle);
      formData.append("author", newBook.author);
      formData.append("publicationYear", newBook.publicationYear);
      formData.append("nxb", newBook.nxb);
      formData.append("quantity", newBook.quantity);
      formData.append("categoryId", selectedCategory);
      if (newBook.image instanceof File) {
        formData.append("image", newBook.image);
      }

      const res = await axios.post(
        "http://localhost:8080/api/books",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setBooks((prev) => [...prev, res.data]);
      alert("Thêm sách thành công!");
      setShowModal(false);
    } catch (error) {
      console.error("❌ Lỗi khi thêm sách:", error.response || error);
      alert("Thêm sách thất bại!");
    }
  };

  // Edit book
  const handleEdit = (book) => {
    setEditBook({ ...book });
    setSelectedCategory(book.categoryId || "");
    setShowModal(true);
  };

  // Update book
  const handleUpdateBook = async () => {
    try {
      if (!editBook.bookTitle || !editBook.author) {
        alert("Tên sách và tác giả không được để trống!");
        return;
      }

      const formData = new FormData();
      formData.append("bookTitle", editBook.bookTitle);
      formData.append("author", editBook.author);
      formData.append("publicationYear", editBook.publicationYear);
      formData.append("nxb", editBook.nxb);
      formData.append("quantity", editBook.quantity);
      formData.append("categoryId", selectedCategory);

      if (editBook.image instanceof File) {
        formData.append("image", editBook.image);
      }

      const response = await axios.put(
        `http://localhost:8080/api/books/${editBook.bookId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setBooks((prev) =>
        prev.map((b) => (b.bookId === editBook.bookId ? response.data : b))
      );

      alert("Cập nhật sách thành công!");
      setShowModal(false);
      setEditBook(null);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật sách:", error.response || error);
      alert("Cập nhật thất bại!");
    }
  };

  // Modal
  const renderModal = () => (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5>{editBook ? "Sửa thông tin sách" : "Thêm sách mới"}</h5>

          <input
            className="form-control mb-2"
            placeholder="Tên sách"
            value={editBook ? editBook.bookTitle : newBook.bookTitle}
            onChange={(e) =>
              editBook
                ? setEditBook({ ...editBook, bookTitle: e.target.value })
                : setNewBook({ ...newBook, bookTitle: e.target.value })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Tác giả"
            value={editBook ? editBook.author : newBook.author}
            onChange={(e) =>
              editBook
                ? setEditBook({ ...editBook, author: e.target.value })
                : setNewBook({ ...newBook, author: e.target.value })
            }
          />

          <input
            className="form-control mb-2"
            type="number"
            placeholder="Năm xuất bản"
            value={
              editBook ? editBook.publicationYear : newBook.publicationYear
            }
            onChange={(e) =>
              editBook
                ? setEditBook({ ...editBook, publicationYear: e.target.value })
                : setNewBook({ ...newBook, publicationYear: e.target.value })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="NXB"
            value={editBook ? editBook.nxb : newBook.nxb}
            onChange={(e) =>
              editBook
                ? setEditBook({ ...editBook, nxb: e.target.value })
                : setNewBook({ ...newBook, nxb: e.target.value })
            }
          />

          <input
            className="form-control mb-2"
            type="number"
            placeholder="Số lượng"
            value={editBook ? editBook.quantity : newBook.quantity}
            onChange={(e) =>
              editBook
                ? setEditBook({ ...editBook, quantity: e.target.value })
                : setNewBook({ ...newBook, quantity: e.target.value })
            }
          />

          {/* ✅ Input file + Preview ảnh */}
          <div className="mb-2">
            <label className="form-label">Chọn ảnh</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (editBook) {
                  setEditBook({
                    ...editBook,
                    image: file,
                    imageUrl: URL.createObjectURL(file),
                  });
                } else {
                  setNewBook({
                    ...newBook,
                    image: file,
                    imageUrl: URL.createObjectURL(file),
                  });
                }
              }}
            />
            {(editBook?.imageUrl || newBook?.imageUrl) && (
              <img
                src={editBook ? editBook.imageUrl : newBook.imageUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "6px",
                  marginTop: "10px",
                }}
              />
            )}
          </div>

          <select
            className="form-control mb-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Chọn thể loại</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.typeName}
              </option>
            ))}
          </select>

          <div className="d-flex">
            <button
              className="btn btn-success w-100 me-2"
              onClick={editBook ? handleUpdateBook : handleAddBook}
            >
              {editBook ? "Lưu" : "Thêm"}
            </button>
            <button
              className="btn btn-secondary w-100"
              onClick={() => setShowModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Pagination
  const totalPages = Math.ceil(books.length / booksPerPage);
  const indexOfLast = currentPage * booksPerPage;
  const indexOfFirst = indexOfLast - booksPerPage;
  const currentBooks = books.slice(indexOfFirst, indexOfLast);

  return (
    <div className="my-project-container">
      <NavBar userName="Admin" onToggleSidebar={toggleSidebar} />
      <div className="main-layout">
        <SideBar
          activeItem={activeMenuItem}
          onItemClick={setActiveMenuItem}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />
        <main className="main-content">
          <h2 className="mb-3">Quản lý sách</h2>

          <div className="d-flex mb-3" style={{ gap: "10px" }}>
            <button className="btn btn-primary" onClick={handleAddClick}>
              + Thêm sách mới
            </button>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm sách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Năm XB</th>
                <th>NXB</th>
                <th>Thể loại</th>
                <th>Số lượng</th>
                <th>Hình ảnh</th>
                <th>Sửa/Xoá</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.map((book) => (
                <tr key={book.bookId}>
                  <td>{book.bookId}</td>
                  <td>{book.bookTitle}</td>
                  <td>{book.author}</td>
                  <td>{book.publicationYear}</td>
                  <td>{book.nxb}</td>
                  <td>{book.categoryName}</td>
                  <td>{book.quantity}</td>
                  <td>
                    <img src={book.imageUrl} alt="" width="50" />
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(book)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDelete(book.bookId)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showModal && renderModal()}
        </main>
      </div>
    </div>
  );
};

export default Books;
