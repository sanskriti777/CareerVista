import "./SavedJobCard.css";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SavedJobCard({ job, toggleSaveJob }) {
  const navigate = useNavigate();

  return (
    <div
      className="saved-job-card"
      onClick={() => navigate(`/job/${job.id}`)}
    >
      <div className="saved-job-header">
        <div>
          <h3>{job.title}</h3>
          <p className="company">{job.company}</p>
        </div>

        {toggleSaveJob && (
          <button
            className="heart-btn saved"
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveJob(job.id);
            }}
            title="Remove from saved jobs"
          >
            <FaHeart />
          </button>
        )}
      </div>

      <div className="job-details">
        <span>📍 {job.location}</span>
        <span>💼 {job.type}</span>
      </div>

      <h4 className="salary">{job.salary}</h4>

      <div className="skills">
        {job.skills.map((skill, index) => (
          <span key={index}>{skill}</span>
        ))}
      </div>

      <button
        className="apply-btn"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/job/${job.id}`);
        }}
      >
        View Details & Apply
      </button>
    </div>
  );
}

export default SavedJobCard;