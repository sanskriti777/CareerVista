import "./Applications.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFileAlt,
  FaTrashAlt,
  FaExternalLinkAlt,
  FaSearch,
} from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import Topbar from "../components/dashboard/Topbar";
import { useApplications } from "../context/ApplicationsContext";

function Applications() {
  const {
    applications,
    loading,
    error,
    withdrawApplication,
    refreshApplications,
  } = useApplications();

  const [withdrawingId, setWithdrawingId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (refreshApplications) {
      refreshApplications();
    }
  }, [refreshApplications]);

  const handleWithdraw = async (applicationId) => {
    if (!applicationId || withdrawingId) return;

    setActionError("");
    setWithdrawingId(applicationId);

    try {
      const response = await withdrawApplication(applicationId);
      if (!response || !response.success) {
        setActionError(
          response?.message || "Failed to withdraw application. Please try again."
        );
      }
    } catch (err) {
      console.error("Error withdrawing application:", err);
      setActionError("Unable to connect to server. Please try again later.");
    } finally {
      setWithdrawingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Selected":
        return {
          backgroundColor: "#ecfdf5",
          color: "#059669",
          borderColor: "#a7f3d0",
          label: "Selected 🎉",
        };
      case "Shortlisted":
        return {
          backgroundColor: "#f0fdf4",
          color: "#16a34a",
          borderColor: "#bbf7d0",
          label: "Shortlisted ⭐",
        };
      case "Under Review":
        return {
          backgroundColor: "#fffbeb",
          color: "#d97706",
          borderColor: "#fde68a",
          label: "Under Review ⏳",
        };
      case "Applied":
        return {
          backgroundColor: "#f5f3ff",
          color: "#6d28d9",
          borderColor: "#ddd6fe",
          label: "Applied ✉️",
        };
      case "Rejected":
        return {
          backgroundColor: "#fef2f2",
          color: "#dc2626",
          borderColor: "#fecaca",
          label: "Rejected ✕",
        };
      case "Submitted":
      default:
        return {
          backgroundColor: "#eff6ff",
          color: "#2563eb",
          borderColor: "#bfdbfe",
          label: "Submitted 🚀",
        };
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Recently";
    try {
      return new Date(dateValue).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <MainLayout>
      <Topbar />

      <div className="applications-page-container">
        <div className="applications-page-header">
          <h2 className="applications-title">My Applications</h2>
          <p className="applications-subtitle">
            Track your submitted job applications and their real-time status.
          </p>
        </div>

        {/* Global Error Notice */}
        {(error || actionError) && (
          <div className="applications-error-banner">
            <span>{error || actionError}</span>
            {actionError && (
              <button
                type="button"
                onClick={() => setActionError("")}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#b91c1c",
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="applications-loading-state">
            <div className="applications-loading-spinner"></div>
            <h3>Loading your applications...</h3>
          </div>
        ) : applications.length === 0 ? (
          /* Empty State */
          <div className="applications-empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>You haven't applied to any jobs yet.</h3>
            <p>
              Explore top tech roles matched to your profile and start your career journey today.
            </p>
            <Link to="/jobs" className="explore-jobs-btn">
              <FaSearch /> Explore Jobs
            </Link>
          </div>
        ) : (
          /* Applications Grid */
          <div className="applications-grid">
            {applications.map((app) => {
              const job = app.job || {};
              const jobId = job._id || job.id;
              const jobTitle = job.title || "Role Unavailable";
              const companyName = job.company || "Company";
              const location = job.location;
              const salary = job.salary;
              const jobType = job.type;
              const statusInfo = getStatusStyle(app.status);
              const appliedDate = formatDate(app.appliedAt || app.createdAt);
              const isWithdrawing = withdrawingId === app._id;
              const canWithdraw = app.status !== "Selected" && app.status !== "Rejected";

              return (
                <div className="application-card" key={app._id}>
                  <div>
                    {/* Top Row: Title, Company, Status */}
                    <div className="application-card-top">
                      <div>
                        <h3 className="application-job-title">{jobTitle}</h3>
                        <p className="application-company">{companyName}</p>
                      </div>
                      <span
                        className="application-status-badge"
                        style={{
                          backgroundColor: statusInfo.backgroundColor,
                          color: statusInfo.color,
                          borderColor: statusInfo.borderColor,
                        }}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Metadata Row: Location, Type, Salary, Date */}
                    <div className="application-meta-row">
                      {location && (
                        <span className="application-meta-item">
                          <FaMapMarkerAlt /> {location}
                        </span>
                      )}
                      {jobType && (
                        <span className="application-meta-item">
                          <FaBriefcase /> {jobType}
                        </span>
                      )}
                      {salary && (
                        <span className="application-meta-item">
                          💰 {salary}
                        </span>
                      )}
                      <span className="application-meta-item">
                        <FaCalendarAlt /> Applied {appliedDate}
                      </span>
                    </div>

                    {/* Resume info if present */}
                    {app.resumeName && (
                      <div className="application-detail-box">
                        <div className="detail-label">
                          <FaFileAlt /> Attached Resume
                        </div>
                        <div className="detail-content">{app.resumeName}</div>
                      </div>
                    )}

                    {/* Candidate Cover Note if present */}
                    {app.notes && (
                      <div className="application-detail-box">
                        <div className="detail-label">Cover Note</div>
                        <div className="detail-content">{app.notes}</div>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="application-card-footer">
                    {jobId ? (
                      <Link to={`/job/${jobId}`} className="view-job-link-btn">
                        View Job Details <FaExternalLinkAlt />
                      </Link>
                    ) : (
                      <span></span>
                    )}

                    {canWithdraw && (
                      <button
                        type="button"
                        className="withdraw-btn"
                        onClick={() => handleWithdraw(app._id)}
                        disabled={isWithdrawing}
                      >
                        <FaTrashAlt />
                        {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Applications;
