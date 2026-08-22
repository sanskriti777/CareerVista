import "./ApplyModal.css";
import { useState } from "react";
import { FaTimes, FaFileUpload, FaCheckCircle } from "react-icons/fa";
import { useApplications } from "../../context/ApplicationsContext";

function ApplyModal({ job, onClose }) {
  const { applyToJob } = useApplications();

  const [formData, setFormData] = useState({
    fullName: "Sanskriti",
    email: "sanskriti@example.com",
    notes: "",
    resumeName: "",
  });

  const [submitted, setSubmitted] = useState(false);

  if (!job) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    applyToJob(job, formData);
    setSubmitted(true);
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
          <button className="close-modal-btn" onClick={onClose}>
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
            <div className="modal-form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="modal-form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="modal-form-group">
              <label>Resume / CV</label>
              <label className="file-upload-box">
                <FaFileUpload />
                <div style={{ fontSize: "13px", color: "#475569", fontWeight: "600" }}>
                  {formData.resumeName ? `Attached: ${formData.resumeName}` : "Click to attach PDF / Word Resume"}
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
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
              ></textarea>
            </div>

            <button type="submit" className="submit-application-btn">
              Submit Application 🚀
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ApplyModal;
