import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({ title: "", author: "", category: "", quantity: 0 });

  useEffect(() => {
    fetch(`http://localhost:8081/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => setBook({ ...book, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8081/api/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    })
      .then(() => {
        alert("Cập nhật thành công!");
        navigate("/books");
      })
      .catch(() => alert("Có lỗi xảy ra!"));
  };

  const handleCancel = () => navigate("/books");

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <h2>Sửa thông tin sách</h2>
      <form onSubmit={handleSubmit}>
        <label>Tên sách:</label>
        <input name="title" value={book.title} onChange={handleChange} required />

        <label>Tác giả:</label>
        <input name="author" value={book.author} onChange={handleChange} required />

        <label>Thể loại:</label>
        <input name="category" value={book.category} onChange={handleChange} />

        <label>Số lượng:</label>
        <input type="number" name="quantity" value={book.quantity} onChange={handleChange} />

        <div style={{ marginTop: "15px" }}>
          <button type="submit" style={{ marginRight: "10px" }}>💾 Lưu</button>
          <button type="button" onClick={handleCancel} style={{ marginRight: "10px" }}>❌ Hủy</button>
          <button type="button" onClick={() => navigate("/books")}>⬅ Quay lại</button>
        </div>
      </form>
    </div>
  );
};

export default EditBook;
``