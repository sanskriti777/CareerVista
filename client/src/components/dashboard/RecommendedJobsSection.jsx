import "./RecommendedJobsSection.css";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaMapMarkerAlt, FaBriefcase, FaArrowRight, FaUserEdit } from "react-icons/fa";

function RecommendedJobsSection({
  recommendations = [],
  loading = false,
  hasProfile = false,
  onOpenApplyModal,
}) {
  const navigate = useNavigate();

  const getMatchBadgeStyle = (label) => {
    switch (label) {
      case "Strong Match":
        return { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" };
      case "Good Match":
        return { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" };
      case "Partial Match":
        return { bg: "#fffbeb", color: "#b45309", border: "#fde68a" };
      case "Low Match":
      default:
        return { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" };
    }
  };

  return (
    <div className="recommended-section-card">
      <div className="recommended-section-header">
        <div>
          <div className="recommended-title-row">
            <h2>🎯 Recommended Jobs For You</h2>
            <span className="live-matching-badge">Rule-Based Match</span>
          </div>
          <p className="recommended-subtitle">
            Ranked deterministically using your profile skills (60%), role preference (25%), and location compatibility (15%).
          </p>
        </div>

        <Link to="/jobs" className="browse-all-link">
          Explore All Jobs <FaArrowRight style={{ fontSize: "11px", marginLeft: "4px" }} />
        </Link>
      </div>

      {!hasProfile && (
        <div className="profile-prompt-banner">
          <div className="prompt-left">
            <FaUserEdit className="prompt-icon" />
            <div>
              <h4>Enhance Your Match Accuracy</h4>
              <p>Add your skills, target role, and location to your profile to receive higher-precision recommendations.</p>
            </div>
          </div>
          <Link to="/profile" className="btn-update-profile">
            Edit Profile
          </Link>
        </div>
      )}

      {loading ? (
        <div className="recommendations-loading">
          <div className="rec-spinner"></div>
          <p>Analyzing job fit across live database listings...</p>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="recommended-jobs-grid">
          {recommendations.map(({ job, match }) => {
            const badgeStyle = getMatchBadgeStyle(match.label);
            const companyLetter = job.company ? job.company.charAt(0) : "C";

            return (
              <div
                key={job._id || job.id}
                className="recommended-job-card"
                onClick={() => navigate(`/job/${job._id || job.id}`)}
              >
                <div className="rec-card-top">
                  <div className="rec-company-info">
                    <div className="rec-logo-badge">{companyLetter}</div>
                    <div>
                      <h3 className="rec-job-title">{job.title}</h3>
                      <p className="rec-company-name">{job.company}</p>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div
                    className="match-score-badge"
                    style={{
                      backgroundColor: badgeStyle.bg,
                      color: badgeStyle.color,
                      border: `1px solid ${badgeStyle.border}`,
                    }}
                  >
                    <span className="match-score-number">{match.score}%</span>
                    <span className="match-score-label">{match.label}</span>
                  </div>
                </div>

                <div className="rec-metadata-row">
                  <span>
                    <FaMapMarkerAlt /> {job.location}
                  </span>
                  <span>
                    <FaBriefcase /> {job.type}
                  </span>
                  <span className="rec-salary">💰 {job.salary}</span>
                </div>

                {/* Matched & Required Skills */}
                <div className="rec-skills-section">
                  <span className="skills-sublabel">Matched Skills:</span>
                  <div className="rec-skills-pills">
                    {match.matchedSkills.length > 0 ? (
                      match.matchedSkills.map((skill) => (
                        <span key={skill} className="pill-matched">
                          <FaCheckCircle style={{ fontSize: "10px", marginRight: "3px" }} />
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="no-matched-text">No skill overlap</span>
                    )}

                    {match.missingSkills.length > 0 && (
                      <span className="missing-skills-note">
                        +{match.missingSkills.length} more needed
                      </span>
                    )}
                  </div>
                </div>

                <div className="rec-card-footer">
                  <button
                    type="button"
                    className="btn-view-match"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/job/${job._id || job.id}`);
                    }}
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    className="btn-apply-match"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenApplyModal) {
                        onOpenApplyModal(job);
                      } else {
                        navigate(`/job/${job._id || job.id}`);
                      }
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-recommendations-state">
          <p>No jobs available for matching.</p>
          <Link to="/jobs" className="explore-jobs-link">
            Browse All Jobs →
          </Link>
        </div>
      )}
    </div>
  );
}

export default RecommendedJobsSection;
