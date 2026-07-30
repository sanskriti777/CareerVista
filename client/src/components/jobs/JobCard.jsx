import "./JobCard.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function JobCard({ job, savedJobs, toggleSaveJob }) {
  const isSaved = savedJobs.includes(job.id);

  return (
    <div className="job-card">
      <div className="job-header">
        <h3>{job.title}</h3>

        <button
          className="heart-btn"
          onClick={() => toggleSaveJob(job.id)}
        >
          {isSaved ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <p className="company">{job.company}</p>

      <div className="job-info">
        <span>📍 {job.location}</span>
        <span>💼 {job.type}</span>
      </div>

      <h4>{job.salary}</h4>

      <div className="skills">
        {job.skills.map((skill, index) => (
          <span key={index}>{skill}</span>
        ))}
      </div>

      <button className="apply-btn">
        Apply Now
      </button>
    </div>
  );
}

export default JobCard;