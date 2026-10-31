import "./ResumeScoreWidget.css";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaCheckCircle,
  FaRegCircle,
  FaBullseye,
  FaArrowRight,
  FaUserEdit,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { getJobs } from "../../services/jobService";
import { getJobMatchScore, isProfileMatchReady } from "../../utils/matchingEngine";

function ResumeScoreWidget() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isReady = isProfileMatchReady(user);

  const hasPreferredRole = Boolean(
    user?.preferredRole &&
      typeof user.preferredRole === "string" &&
      user.preferredRole.trim().length > 0
  );

  const hasSkills =
    Array.isArray(user?.skills) &&
    user.skills.some(
      (skill) => typeof skill === "string" && skill.trim().length > 0
    );

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [loading, setLoading] = useState(isReady);

  useEffect(() => {
    if (!isReady) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchJobsForWidget = async () => {
      setLoading(true);
      try {
        const response = await getJobs();
        if (isMounted && response && response.success) {
          const fetchedJobs = response.jobs || [];
          setJobs(fetchedJobs);
          if (fetchedJobs.length > 0) {
            setSelectedJobId(fetchedJobs[0]._id || fetchedJobs[0].id);
          }
        }
      } catch (err) {
        console.error("Error loading jobs for match widget:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchJobsForWidget();

    return () => {
      isMounted = false;
    };
  }, [isReady]);

  const selectedJob = useMemo(() => {
    if (!isReady || !jobs || jobs.length === 0) return null;
    return (
      jobs.find((j) => (j._id || j.id) === selectedJobId) || jobs[0]
    );
  }, [isReady, jobs, selectedJobId]);

  const match = useMemo(() => {
    if (!isReady || !selectedJob) return null;
    return getJobMatchScore(user, selectedJob);
  }, [isReady, user, selectedJob]);

  const score = match ? match.score : 0;
  const label = match ? match.label : "Low Match";

  const handleCompleteProfileClick = () => {
    if (location.pathname === "/profile") {
      const editBtn = document.querySelector(".btn-edit-profile");
      if (editBtn) {
        editBtn.click();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="resume-score-card">
      <div className="resume-score-header">
        <div>
          <h3>🎯 Role Fit & Profile Analysis</h3>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
            Rule-based match against live market roles (Skills 60% • Role 25% • Location 15%)
          </p>
        </div>
        <span
          style={
            isReady
              ? {
                  fontSize: "12px",
                  background: "#f5f3ff",
                  color: "#6d28d9",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontWeight: "600",
                  border: "1px solid #ddd6fe",
                }
              : {
                  fontSize: "12px",
                  background: "#f8fafc",
                  color: "#64748b",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontWeight: "600",
                  border: "1px solid #e2e8f0",
                }
          }
        >
          {isReady ? "Live Match" : "Setup Required"}
        </span>
      </div>

      {!isReady ? (
        <div className="profile-setup-box">
          <div className="setup-banner-icon">
            <FaUserEdit />
          </div>
          <div className="setup-content">
            <h4 className="setup-status-title">
              Complete your profile to unlock personalized job-fit analysis.
            </h4>
            <p className="setup-status-desc">
              Add your preferred role and at least one skill to calculate your match against live job openings.
            </p>

            <div className="setup-checklist">
              <div className={`checklist-item ${hasPreferredRole ? "completed" : "pending"}`}>
                {hasPreferredRole ? (
                  <FaCheckCircle className="check-icon completed" />
                ) : (
                  <FaRegCircle className="check-icon pending" />
                )}
                <span>
                  <strong>Preferred Role:</strong>{" "}
                  {hasPreferredRole ? user.preferredRole : "Add your preferred role"}
                </span>
              </div>

              <div className={`checklist-item ${hasSkills ? "completed" : "pending"}`}>
                {hasSkills ? (
                  <FaCheckCircle className="check-icon completed" />
                ) : (
                  <FaRegCircle className="check-icon pending" />
                )}
                <span>
                  <strong>Skills:</strong>{" "}
                  {hasSkills
                    ? `${user.skills.length} ${user.skills.length === 1 ? "skill" : "skills"} added`
                    : "Add at least one skill"}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-complete-profile"
              onClick={handleCompleteProfileClick}
            >
              Complete Profile <FaArrowRight style={{ fontSize: "11px", marginLeft: "6px" }} />
            </button>
          </div>
        </div>
      ) : loading ? (
        <p style={{ textAlign: "center", color: "#64748b", padding: "20px 0" }}>
          Loading live target roles...
        </p>
      ) : jobs.length > 0 ? (
        <>
          <label
            htmlFor="target-role-dropdown"
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: "600",
              color: "#475569",
              marginBottom: "6px",
            }}
          >
            Select Target Opening from Database:
          </label>
          <select
            id="target-role-dropdown"
            className="target-role-select"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            {jobs.map((job) => (
              <option key={job._id || job.id} value={job._id || job.id}>
                {job.title} — {job.company} ({job.location})
              </option>
            ))}
          </select>

          <div
            className="score-badge-circle"
            style={{
              background: `conic-gradient(#6d28d9 ${score}%, #e2e8f0 0)`,
            }}
          >
            <div className="score-inner">
              {score}%
              <span>{label.replace(" Match", "")}</span>
            </div>
          </div>

          <div className="score-feedback">
            <h4>
              <FaBullseye style={{ marginRight: "6px" }} /> Match Diagnostic ({label})
            </h4>
            <ul>
              <li>
                <strong>Skills Match ({match?.skillsScore ?? 0}/60 pts):</strong>{" "}
                {match?.matchedSkills?.length > 0 ? (
                  <span>
                    Aligned on <strong>{match.matchedSkills.join(", ")}</strong>.
                  </span>
                ) : (
                  <span>No overlapping skills found with this opening.</span>
                )}
              </li>

              {match?.missingSkills?.length > 0 && (
                <li>
                  <strong>Skills to Acquire:</strong>{" "}
                  <span>
                    Add <strong>{match.missingSkills.join(", ")}</strong> to your skill set to increase score.
                  </span>
                </li>
              )}

              <li>
                <strong>Role Alignment ({match?.roleScore ?? 0}/25 pts):</strong>{" "}
                {match?.roleMatch ? (
                  <span>
                    Your preferred role aligned with <strong>{selectedJob?.title}</strong>.
                  </span>
                ) : (
                  <span>
                    Preferred role does not match <strong>{selectedJob?.title}</strong>.
                  </span>
                )}
              </li>

              <li>
                <strong>Location ({match?.locationScore ?? 0}/15 pts):</strong>{" "}
                {match?.locationMatch ? (
                  <span>Location compatible ({selectedJob?.location}).</span>
                ) : (
                  <span>Job location ({selectedJob?.location}) differs from profile location.</span>
                )}
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", color: "#64748b", padding: "16px 0" }}>
          <p>No active job listings available to analyze.</p>
        </div>
      )}
    </div>
  );
}

export default ResumeScoreWidget;
