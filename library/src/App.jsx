import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books/Books";
import CreateBook from "./pages/Books/CreateBook";
import EditBook from "./pages/Books/EditBook";
import DetailBook from "./pages/Books/BookDetail";
import Reader from "./pages/Readers/Reader";
import CreateReader from "./pages/Readers/CreateReader";
import EditReader from "./pages/Readers/EditReader";
import DetailReader from "./pages/Readers/DetailReader";
import Category from "./pages/Category/Category";
import Librarian from "./pages/Librarian/Librarian";
import CreateLibrarian from "./pages/Librarian/CreateLibrarian";
import EditLibrarian from "./pages/Librarian/EditLibrarian";
import LibrarianDetail from "./pages/Librarian/DetailLibrarian";
import Borrow from "./pages/Borrow";
import Fine from "./pages/Fine";
import Report from "./pages/Report";

import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/createBook" element={<CreateBook />} />
        <Route path="/books/editBook/:id" element={<EditBook />} />
        <Route path="/books/detailBook/:id" element={<DetailBook />} />
        <Route path="/readers" element={<Reader />} />
        <Route path="/readers/createReader" element={<CreateReader />} />
        <Route path="/readers/editReader/:id" element={<EditReader />} />
        <Route path="/readers/detailReader/:id" element={<DetailReader />} />

        <Route path="/categorys" element={<Category />} />
        <Route path="/librarians" element={<Librarian />} />
        <Route
          path="/librarians/createLibrarian"
          element={<CreateLibrarian />}
        />
        <Route
          path="/librarians/editLibrarian/:id"
          element={<EditLibrarian />}
        />
        <Route
          path="/librarians/detailLibrarian/:id"
          element={<LibrarianDetail />}
        />
        <Route path="/borrows" element={<Borrow />} />
        <Route path="/penalties" element={<Fine />} />
        <Route path="/reports" element={<Report />} />
      </Routes>
    </Router>
  );
};
export default App;
