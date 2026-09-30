import "./StatsCard.css";

function StatsCard({ title, value, color, trend }) {
  const defaultTrends = {
    "Available Jobs": "Active openings",
    "Saved Jobs": "Active bookmarks",
    "Applications": "Tracked applications",
    "Career Match": "Based on profile",
    "Top Job Match": "Top compatible role",
  };

  return (
    <div className="stats-card">
      <div>
        <h3>{title}</h3>
        <h1 style={{ color: color }}>{value}</h1>
      </div>

      <div className="stats-trend">
        <span>{trend || defaultTrends[title] || "Updated live"}</span>
      </div>
    </div>
  );
}

export default StatsCard;