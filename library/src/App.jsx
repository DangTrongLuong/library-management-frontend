import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Reader from "./pages/Reader";
import Category from "./pages/Category";
import Librarian from "./pages/Librarian/Librarian";
import CreateLibrarian from "./pages/Librarian/CreateLibrarian";
import EditLibrarian from "./pages/Librarian/EditLibrarian";
import Borrow from "./pages/Borrow";
import Fine from "./pages/Fine";
import Report from "./pages/Report";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/readers" element={<Reader />} />
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
        <Route path="/borrows" element={<Borrow />} />
        <Route path="/penalties" element={<Fine />} />
        <Route path="/reports" element={<Report />} />
      </Routes>
    </Router>
  );
  
function App() {
  return (
    <div>
      <BookList />
    </div>
  );
}

};

export default App;
