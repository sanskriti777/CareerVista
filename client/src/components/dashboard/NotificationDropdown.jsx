import "./NotificationDropdown.css";
import { FaBriefcase, FaUserCheck, FaBell } from "react-icons/fa";

function NotificationDropdown() {
  const notifications = [
    {
      id: 1,
      icon: <FaBriefcase />,
      text: "Google posted a new Frontend Developer position matching your profile.",
      time: "10m ago",
    },
    {
      id: 2,
      icon: <FaUserCheck />,
      text: "Microsoft viewed your job application for React Intern.",
      time: "2h ago",
    },
    {
      id: 3,
      icon: <FaBell />,
      text: "Your AI Resume Match score for Amazon Node.js role is 94%.",
      time: "1d ago",
    },
  ];

  return (
    <div className="notification-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="notification-header">
        <h3>Notifications</h3>
        <span>3 New</span>
      </div>

      <div className="notification-list">
        {notifications.map((item) => (
          <div key={item.id} className="notification-item">
            <div className="notification-icon">{item.icon}</div>
            <div className="notification-content">
              <p>{item.text}</p>
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationDropdown;
