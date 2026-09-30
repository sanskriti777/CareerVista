import "./Profile.css";
import { useState } from "react";
import {
  FaEdit,
  FaCheckCircle,
  FaExclamationCircle,
  FaExternalLinkAlt,
  FaLock,
} from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import Topbar from "../components/dashboard/Topbar";
import ResumeScoreWidget from "../components/profile/ResumeScoreWidget";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/authService";

function Profile() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    headline: "",
    preferredRole: "",
    skills: "",
    resumeUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const avatarInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const userName = user?.name || "User";
  const userHeadline = user?.headline || "Add a headline";
  const userEmail = user?.email || "Not provided";
  const userPhone = user?.phone || "Not provided";
  const userLocation = user?.location || "Not provided";
  const userPreferredRole = user?.preferredRole || "Not provided";
  const userResumeUrl = user?.resumeUrl || "";
  const userSkills =
    Array.isArray(user?.skills) && user.skills.length > 0 ? user.skills : [];

  const handleStartEdit = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      location: user?.location || "",
      headline: user?.headline || "",
      preferredRole: user?.preferredRole || "",
      skills: Array.isArray(user?.skills) ? user.skills.join(", ") : "",
      resumeUrl: user?.resumeUrl || "",
    });
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      location: user?.location || "",
      headline: user?.headline || "",
      preferredRole: user?.preferredRole || "",
      skills: Array.isArray(user?.skills) ? user.skills.join(", ") : "",
      resumeUrl: user?.resumeUrl || "",
    });
    setErrorMessage("");
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Process skills: convert comma-separated string to trimmed array, omit empties, deduplicate
    const cleanedSkills = Array.from(
      new Set(
        formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      )
    );

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      headline: formData.headline.trim(),
      preferredRole: formData.preferredRole.trim(),
      skills: cleanedSkills,
      resumeUrl: formData.resumeUrl.trim(),
    };

    try {
      const response = await updateProfile(payload);

      if (response && response.success && response.user) {
        updateUser(response.user);
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
      } else {
        setErrorMessage(
          response?.message || "Failed to update profile. Please try again."
        );
      }
    } catch (err) {
      console.error("Profile submit error:", err);
      setErrorMessage("An unexpected error occurred while saving profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Topbar />

      <div className="profile-page-container">
        {successMessage && (
          <div className="profile-alert profile-alert-success" role="alert">
            <FaCheckCircle className="alert-icon" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="profile-card">
          {!isEditing ? (
            /* VIEW MODE */
            <>
              <div className="profile-header">
                <div className="profile-header-left">
                  <div className="profile-avatar-large">{avatarInitial}</div>
                  <div className="profile-details">
                    <h2>{userName}</h2>
                    <p>{userHeadline}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-edit-profile"
                  onClick={handleStartEdit}
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="profile-section">
                <h3>Personal Information</h3>
                <div className="profile-info-grid">
                  <div className="info-item">
                    <span className="info-label">
                      Email Address <FaLock style={{ fontSize: "10px", marginLeft: "4px" }} title="Read-only" />
                    </span>
                    <span className="info-value">{userEmail}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{userPhone}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Location</span>
                    <span className="info-value">{userLocation}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Preferred Role</span>
                    <span className="info-value">{userPreferredRole}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Resume URL</span>
                    <span className="info-value">
                      {userResumeUrl ? (
                        <a
                          href={userResumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="profile-resume-link"
                        >
                          View Resume <FaExternalLinkAlt style={{ fontSize: "11px", marginLeft: "4px" }} />
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Skills & Expertise</h3>
                <div className="profile-skills-wrap">
                  {userSkills.length > 0 ? (
                    userSkills.map((skill) => (
                      <span key={skill} className="profile-skill-badge">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="no-skills-msg">No skills added yet</span>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* EDIT MODE */
            <form onSubmit={handleSubmit} className="profile-edit-form">
              <div className="profile-header edit-header">
                <div className="profile-header-left">
                  <div className="profile-avatar-large">{avatarInitial}</div>
                  <div className="profile-details">
                    <h2>Edit Profile</h2>
                    <p>Update your details, preferred role, skills, and links</p>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="profile-alert profile-alert-error" role="alert">
                  <FaExclamationCircle className="alert-icon" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="profile-section">
                <h3>Basic Information</h3>
                <div className="profile-edit-grid">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name <span className="required-star">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Morgan"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="headline" className="form-label">
                      Professional Headline
                    </label>
                    <input
                      id="headline"
                      name="headline"
                      type="text"
                      className="form-input"
                      value={formData.headline}
                      onChange={handleChange}
                      placeholder="e.g. Senior Frontend Engineer | React & TypeScript"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address <span className="read-only-badge"><FaLock /> Read-only</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-input form-input-disabled"
                      value={userEmail}
                      disabled
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="form-input"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +1 (555) 123-4567"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="location" className="form-label">
                      Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      className="form-input"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. San Francisco, CA or Remote"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="preferredRole" className="form-label">
                      Preferred Role
                    </label>
                    <input
                      id="preferredRole"
                      name="preferredRole"
                      type="text"
                      className="form-input"
                      value={formData.preferredRole}
                      onChange={handleChange}
                      placeholder="e.g. Full Stack Developer"
                    />
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Skills & Resume</h3>
                <div className="profile-edit-full">
                  <div className="form-group">
                    <label htmlFor="skills" className="form-label">
                      Skills (comma-separated)
                    </label>
                    <input
                      id="skills"
                      name="skills"
                      type="text"
                      className="form-input"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g. React, JavaScript, Node.js, TypeScript, MongoDB"
                    />
                    <span className="field-hint">
                      Separate each skill with a comma. Duplicate entries will be automatically cleaned.
                    </span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="resumeUrl" className="form-label">
                      Resume URL / Portfolio Link
                    </label>
                    <input
                      id="resumeUrl"
                      name="resumeUrl"
                      type="url"
                      className="form-input"
                      value={formData.resumeUrl}
                      onChange={handleChange}
                      placeholder="e.g. https://example.com/my-resume.pdf"
                    />
                    <span className="field-hint">
                      Provide a direct link to your hosted resume, portfolio, or LinkedIn document.
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-inline"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <ResumeScoreWidget />
      </div>
    </MainLayout>
  );
}

export default Profile;