import {
  FaBlog,
  FaChartBar,
  FaHome,
  FaMoon,
  FaPlusSquare,
  FaSignOutAlt,
  FaStar,
  FaSun
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Fixed: Safely parse localStorage data
  const loginData = (() => {
    try {
      return JSON.parse(localStorage.getItem("loginData") || "{}");
    } catch {
      return {};
    }
  })();

  const allUsers = (() => {
    try {
      const data = localStorage.getItem("authData");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  })();

  // Fixed: Check if allUsers is an array before using find
  let userName = "User";
  if (loginData?.email) {
    if (Array.isArray(allUsers)) {
      const currentUser = allUsers.find((user) => user.email === loginData.email);
      userName = currentUser?.username || loginData.email.split("@")[0];
    } else {
      userName = loginData.email.split("@")[0];
    }
  }

  const handleCreatePostClick = (e) => {
    e.preventDefault();
    navigate("/create-post");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate("/dashboard")}>
          <FaBlog className="logo-icon" />
          <span className="logo-text">BlogPost</span>
        </div>

        <div className="navbar-links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "navbar-item active" : "navbar-item"
            }
          >
            <FaHome className="nav-icon" /> Home
          </NavLink>
          <NavLink
            to="/create-post"
            className={({ isActive }) =>
              isActive ? "navbar-item active" : "navbar-item"
            }
            onClick={handleCreatePostClick}
          >
            <FaPlusSquare className="nav-icon" /> Create Post
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              isActive ? "navbar-item active" : "navbar-item"
            }
          >
            <FaChartBar className="nav-icon" /> Analytics
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? "navbar-item active" : "navbar-item"
            }
          >
            <FaStar className="nav-icon" /> Favorites
          </NavLink>
        </div>

        <div className="navbar-actions">
          <span className="user-name">Hi, {userName}</span>

          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>

          <button className="logout-btn" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;