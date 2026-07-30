import "./SavedJobCard.css";

function SavedJobCard({ job }) {
  return (
    <div className="saved-job-card">
      <h3>{job.title}</h3>

      <p className="company">{job.company}</p>

      <div className="job-details">
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

export default SavedJobCard;