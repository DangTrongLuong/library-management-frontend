import React, { useState } from 'react';
import { addBook, updateBook } from '../services/bookService';

export default function BookForm({ editBook }) {
  const [formData, setFormData] = useState({
    bookTitle: editBook?.bookTitle || '',
    author: editBook?.author || '',
    publicationYear: editBook?.publicationYear || '',
    nxb: editBook?.nxb || '',
    quantity: editBook?.quantity || '',
    categoryId: editBook?.categoryId || '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    if (editBook) {
      updateBook(editBook.bookId, data).then(() => alert('Cập nhật thành công'));
    } else {
      addBook(data).then(() => alert('Thêm thành công'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="bookTitle" value={formData.bookTitle} onChange={handleChange} placeholder="Tên sách" />
      <input name="author" value={formData.author} onChange={handleChange} placeholder="Tác giả" />
      <input name="publicationYear" value={formData.publicationYear} onChange={handleChange} placeholder="Năm XB" />
      <input name="nxb" value={formData.nxb} onChange={handleChange} placeholder="NXB" />
      <input name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Số lượng" />
      <input name="categoryId" value={formData.categoryId} onChange={handleChange} placeholder="ID thể loại" />
      <input type="file" onChange={handleFileChange} />
      <button type="submit">{editBook ? 'Cập nhật' : 'Thêm'}</button>
    </form>
  );
}