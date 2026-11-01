import "./Analytics.css";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaCalendarAlt,
  FaUserEdit,
} from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import Topbar from "../components/dashboard/Topbar";
import { useApplications } from "../context/ApplicationsContext";
import { useSavedJobs } from "../context/SavedJobsContext";
import { useAuth } from "../context/AuthContext";
import { getJobs } from "../services/jobService";
import {
  getRecommendedJobs,
  hasSufficientProfileData,
} from "../utils/matchingEngine";

function Analytics() {
  const { user } = useAuth();
  const { applications, loading: applicationsLoading } = useApplications();
  const { savedJobs, loading: savedJobsLoading } = useSavedJobs();

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMarketJobs = async () => {
      setJobsLoading(true);
      try {
        const response = await getJobs();
        if (isMounted && response && response.success) {
          setJobs(response.jobs || []);
        }
      } catch (err) {
        console.error("Error fetching jobs for Analytics:", err);
      } finally {
        if (isMounted) setJobsLoading(false);
      }
    };

    fetchMarketJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalApplications = Array.isArray(applications) ? applications.length : 0;
  const totalSavedJobs = Array.isArray(savedJobs) ? savedJobs.length : 0;

  // Real recommendation and matching calculations
  const hasProfile = hasSufficientProfileData(user);
  const scoredRecommendations = useMemo(() => {
    return getRecommendedJobs(user, jobs, 0); // score all available jobs
  }, [user, jobs]);

  const topMatch = scoredRecommendations[0]?.match;
  const topScore = topMatch ? topMatch.score : 0;
  const avgScore =
    scoredRecommendations.length > 0
      ? Math.round(
          scoredRecommendations.reduce((acc, r) => acc + r.match.score, 0) /
            scoredRecommendations.length
        )
      : 0;

  // Real match tier breakdown
  const matchTiers = [
    {
      label: "Strong Match (80–100%)",
      color: "#16a34a",
      count: scoredRecommendations.filter((r) => r.match.score >= 80).length,
    },
    {
      label: "Good Match (60–79%)",
      color: "#2563eb",
      count: scoredRecommendations.filter(
        (r) => r.match.score >= 60 && r.match.score < 80
      ).length,
    },
    {
      label: "Partial Match (40–59%)",
      color: "#d97706",
      count: scoredRecommendations.filter(
        (r) => r.match.score >= 40 && r.match.score < 60
      ).length,
    },
    {
      label: "Low Match (0–39%)",
      color: "#64748b",
      count: scoredRecommendations.filter((r) => r.match.score < 40).length,
    },
  ];

  // Calculate real status breakdown from actual applications
  const statusDefinitions = [
    { status: "Submitted", color: "#2563eb", bg: "#eff6ff" },
    { status: "Applied", color: "#6d28d9", bg: "#f5f3ff" },
    { status: "Under Review", color: "#d97706", bg: "#fffbeb" },
    { status: "Shortlisted", color: "#16a34a", bg: "#f0fdf4" },
    { status: "Selected", color: "#059669", bg: "#ecfdf5" },
    { status: "Rejected", color: "#dc2626", bg: "#fef2f2" },
  ];

  const statusCounts = (applications || []).reduce((acc, app) => {
    const st = app.status || "Submitted";
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const statusBreakdown = statusDefinitions.map((def) => {
    const count = statusCounts[def.status] || 0;
    const percentage =
      totalApplications > 0
        ? Math.round((count / totalApplications) * 100)
        : 0;
    return {
      ...def,
      count,
      percentage,
    };
  });

  // Calculate outcome counts from real applications
  const positiveOutcomes =
    (statusCounts["Shortlisted"] || 0) + (statusCounts["Selected"] || 0);
  const underReviewCount =
    (statusCounts["Under Review"] || 0) +
    (statusCounts["Submitted"] || 0) +
    (statusCounts["Applied"] || 0);

  // Group applications by date for real activity timeline
  const activityList = [...(applications || [])]
    .sort(
      (a, b) =>
        new Date(b.appliedAt || b.createdAt) -
        new Date(a.appliedAt || a.createdAt)
    )
    .slice(0, 5);

  // Calculate real top skills from active MongoDB job postings
  const skillFrequency = {};
  jobs.forEach((job) => {
    if (Array.isArray(job.skills)) {
      job.skills.forEach((skill) => {
        const trimmed = typeof skill === "string" ? skill.trim() : "";
        if (trimmed) {
          skillFrequency[trimmed] = (skillFrequency[trimmed] || 0) + 1;
        }
      });
    }
  });

  const totalActiveJobs = jobs.length || 1;
  const topInDemandSkills = Object.entries(skillFrequency)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalActiveJobs) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const formatDate = (dateVal) => {
    if (!dateVal) return "Recently";
    try {
      return new Date(dateVal).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const isLoading = applicationsLoading || savedJobsLoading || jobsLoading;

  return (
    <MainLayout>
      <Topbar />

      <div className="analytics-container">
        <div className="analytics-header">
          <h2 className="analytics-title">Application & Market Analytics</h2>
          <p className="analytics-subtitle">
            Real-time pipeline metrics and market demand data from your active job hunt.
          </p>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Total Job Applications</h3>
            <div className="analytics-stat">
              {applicationsLoading ? "..." : totalApplications}
            </div>
            <p className="analytics-card-subtitle">
              {totalApplications === 1
                ? "1 submission tracked"
                : `${totalApplications} submissions tracked`}
            </p>
          </div>

          <div className="analytics-card">
            <h3>Saved Opportunities</h3>
            <div className="analytics-stat">
              {savedJobsLoading ? "..." : totalSavedJobs}
            </div>
            <p className="analytics-card-subtitle">
              {totalSavedJobs === 1
                ? "1 active bookmark"
                : `${totalSavedJobs} active bookmarks`}
            </p>
          </div>

          <div className="analytics-card">
            <h3>Profile Views</h3>
            <div
              className="analytics-stat"
              style={{ color: "#64748b", fontSize: "24px", paddingTop: "6px" }}
            >
              Not tracked yet
            </div>
            <p className="analytics-card-subtitle">
              Recruiter view tracking in preview
            </p>
          </div>

          <div className="analytics-card">
            <h3>Career Match Score</h3>
            <div className="analytics-stat" style={{ color: "#7c3aed" }}>
              {jobsLoading
                ? "..."
                : hasProfile && topMatch
                ? `${topScore}%`
                : "Setup"}
            </div>
            <p className="analytics-card-subtitle">
              {hasProfile && topMatch
                ? `Top: ${topMatch.label} • Avg: ${avgScore}%`
                : "Add skills in Profile to calculate match"}
            </p>
          </div>
        </div>

        {/* Real Job Fit & Recommendation Analytics */}
        <div className="analytics-card">
          <div className="analytics-section-header">
            <div>
              <h3>🎯 Market Fit & Recommendation Breakdown</h3>
              <p className="skills-subtitle">
                Deterministic matching based on your profile skills (60%), role preference (25%), and location (15%).
              </p>
            </div>
            <Link to="/profile" className="analytics-link">
              Edit Profile →
            </Link>
          </div>

          {!hasProfile ? (
            <div className="profile-prompt-banner" style={{ margin: "10px 0" }}>
              <div className="prompt-left">
                <FaUserEdit className="prompt-icon" />
                <div>
                  <h4>Profile Information Needed</h4>
                  <p>Add your skills and preferred role to calculate real compatibility against open listings.</p>
                </div>
              </div>
              <Link to="/profile" className="btn-update-profile">
                Go to Profile
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "10px" }}>
              {/* Score Bands */}
              <div>
                <h4 style={{ margin: "0 0 12px", fontSize: "14px", color: "#334155" }}>
                  Match Distribution Across Active Jobs ({jobs.length} total)
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {matchTiers.map((tier) => {
                    const percentage = jobs.length > 0 ? Math.round((tier.count / jobs.length) * 100) : 0;
                    return (
                      <div key={tier.label}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                          <span>{tier.label}</span>
                          <span style={{ color: tier.color }}>{tier.count} roles ({percentage}%)</span>
                        </div>
                        <div className="skill-bar-bg">
                          <div
                            className="skill-bar-fill"
                            style={{ width: `${percentage}%`, background: tier.color }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Recommended Roles */}
              <div>
                <h4 style={{ margin: "0 0 12px", fontSize: "14px", color: "#334155" }}>
                  Top Ranked Recommendations
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {scoredRecommendations.slice(0, 3).map(({ job, match }) => (
                    <div
                      key={job._id || job.id}
                      style={{
                        padding: "10px 14px",
                        background: "#f8fafc",
                        border: "1px solid #f1f5f9",
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "700", fontSize: "13px", color: "#0f172a" }}>
                          {job.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          {job.company} • {job.location}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          padding: "4px 8px",
                          borderRadius: "8px",
                          background: match.score >= 80 ? "#dcfce7" : match.score >= 60 ? "#dbeafe" : "#fef3c7",
                          color: match.score >= 80 ? "#15803d" : match.score >= 60 ? "#1e40af" : "#92400e",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {match.score}% ({match.label.replace(" Match", "")})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading state indicator */}
        {isLoading && totalApplications === 0 ? (
          <div className="analytics-loading-box">
            <div className="analytics-spinner"></div>
            <p>Loading analytics data...</p>
          </div>
        ) : totalApplications === 0 ? (
          /* Empty state when zero applications exist */
          <div className="analytics-empty-state">
            <div className="empty-state-icon">📊</div>
            <h3>No Application Data Yet</h3>
            <p>
              Submit your first job application to unlock real-time pipeline analytics,
              recruiter review breakdowns, and outcome statistics.
            </p>
            <Link to="/jobs" className="explore-jobs-btn">
              <FaSearch /> Explore Jobs
            </Link>
          </div>
        ) : (
          /* Real Data Section */
          <div className="analytics-details-grid">
            {/* Status Breakdown Card */}
            <div className="analytics-card">
              <div className="analytics-section-header">
                <h3>Application Pipeline Breakdown</h3>
                <span className="badge-count">{totalApplications} Total</span>
              </div>
              <div className="status-breakdown-list">
                {statusBreakdown.map((item) => (
                  <div key={item.status} className="status-breakdown-item">
                    <div className="status-label-group">
                      <span
                        className="status-color-dot"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="status-name">{item.status}</span>
                      <span className="status-number">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="skill-bar-bg">
                      <div
                        className="skill-bar-fill"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                          background: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Outcome Highlights */}
              <div className="outcomes-summary-row">
                <div
                  className="outcome-pill"
                  style={{ background: "#f0fdf4", color: "#16a34a" }}
                >
                  <strong>{positiveOutcomes}</strong> Shortlisted / Selected
                </div>
                <div
                  className="outcome-pill"
                  style={{ background: "#eff6ff", color: "#2563eb" }}
                >
                  <strong>{underReviewCount}</strong> Active in Pipeline
                </div>
              </div>
            </div>

            {/* Application Timeline / Activity */}
            <div className="analytics-card">
              <div className="analytics-section-header">
                <h3>Recent Application Timeline</h3>
                <Link to="/applications" className="analytics-link">
                  View All →
                </Link>
              </div>

              <div className="activity-timeline-list">
                {activityList.map((app) => {
                  const statusMatch = statusDefinitions.find(
                    (s) => s.status === app.status
                  );
                  return (
                    <div key={app._id} className="timeline-item">
                      <div className="timeline-details">
                        <h4>{app.job?.title || "Role"}</h4>
                        <p>{app.job?.company || "Company"}</p>
                        <span className="timeline-date">
                          <FaCalendarAlt /> Applied {formatDate(app.appliedAt || app.createdAt)}
                        </span>
                      </div>
                      <span
                        className="timeline-status-badge"
                        style={{
                          backgroundColor: statusMatch?.bg || "#eff6ff",
                          color: statusMatch?.color || "#2563eb",
                        }}
                      >
                        {app.status || "Submitted"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Market In-Demand Skills (Derived from MongoDB Jobs) */}
        <div className="analytics-card">
          <div className="analytics-section-header">
            <div>
              <h3>In-Demand Skills in Market</h3>
              <p className="skills-subtitle">
                Derived dynamically from active job postings in MongoDB Atlas ({jobs.length} roles).
              </p>
            </div>
            <Link to="/jobs" className="analytics-link">
              Browse Roles →
            </Link>
          </div>

          {jobsLoading ? (
            <p style={{ color: "#64748b", fontSize: "14px", padding: "10px 0" }}>
              Loading market skills data...
            </p>
          ) : topInDemandSkills.length > 0 ? (
            <div className="skills-progress">
              {topInDemandSkills.map((skill) => (
                <div key={skill.name} className="skill-bar-container">
                  <div className="skill-bar-label">
                    <span>{skill.name}</span>
                    <span style={{ color: "#6d28d9" }}>
                      Required in {skill.count} of {jobs.length} jobs ({skill.percentage}%)
                    </span>
                  </div>
                  <div className="skill-bar-bg">
                    <div
                      className="skill-bar-fill"
                      style={{ width: `${skill.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#64748b", fontSize: "14px", padding: "10px 0" }}>
              No active job skills available.
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Analytics;