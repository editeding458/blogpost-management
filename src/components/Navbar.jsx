import { FaBlog, FaHome, FaPlusSquare, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  
  // Get current logged in user from loginData instead
  const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
  
  // Get all users from authData
  const allUsers = JSON.parse(localStorage.getItem("authData") || "[]");
  
  // Find the current logged in user by email
  const currentUser = allUsers.find(user => user.email === loginData.email);
  const userName = currentUser?.username || "User";

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
        </div>

        <div className="navbar-actions">
          <span className="user-name">Hi, {userName}</span>
          <button className="logout-btn" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;