import "./TrendingSkills.css";
import { skills } from "../../data/skillsData";

function TrendingSkills() {
  return (
    <div className="skills">
      <h2>Trending Skills</h2>

      <div className="skill-list">
        {skills.map((skill, index) => (
          <span key={index}>{skill}</span>
        ))}
      </div>
    </div>
  );
}

export default TrendingSkills;