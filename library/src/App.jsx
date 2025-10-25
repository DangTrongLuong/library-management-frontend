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
import CreateCategory from "./pages/Category/CreateCategory";
import EditCategory from "./pages/Category/EditCategory";
import Librarian from "./pages/Librarian/Librarian";
import CreateLibrarian from "./pages/Librarian/CreateLibrarian";
import EditLibrarian from "./pages/Librarian/EditLibrarian";
import LibrarianDetail from "./pages/Librarian/DetailLibrarian";
import Borrow from "./pages/Borrow/Borrow";
import CreateBorrow from "./pages/Borrow/CreateBorrow";
import EditBorrow from "./pages/Borrow/EditBorrow";
import DetailBorrow from "./pages/Borrow/DetailBorrow";
import Fine from "./pages/Fine/Fine";
import Report from "./pages/Report";
import LoginPage from "./pages/Login/Login";
import { ProtectedRoute } from "./middlewares/ProtectedRoute";

import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer autoClose={3000} />
      <Router>
        <Routes>
          {/* Public route - không cần login */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected routes - bắt buộc login */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <Books />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/createBook"
            element={
              <ProtectedRoute>
                <CreateBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/editBook/:id"
            element={
              <ProtectedRoute>
                <EditBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/detailBook/:id"
            element={
              <ProtectedRoute>
                <DetailBook />
              </ProtectedRoute>
            }
          />

          <Route
            path="/readers"
            element={
              <ProtectedRoute>
                <Reader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/readers/createReader"
            element={
              <ProtectedRoute>
                <CreateReader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/readers/editReader/:id"
            element={
              <ProtectedRoute>
                <EditReader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/readers/detailReader/:id"
            element={
              <ProtectedRoute>
                <DetailReader />
              </ProtectedRoute>
            }
          />

          <Route
            path="/categorys"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categorys/createCategory"
            element={
              <ProtectedRoute>
                <CreateCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categorys/editCategory/:id"
            element={
              <ProtectedRoute>
                <EditCategory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/librarians"
            element={
              <ProtectedRoute>
                <Librarian />
              </ProtectedRoute>
            }
          />
          <Route
            path="/librarians/createLibrarian"
            element={
              <ProtectedRoute>
                <CreateLibrarian />
              </ProtectedRoute>
            }
          />
          <Route
            path="/librarians/editLibrarian/:id"
            element={
              <ProtectedRoute>
                <EditLibrarian />
              </ProtectedRoute>
            }
          />
          <Route
            path="/librarians/detailLibrarian/:id"
            element={
              <ProtectedRoute>
                <LibrarianDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/borrows"
            element={
              <ProtectedRoute>
                <Borrow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrows/createBorrow"
            element={
              <ProtectedRoute>
                <CreateBorrow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrows/editBorrow/:id"
            element={
              <ProtectedRoute>
                <EditBorrow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrows/detailBorrow/:id"
            element={
              <ProtectedRoute>
                <DetailBorrow />
              </ProtectedRoute>
            }
          />

          <Route
            path="/penalties"
            element={
              <ProtectedRoute>
                <Fine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
