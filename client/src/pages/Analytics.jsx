import "./Analytics.css";
import MainLayout from "../layouts/MainLayout";
import Topbar from "../components/dashboard/Topbar";
import ResumeScoreWidget from "../components/profile/ResumeScoreWidget";
import { useApplications } from "../context/ApplicationsContext";

function Analytics() {
  const { applications } = useApplications();

  const topSkills = [
    { name: "React.js", percentage: 88 },
    { name: "Node.js & Express", percentage: 75 },
    { name: "Python / Data Science", percentage: 62 },
    { name: "UI/UX Design", percentage: 54 },
  ];

  return (
    <MainLayout>
      <Topbar />

      <div className="analytics-container">
        <h2 className="analytics-title">Career Insights & Market Analytics</h2>

        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Total Job Applications</h3>
            <div className="analytics-stat">{14 + applications.length}</div>
            <p style={{ color: "#10b981", fontSize: "14px", marginTop: "8px" }}>↑ 12% from last month</p>
          </div>

          <div className="analytics-card">
            <h3>Profile Views</h3>
            <div className="analytics-stat">342</div>
            <p style={{ color: "#10b981", fontSize: "14px", marginTop: "8px" }}>↑ 28% profile activity</p>
          </div>

          <div className="analytics-card">
            <h3>AI Match Score</h3>
            <div className="analytics-stat">92%</div>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "8px" }}>High match for Frontend roles</p>
          </div>
        </div>

        <ResumeScoreWidget />

        <div className="analytics-card" style={{ marginTop: "10px" }}>
          <h3>Top In-Demand Skills (2026)</h3>
          <div className="skills-progress">
            {topSkills.map((skill) => (
              <div key={skill.name} className="skill-bar-container">
                <div className="skill-bar-label">
                  <span>{skill.name}</span>
                  <span>{skill.percentage}%</span>
                </div>
                <div className="skill-bar-bg">
                  <div
                    className="skill-bar-fill"
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Analytics;