import "./StatsCard.css";

function StatsCard({ title, value, color }) {
  const trends = {
    "Total Jobs": "↑ 18 new today",
    "Saved Jobs": "Active bookmarks",
    "Applications": "↑ 12% this month",
    "Skills Matched": "Top 5% candidate",
  };

  return (
    <div className="stats-card">
      <div>
        <h3>{title}</h3>
        <h1 style={{ color: color }}>{value}</h1>
      </div>

      <div className="stats-trend">
        <span>{trends[title] || "Updated live"}</span>
      </div>
    </div>
  );
}

export default StatsCard;