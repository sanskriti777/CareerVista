import "./JobCard.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function JobCard({ job, savedJobs, toggleSaveJob, onOpenApplyModal }) {
  const navigate = useNavigate();

  const jobId = job._id || job.id;
  const isSaved = Array.isArray(savedJobs) && (savedJobs.includes(jobId) || (job.id && savedJobs.includes(job.id)));

  const companyLetter = job.company ? job.company.charAt(0) : "C";

  return (
    <div
      className="job-card"
      onClick={() => navigate(`/job/${jobId}`)}
    >
      <div className="job-header">
        <div className="company-branding">
          <div className="company-logo-badge">{companyLetter}</div>
          <div>
            <h3>{job.title}</h3>
            <p className="company">{job.company}</p>
          </div>
        </div>

        <button
          className="heart-btn"
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveJob(jobId);
          }}
          title={isSaved ? "Remove from saved" : "Save job"}
        >
          {isSaved ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className="job-metadata-pills">
        <span className="badge-salary">💰 {job.salary}</span>
        <span className="badge-type">💼 {job.type}</span>
        <span className="badge-exp">📍 {job.location}</span>
      </div>

      <div className="skills">
        {job.skills &&
          job.skills.map((skill, index) => (
            <span key={index}>{skill}</span>
          ))}
      </div>

      <button
        className="apply-btn"
        onClick={(e) => {
          e.stopPropagation();
          if (onOpenApplyModal) {
            onOpenApplyModal(job);
          } else {
            navigate(`/job/${jobId}`);
          }
        }}
      >
        Apply Now
      </button>
    </div>
  );
}

export default JobCard;