import React, { useState } from "react";
import { addCategory, updateCategory } from "../services/categoryService";

export default function CategoryForm({ editCategory }) {
  const [formData, setFormData] = useState({
    categoryName: editCategory?.categoryName || "",
    description: editCategory?.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editCategory) {
      await updateCategory(editCategory.categoryId, formData);
      alert("Cập nhật thể loại thành công!");
    } else {
      await addCategory(formData);
      alert("Thêm thể loại mới thành công!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Category Name *</label>
        <input
          type="text"
          name="categoryName"
          value={formData.categoryName}
          onChange={handleChange}
          placeholder="Enter category name"
          required
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter category description"
        />
      </div>

      <button type="submit">{editCategory ? "Update" : "Add Category"}</button>
    </form>
  );
}
