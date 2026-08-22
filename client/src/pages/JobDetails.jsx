import "./JobDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import { jobs } from "../data/jobsData";
import { FaArrowLeft, FaMapMarkerAlt, FaBriefcase, FaClock } from "react-icons/fa";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // URL se mili ID ko number me convert karke job find karna
  const job = jobs.find((job) => job.id === Number(id));

  // Agar job exist nahi karti
  if (!job) {
    return (
      <div className="job-not-found">
        <h2>Job Not Found</h2>

        <button onClick={() => navigate("/jobs")}>
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="job-details-page">

      {/* Back Button */}
      <button
        className="back-btn"
        onClick={() => navigate("/jobs")}
      >
        <FaArrowLeft />
        Back to Jobs
      </button>

      {/* Job Header */}
      <div className="job-details-card">

        <div className="job-details-header">

          <div>
            <h1>{job.title}</h1>
            <h3>{job.company}</h3>
          </div>

          <button
            className="apply-btn"
            onClick={() => alert("Application feature coming soon!")}
          >
            Apply Now
          </button>

        </div>

        {/* Job Information */}
        <div className="job-details-info">

          <span>
            <FaMapMarkerAlt />
            {job.location}
          </span>

          <span>
            <FaBriefcase />
            {job.type}
          </span>

          <span>
            💰 {job.salary}
          </span>

          <span>
            <FaClock />
            {job.experience}
          </span>

          <span>
            Posted {job.postedDate}
          </span>

        </div>

        {/* Description */}
        <section className="details-section">

          <h2>Job Description</h2>

          <p>{job.description}</p>

        </section>

        {/* Skills */}
        <section className="details-section">

          <h2>Required Skills</h2>

          <div className="details-skills">

            {job.skills.map((skill, index) => (
              <span key={index}>
                {skill}
              </span>
            ))}

          </div>

        </section>

        {/* Responsibilities */}
        <section className="details-section">

          <h2>Responsibilities</h2>

          <ul>
            {job.responsibilities.map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}
          </ul>

        </section>

        {/* Requirements */}
        <section className="details-section">

          <h2>Requirements</h2>

          <ul>
            {job.requirements.map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}
          </ul>

        </section>

      </div>
    </div>
  );
}

export default JobDetails;