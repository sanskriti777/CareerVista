import "./Sidebar.css";
import logo from "../../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaBookmark,
  FaPaperPlane,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    { path: "/jobs", label: "Jobs", icon: <FaBriefcase /> },
    { path: "/saved-jobs", label: "Saved Jobs", icon: <FaBookmark /> },
    { path: "/applications", label: "Applications", icon: <FaPaperPlane /> },
    { path: "/analytics", label: "Analytics", icon: <FaChartBar /> },
    { path: "/profile", label: "Profile", icon: <FaUser /> },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    if (onClose) onClose();
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Overlay Backdrop for Mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="logo-section">
            <img src={logo} alt="CareerVista" />
            <h2>CareerVista</h2>
          </div>
          {onClose && (
            <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
              <FaTimes />
            </button>
          )}
        </div>

        <nav>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? "active" : ""}
              onClick={onClose}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>
    </>
  );
}

export default Sidebar;