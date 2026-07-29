import "./Sidebar.css";
import logo from "../../assets/logo.png";
import {
  FaHome,
  FaBriefcase,
  FaBookmark,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo-section">
        <img src={logo} alt="CareerVista" />
        <h2>CareerVista</h2>
      </div>

      <nav>

        <a href="#">
          <FaHome />
          Dashboard
        </a>

        <a href="#">
          <FaBriefcase />
          Jobs
        </a>

        <a href="#">
          <FaBookmark />
          Saved Jobs
        </a>

        <a href="#">
          <FaChartBar />
          Analytics
        </a>

        <a href="#">
          <FaUser />
          Profile
        </a>

      </nav>

      <button className="logout-btn">
        <FaSignOutAlt />
        Logout
      </button>

    </aside>
  );
}

export default Sidebar;