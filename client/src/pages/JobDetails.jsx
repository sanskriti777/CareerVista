import "./JobDetails.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaBriefcase, FaClock } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import Topbar from "../components/dashboard/Topbar";
import ApplyModal from "../components/jobs/ApplyModal";
import { getJobById } from "../services/jobService";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchDetails = async () => {
      if (!id) {
        setError("Job Not Found");
        setLoading(false);
        return;
      }

      const response = await getJobById(id);
      if (!isMounted) return;

      if (response && response.success && response.job) {
        setJob(response.job);
      } else {
        setError(response?.message || "Job Not Found");
      }
      setLoading(false);
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <Topbar />
        <div className="job-not-found">
          <h2>Loading job details...</h2>
        </div>
      </MainLayout>
    );
  }

  if (error || !job) {
    return (
      <MainLayout>
        <Topbar />
        <div className="job-not-found">
          <h2>{error || "Job Not Found"}</h2>
          <button onClick={() => navigate("/jobs")}>
            Back to Jobs
          </button>
        </div>
      </MainLayout>
    );
  }

  const formattedDate =
    job.postedDate ||
    (job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently");

  return (
    <MainLayout>
      <Topbar />

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
              onClick={() => setShowApplyModal(true)}
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
              Posted {formattedDate}
            </span>
          </div>

          {/* Description */}
          <section className="details-section">
            <h2>Job Description</h2>
            <p>{job.description}</p>
          </section>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
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
          )}

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
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
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
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
          )}
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal
          job={job}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </MainLayout>
  );
}

export default JobDetails;