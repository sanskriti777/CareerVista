import "./Topbar.css";
import { FaBell, FaSearch, FaBars } from "react-icons/fa";

function Topbar({ onToggleSidebar }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        {onToggleSidebar && (
          <button className="mobile-menu-btn" onClick={onToggleSidebar} aria-label="Open menu">
            <FaBars />
          </button>
        )}
        <div>
          <h2>Welcome Back 👋</h2>
          <p>Let's explore today's opportunities.</p>
        </div>
      </div>

      <div className="topbar-right">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search jobs..." />
        </div>

        <button className="notification-btn" aria-label="Notifications">
          <FaBell />
        </button>

        <div className="profile">
          <div className="avatar">S</div>

          <div>
            <h4>Sanskriti</h4>
            <span>Student</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;