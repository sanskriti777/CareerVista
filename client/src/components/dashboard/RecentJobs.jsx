import "./RecentJobs.css";
import { useNavigate } from "react-router-dom";
import { useApplications } from "../../context/ApplicationsContext";

function RecentJobs({ jobs = [], loading = false }) {
  const { applications, loading: applicationsLoading } = useApplications();
  const navigate = useNavigate();

  const getStatusStyle = (status) => {
    switch (status) {
      case "Selected":
        return { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0" };
      case "Shortlisted":
        return { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" };
      case "Under Review":
        return { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
      case "Applied":
        return { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" };
      case "Rejected":
        return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
      case "Submitted":
      default:
        return { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" };
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Recently";
    try {
      return new Date(dateValue).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const hasApplications = Array.isArray(applications) && applications.length > 0;
  const recentApplications = hasApplications
    ? [...applications]
        .sort(
          (a, b) =>
            new Date(b.appliedAt || b.createdAt) -
            new Date(a.appliedAt || a.createdAt)
        )
        .slice(0, 4)
    : [];

  const recentJobsList = Array.isArray(jobs) ? jobs.slice(0, 4) : [];

  return (
    <div className="recent-jobs">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>
          {hasApplications ? "Recent Applications" : "Recent Jobs"}
        </h2>
        {hasApplications ? (
          <button
            type="button"
            onClick={() => navigate("/applications")}
            style={{
              background: "transparent",
              border: "none",
              color: "#6d28d9",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            View All ({applications.length}) →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/jobs")}
            style={{
              background: "transparent",
              border: "none",
              color: "#6d28d9",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Explore All →
          </button>
        )}
      </div>

      {applicationsLoading || loading ? (
        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            textAlign: "center",
            padding: "20px 0",
          }}
        >
          Loading recent activity...
        </p>
      ) : hasApplications ? (
        recentApplications.map((app) => {
          const job = app.job || {};
          const statusStyle = getStatusStyle(app.status);
          const appliedDate = formatDate(app.appliedAt || app.createdAt);

          return (
            <div
              className="job-item"
              key={app._id}
              onClick={() => navigate("/applications")}
              style={{ cursor: "pointer" }}
              title="View in Applications"
            >
              <div className="job-item-details">
                <h4>{job.title || "Role"}</h4>
                <p>{job.company || "Company"}</p>
                <span>Applied {appliedDate}</span>
              </div>

              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.color,
                  border: `1px solid ${statusStyle.border}`,
                  whiteSpace: "nowrap",
                }}
              >
                {app.status || "Submitted"}
              </span>
            </div>
          );
        })
      ) : recentJobsList.length > 0 ? (
        recentJobsList.map((job) => (
          <div
            className="job-item"
            key={job._id || job.id}
            onClick={() => navigate(`/job/${job._id || job.id}`)}
            style={{ cursor: "pointer" }}
            title="View Job Details"
          >
            <div className="job-item-details">
              <h4>{job.title}</h4>
              <p>{job.company}</p>
              <span>
                {job.location} • {job.type}
              </span>
            </div>

            <span
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#0f172a",
                whiteSpace: "nowrap",
              }}
            >
              {job.salary}
            </span>
          </div>
        ))
      ) : (
        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            textAlign: "center",
            padding: "20px 0",
          }}
        >
          No jobs or applications found.
        </p>
      )}
    </div>
  );
}

export default RecentJobs;