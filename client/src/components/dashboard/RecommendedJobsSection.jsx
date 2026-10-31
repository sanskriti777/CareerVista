import "./RecommendedJobsSection.css";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaRegCircle,
  FaMapMarkerAlt,
  FaBriefcase,
  FaArrowRight,
  FaUserEdit,
} from "react-icons/fa";
import { isProfileMatchReady } from "../../utils/matchingEngine";

function RecommendedJobsSection({
  jobs = [],
  recommendations = [],
  loading = false,
  matchReady,
  hasProfile,
  user = null,
  onOpenApplyModal,
}) {
  const navigate = useNavigate();

  // Backward and forward compatibility for readiness
  const isReady =
    typeof matchReady === "boolean"
      ? matchReady
      : typeof hasProfile === "boolean"
      ? hasProfile
      : isProfileMatchReady(user);

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

  // Profile completion checklist based strictly on currently available user fields
  const isNameFilled = Boolean(user?.name && user.name.trim().length > 0);
  const isEmailFilled = Boolean(user?.email && user.email.trim().length > 0);
  const isRoleFilled = Boolean(
    user?.preferredRole &&
      typeof user.preferredRole === "string" &&
      user.preferredRole.trim().length > 0
  );
  const isSkillsFilled =
    Array.isArray(user?.skills) &&
    user.skills.some(
      (skill) => typeof skill === "string" && skill.trim().length > 0
    );
  const isLocationFilled = Boolean(
    user?.location &&
      typeof user.location === "string" &&
      user.location.trim().length > 0
  );
  const isResumeFilled = Boolean(
    user?.resumeUrl &&
      typeof user.resumeUrl === "string" &&
      user.resumeUrl.trim().length > 0
  );

  const checklistItems = [
    { label: "Name", completed: isNameFilled },
    { label: "Email", completed: isEmailFilled },
    { label: "Preferred Role", completed: isRoleFilled },
    { label: "Skills", completed: isSkillsFilled },
    { label: "Location", completed: isLocationFilled },
    { label: "Resume", completed: isResumeFilled },
  ];

  // Up to 4 discovery jobs from live MongoDB data
  const discoveryJobs = Array.isArray(jobs) ? jobs.slice(0, 4) : [];

  return (
    <div className="recommended-section-card">
      {/* ---------------------------------------------------- */}
      {/* MODE A: PROFILE INCOMPLETE / DISCOVERY MODE           */}
      {/* ---------------------------------------------------- */}
      {!isReady ? (
        <>
          {/* Polished Profile Completion Onboarding Card */}
          <div className="dashboard-completion-card">
            <div className="completion-card-header">
              <div className="completion-header-left">
                <div className="completion-header-icon">
                  <FaUserEdit />
                </div>
                <div className="completion-header-text">
                  <h3>Complete Your Profile</h3>
                  <p>
                    Add your skills and preferred role to unlock personalized job recommendations.
                  </p>
                </div>
              </div>
              <Link to="/profile" className="btn-dashboard-complete-profile">
                Complete Profile <FaArrowRight style={{ fontSize: "11px", marginLeft: "6px" }} />
              </Link>
            </div>

            <div className="completion-checklist-grid">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`completion-pill ${
                    item.completed ? "is-complete" : "is-pending"
                  }`}
                >
                  {item.completed ? (
                    <FaCheckCircle className="pill-status-icon icon-complete" />
                  ) : (
                    <FaRegCircle className="pill-status-icon icon-pending" />
                  )}
                  <span className="pill-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Discovery Section Header */}
          <div className="recommended-section-header">
            <div>
              <div className="recommended-title-row">
                <h2>Explore Latest Jobs</h2>
                <span className="discovery-badge">General Discovery</span>
              </div>
              <p className="recommended-subtitle">
                Browse active market openings. Complete your profile above to activate precision AI matching.
              </p>
            </div>

            <Link to="/jobs" className="browse-all-link">
              Explore All Jobs <FaArrowRight style={{ fontSize: "11px", marginLeft: "4px" }} />
            </Link>
          </div>

          {/* Discovery Jobs Grid (NO fake match scores / NO match badges) */}
          {loading ? (
            <div className="recommendations-loading">
              <div className="rec-spinner"></div>
              <p>Fetching active market openings...</p>
            </div>
          ) : discoveryJobs.length > 0 ? (
            <div className="recommended-jobs-grid">
              {discoveryJobs.map((job) => {
                const companyLetter = job.company ? job.company.charAt(0) : "C";
                const jobSkills = Array.isArray(job.skills)
                  ? job.skills.slice(0, 3)
                  : [];
                const remainingSkillsCount =
                  Array.isArray(job.skills) && job.skills.length > 3
                    ? job.skills.length - 3
                    : 0;

                return (
                  <div
                    key={job._id || job.id}
                    className="recommended-job-card discovery-job-card"
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

                      <span className="discovery-job-type-badge">{job.type}</span>
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

                    {/* Required Skills Row */}
                    <div className="rec-skills-section">
                      <span className="skills-sublabel">Required Skills:</span>
                      <div className="rec-skills-pills">
                        {jobSkills.length > 0 ? (
                          jobSkills.map((skill) => (
                            <span key={skill} className="pill-discovery-skill">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="no-matched-text">Not specified</span>
                        )}

                        {remainingSkillsCount > 0 && (
                          <span className="missing-skills-note">
                            +{remainingSkillsCount} more
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
              <p>No active job listings found.</p>
              <Link to="/jobs" className="explore-jobs-link">
                Browse All Jobs →
              </Link>
            </div>
          )}
        </>
      ) : (
        /* ---------------------------------------------------- */
        /* MODE B: MATCH-READY / PERSONALIZED RECOMMENDATIONS   */
        /* ---------------------------------------------------- */
        <>
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
        </>
      )}
    </div>
  );
}

export default RecommendedJobsSection;
