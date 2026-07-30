import "./Topbar.css";
import { FaBell, FaSearch } from "react-icons/fa";

function Topbar() {
  return (
    <header className="topbar">
      <div>
        <h2>Welcome Back 👋</h2>
        <p>Let's explore today's opportunities.</p>
      </div>

      <div className="topbar-right">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search jobs..." />
        </div>

        <button className="notification-btn">
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