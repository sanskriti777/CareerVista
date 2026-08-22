import "./ResumeScoreWidget.css";
import { useState } from "react";
import { FaMagic, FaCheckCircle } from "react-icons/fa";

function ResumeScoreWidget() {
  const [targetRole, setTargetRole] = useState("Frontend Developer");

  const roleScores = {
    "Frontend Developer": { score: 92, missing: ["TypeScript", "Next.js"] },
    "React Developer": { score: 95, missing: ["Redux Toolkit"] },
    "Node.js Developer": { score: 74, missing: ["MongoDB", "Express.js", "Docker"] },
    "Software Engineer": { score: 85, missing: ["Java Spring Boot", "SQL"] },
  };

  const current = roleScores[targetRole] || { score: 90, missing: ["TypeScript"] };

  return (
    <div className="resume-score-card">
      <div className="resume-score-header">
        <h3>🤖 AI Resume Match Score</h3>
        <span style={{ fontSize: "12px", background: "#f5f3ff", color: "#6d28d9", padding: "4px 10px", borderRadius: "12px", fontWeight: "600" }}>
          Live Analysis
        </span>
      </div>

      <select
        className="target-role-select"
        value={targetRole}
        onChange={(e) => setTargetRole(e.target.value)}
      >
        <option value="Frontend Developer">Target: Frontend Developer</option>
        <option value="React Developer">Target: React Developer</option>
        <option value="Node.js Developer">Target: Node.js Developer</option>
        <option value="Software Engineer">Target: Software Engineer</option>
      </select>

      <div
        className="score-badge-circle"
        style={{
          background: `conic-gradient(#6d28d9 ${current.score}%, #e2e8f0 0)`,
        }}
      >
        <div className="score-inner">
          {current.score}%
          <span>MATCH</span>
        </div>
      </div>

      <div className="score-feedback">
        <h4><FaMagic /> AI Analysis Feedback</h4>
        <ul>
          <li>Strong keyword alignment for <strong>{targetRole}</strong>.</li>
          <li>Recommended to add: <strong>{current.missing.join(", ")}</strong> to reach 100% match score.</li>
        </ul>
      </div>
    </div>
  );
}

export default ResumeScoreWidget;
