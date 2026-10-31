import "./Topbar.css";
import { useState } from "react";
import { FaBell, FaSearch, FaBars, FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

function Topbar({ onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const displayName = user?.name ? user.name.trim() : "User";

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="topbar">
      <div className="topbar-left">
        {onToggleSidebar && (
          <button className="mobile-menu-btn" onClick={onToggleSidebar} aria-label="Open menu">
            <FaBars />
          </button>
        )}
        <div>
          <h2>Welcome back, {displayName} 👋</h2>
          <p>Explore today's top tech opportunities • <strong>{todayDate}</strong></p>
        </div>
      </div>

      <div className="topbar-right">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search jobs, skills, companies..." />
          <span className="kbd-shortcut">Ctrl K</span>
        </div>

        <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
          {theme === "dark" ? <FaSun style={{ color: "#fbbf24" }} /> : <FaMoon />}
        </button>

        <div style={{ position: "relative" }}>
          <button
            className="notification-btn"
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
          </button>

          {showNotifications && <NotificationDropdown />}
        </div>
      </div>
    </header>
  );
}

export default Topbar;