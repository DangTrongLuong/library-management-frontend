import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/CreateLibrarian.css";

const CreateLibrarian = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("librarians");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    librarianName: "",
    phone: "",
    email: "",
    shiftId: "",
    hourlyWage: "",
    gender: "",
    startDate: "",
    address: "",
    status: "ACTIVE",
    notes: "",
  });
  const navigate = useNavigate();

  const shifts = [
    { shiftId: 1, shiftName: "Morning" },
    { shiftId: 2, shiftName: "Afternoon" },
    { shiftId: 3, shiftName: "Evening" },
    { shiftId: 4, shiftName: "Fulltime" },
  ];

  useEffect(() => {
    const pathToItem = {
      "/dashboard": "home",
      "/books": "books",
      "/readers": "readers",
      "/categorys": "category",
      "/librarians": "librarians",
      "/borrows": "borrows",
      "/penalties": "penalties",
      "/reports": "reports",
    };
    setActiveMenuItem(pathToItem[location.pathname] || "librarians");
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "shiftName") {
      const selectedShift = shifts.find((shift) => shift.shiftName === value);
      setFormData({
        ...formData,
        shiftId: selectedShift ? selectedShift.shiftId : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/librarians/createLibrarian", {
        ...formData,
        hourlyWage: parseFloat(formData.hourlyWage),
      });
      toast.success("Librarian added successfully!");

      setTimeout(() => {
        navigate("/librarians");
      }, 2000);
    } catch (error) {
      console.error("Error adding librarian:", error);
      toast.error(error.response?.data?.message || "Failed to add librarian!");
    }
  };

  const handleCancel = () => {
    navigate("/librarians");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleMenuClick = (itemId) => {
    setActiveMenuItem(itemId);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="my-project-container">
      <ToastContainer autoClose={2000} />
      <NavBar userName="Admin" onToggleSidebar={toggleSidebar} />

      <div className="main-layout">
        <SideBar
          activeItem={activeMenuItem}
          onItemClick={handleMenuClick}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />

        <main className="main-content">
          <div className="form-header-librarian">
            <button
              onClick={handleCancel}
              className="btn-back-librarian"
              title="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="add-librarian-h1">
              Librarian Management/Add New Librarian
            </h1>
          </div>
          <div className="create-librarian-wrapper">
            <div className="form-container-librarian">
              <form onSubmit={handleSubmit} className="form-librarian">
                <div className="form-section-librarian">
                  <h2>Personal Information</h2>

                  <div className="form-group-librarian">
                    <label htmlFor="librarianName">
                      Name <span className="required">*</span>
                    </label>
                    <input
                      id="librarianName"
                      name="librarianName"
                      value={formData.librarianName}
                      onChange={handleChange}
                      placeholder="Enter librarian name"
                      required
                      className="form-input-librarian"
                    />
                  </div>

                  <div className="form-row-librarian">
                    <div className="form-group-librarian">
                      <label htmlFor="phone">
                        Phone <span className="required">*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g., 0912345678"
                        required
                        pattern="^0[0-9]{9,10}$"
                        className="form-input-librarian"
                      />
                    </div>

                    <div className="form-group-librarian">
                      <label htmlFor="email">
                        Email <span className="required">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        required
                        className="form-input-librarian"
                      />
                    </div>
                  </div>

                  <div className="form-row-librarian">
                    <div className="form-group-librarian">
                      <label htmlFor="gender">
                        Gender <span className="required">*</span>
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="form-input-librarian"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group-librarian">
                      <label htmlFor="startDate">
                        Start Date <span className="required">*</span>
                      </label>
                      <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        min={getMinDate()}
                        required
                        className="form-input-librarian"
                      />
                    </div>
                  </div>

                  <div className="form-group-librarian">
                    <label htmlFor="address">
                      Address <span className="required">*</span>
                    </label>
                    <input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Enter address"
                      className="form-input-librarian"
                    />
                  </div>
                </div>

                <div className="form-section-librarian">
                  <h2>Work Information</h2>

                  <div className="form-row-librarian">
                    <div className="form-group-librarian">
                      <label htmlFor="shiftId">
                        Shift <span className="required">*</span>
                      </label>
                      <select
                        id="shiftId"
                        name="shiftName"
                        value={
                          shifts.find(
                            (shift) =>
                              shift.shiftId === parseInt(formData.shiftId)
                          )?.shiftName || ""
                        }
                        onChange={handleChange}
                        required
                        className="form-input-librarian"
                      >
                        <option value="">Select shift</option>
                        {shifts.map((shift) => (
                          <option key={shift.shiftId} value={shift.shiftName}>
                            {shift.shiftName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group-librarian">
                      <label htmlFor="hourlyWage">
                        Hourly Wage (VND) <span className="required">*</span>
                      </label>
                      <input
                        id="hourlyWage"
                        name="hourlyWage"
                        type="number"
                        value={formData.hourlyWage}
                        onChange={handleChange}
                        placeholder="Enter hourly wage"
                        required
                        min="0"
                        className="form-input-librarian"
                      />
                    </div>
                  </div>

                  <div className="form-group-librarian">
                    <label htmlFor="status">
                      Status <span className="required">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="form-input-librarian"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>

                  <div className="form-group-librarian">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Enter additional notes"
                      className="form-textarea-librarian"
                    />
                  </div>
                </div>

                <div className="form-actions-librarian">
                  <button type="submit" className="btn-submit-librarian">
                    Add Librarian
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-cancel-librarian"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateLibrarian;
