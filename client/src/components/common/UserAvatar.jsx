import "./UserAvatar.css";
import { useState } from "react";
import API_BASE_URL from "../../config/api";

/**
 * Reusable UserAvatar component
 *
 * @param {Object} props
 * @param {Object} [props.user] - User object with name and optional profilePicture
 * @param {number} [props.size=44] - Diameter in pixels
 * @param {string} [props.className=""] - Additional CSS class name
 * @param {string} [props.alt=""] - Alt text for image
 */
function UserAvatar({ user, size = 44, className = "", alt = "" }) {
  const [imageFailed, setImageFailed] = useState(false);

  const displayName = user?.name ? user.name.trim() : "User";
  const initial = displayName.charAt(0).toUpperCase() || "U";
  const altText = alt || `${displayName}'s avatar`;

  // Prepend server origin if relative URL
  const getAvatarUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  };

  const hasImage = Boolean(user?.profilePicture && !imageFailed);
  const avatarUrl = hasImage ? getAvatarUrl(user.profilePicture) : "";

  return (
    <div
      className={`user-avatar-container ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        fontSize: `${Math.round(size * 0.42)}px`,
      }}
      aria-label={altText}
    >
      {hasImage ? (
        <img
          src={avatarUrl}
          alt={altText}
          className="user-avatar-img"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="user-avatar-initial">{initial}</span>
      )}
    </div>
  );
}

export default UserAvatar;
