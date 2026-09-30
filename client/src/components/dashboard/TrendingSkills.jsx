import "./TrendingSkills.css";
import { useNavigate } from "react-router-dom";

function TrendingSkills({ jobs = [], loading = false }) {
  const navigate = useNavigate();

  // Derive unique skills from actual active jobs in MongoDB Atlas
  const derivedSkills = Array.isArray(jobs)
    ? Array.from(
        new Set(
          jobs.flatMap((j) => (Array.isArray(j.skills) ? j.skills : []))
        )
      )
    : [];

  const handleSkillClick = () => {
    navigate("/jobs");
  };

  return (
    <div className="skills">
      <h2>In-Demand Skills</h2>

      <div className="skill-list">
        {loading ? (
          <span style={{ cursor: "default", opacity: 0.6 }}>
            Loading skills...
          </span>
        ) : derivedSkills.length > 0 ? (
          derivedSkills.map((skill, index) => (
            <span
              key={index}
              onClick={handleSkillClick}
              title={`Explore jobs requiring ${skill}`}
            >
              {skill}
            </span>
          ))
        ) : (
          <span style={{ cursor: "default", opacity: 0.6 }}>
            No skills data available
          </span>
        )}
      </div>
    </div>
  );
}

export default TrendingSkills;