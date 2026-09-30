import "./ResumeScoreWidget.css";
import { useState, useEffect, useMemo } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaBullseye } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { getJobs } from "../../services/jobService";
import { getJobMatchScore } from "../../utils/matchingEngine";

function ResumeScoreWidget() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const selectedJob = useMemo(() => {
    if (!jobs || jobs.length === 0) return null;
    return (
      jobs.find((j) => (j._id || j.id) === selectedJobId) || jobs[0]
    );
  }, [jobs, selectedJobId]);

  const match = useMemo(() => {
    if (!selectedJob) return null;
    return getJobMatchScore(user, selectedJob);
  }, [user, selectedJob]);

  const score = match ? match.score : 0;
  const label = match ? match.label : "Low Match";

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
          style={{
            fontSize: "12px",
            background: "#f5f3ff",
            color: "#6d28d9",
            padding: "4px 10px",
            borderRadius: "12px",
            fontWeight: "600",
            border: "1px solid #ddd6fe",
          }}
        >
          Live Match
        </span>
      </div>

      {loading ? (
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
                <strong>Skills Match ({match.skillsScore}/60 pts):</strong>{" "}
                {match.matchedSkills.length > 0 ? (
                  <span>
                    Aligned on <strong>{match.matchedSkills.join(", ")}</strong>.
                  </span>
                ) : (
                  <span>No overlapping skills found with this opening.</span>
                )}
              </li>

              {match.missingSkills.length > 0 && (
                <li>
                  <strong>Skills to Acquire:</strong>{" "}
                  <span>
                    Add <strong>{match.missingSkills.join(", ")}</strong> to your skill set to increase score.
                  </span>
                </li>
              )}

              <li>
                <strong>Role Alignment ({match.roleScore}/25 pts):</strong>{" "}
                {match.roleMatch ? (
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
                <strong>Location ({match.locationScore}/15 pts):</strong>{" "}
                {match.locationMatch ? (
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
