import "./ApplyModal.css";
import { useState, useEffect } from "react";
import { FaTimes, FaFileUpload } from "react-icons/fa";
import { useApplications } from "../../context/ApplicationsContext";
import { useAuth } from "../../context/AuthContext";

function ApplyModal({ job, onClose }) {
  const { applyToJob } = useApplications();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    notes: "",
    resumeName: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Populate user info if user loaded asynchronously
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  if (!job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      const result = await applyToJob(job, formData);

      if (result && result.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(
          result?.message || "Unable to submit application. Please try again."
        );
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        resumeName: e.target.files[0].name,
      }));
    }
  };

  return (
    <div className="apply-modal-overlay" onClick={onClose}>
      <div className="apply-modal" onClick={(e) => e.stopPropagation()}>
        <div className="apply-modal-header">
          <div>
            <h2>Apply for Role</h2>
            <p>{job.title} at {job.company}</p>
          </div>
          <button className="close-modal-btn" onClick={onClose} disabled={submitting}>
            <FaTimes />
          </button>
        </div>

        {submitted ? (
          <div className="application-success-view">
            <div className="success-icon">🎉</div>
            <h2>Application Submitted!</h2>
            <p style={{ color: "#64748b", margin: "10px 0 20px" }}>
              Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been successfully submitted and tracked on your dashboard.
            </p>
            <button className="submit-application-btn" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {errorMessage && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  marginBottom: "16px",
                  fontWeight: "500",
                }}
              >
                {errorMessage}
              </div>
            )}

            <div className="modal-form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={submitting}
              />
            </div>

            <div className="modal-form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={submitting}
              />
            </div>

            <div className="modal-form-group">
              <label>Resume / CV</label>
              <label
                className="file-upload-box"
                style={submitting ? { pointerEvents: "none", opacity: 0.7 } : {}}
              >
                <FaFileUpload />
                <div style={{ fontSize: "13px", color: "#475569", fontWeight: "600" }}>
                  {formData.resumeName ? `Attached: ${formData.resumeName}` : "Click to attach PDF / Word Resume"}
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  disabled={submitting}
                />
              </label>
            </div>

            <div className="modal-form-group">
              <label>Cover Note / Message to Recruiter (Optional)</label>
              <textarea
                rows="3"
                placeholder="Briefly describe why you are a great fit..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={submitting}
              ></textarea>
            </div>

            <button
              type="submit"
              className="submit-application-btn"
              disabled={submitting}
              style={submitting ? { opacity: 0.7, cursor: "not-allowed" } : {}}
            >
              {submitting ? "Submitting..." : "Submit Application 🚀"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ApplyModal;
