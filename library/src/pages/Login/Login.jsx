import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import "../../styles/LoginPage.css";
import library_background from "../../assets/library-background.jpg";
import logo from "../../assets/logocmc.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!username.trim() || !password.trim()) {
      toast.error("Please enter username and password!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data));

        // Show toast và redirect sau khi toast render xong
        toast.success("Login successfully!", {
          autoClose: 1000,
          onClose: () => {
            window.location.href = "/dashboard";
          },
        });
      } else {
        toast.error("Login failed!");
      }
    } catch (error) {
      toast.error("Connection error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputFocus = () => {
    setErrorMsg("");
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="login-wrapper">
        <div
          className="login-background-section"
          style={{ backgroundImage: `url(${library_background})` }}
        ></div>

        <div className="login-form-section">
          <div className="login-form-container">
            <div className="login-icon">
              <img src={logo} className="logocmc-login" />
            </div>

            <h1 className="login-form-title">LOGIN</h1>
            <p className="login-form-subtitle">Library Management System</p>

            <div className="login-form">
              <div className="login-form-group">
                <label className="login-form-label">UserName</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={handleInputFocus}
                  className="login-form-input"
                  placeholder="Nhập username"
                />
              </div>

              <div className="login-form-group">
                <label className="login-form-label">PassWord</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={handleInputFocus}
                  className="login-form-input"
                  placeholder="Nhập mật khẩu"
                />
              </div>

              {successMsg && (
                <div className="login-success-message">{successMsg}</div>
              )}

              {errorMsg && (
                <div className="login-error-message">{errorMsg}</div>
              )}

              <button
                onClick={handleSubmit}
                className="login-form-button"
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </button>
            </div>

            <div className="login-form-footer">
              Quên mật khẩu? <a href="#support">Liên hệ quản trị viên</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
