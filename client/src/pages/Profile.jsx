import "./Profile.css";
import { useState } from "react";
import {
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaExternalLinkAlt,
  FaLock,
  FaPlus,
  FaGraduationCap,
  FaCalendarAlt,
  FaBriefcase,
  FaFolderOpen,
  FaGithub,
  FaCamera,
} from "react-icons/fa";
import { useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import Topbar from "../components/dashboard/Topbar";
import ResumeScoreWidget from "../components/profile/ResumeScoreWidget";
import ProfileStrengthCard from "../components/profile/ProfileStrengthCard";
import EducationModal from "../components/profile/EducationModal";
import ExperienceModal from "../components/profile/ExperienceModal";
import ProjectModal from "../components/profile/ProjectModal";
import DeleteConfirmModal from "../components/profile/DeleteConfirmModal";
import UserAvatar from "../components/common/UserAvatar";
import { useAuth } from "../context/AuthContext";
import {
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture,
} from "../services/authService";

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
    bio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Education Modal states
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [isEducationSubmitting, setIsEducationSubmitting] = useState(false);
  const [educationErrorMessage, setEducationErrorMessage] = useState("");

  // Delete Confirmation Modal states (Education)
  const [deleteTargetEducation, setDeleteTargetEducation] = useState(null);
  const [isEducationDeleting, setIsEducationDeleting] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  // Experience Modal states
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [isExperienceSubmitting, setIsExperienceSubmitting] = useState(false);
  const [experienceErrorMessage, setExperienceErrorMessage] = useState("");

  // Delete Confirmation Modal states (Experience)
  const [deleteTargetExperience, setDeleteTargetExperience] = useState(null);
  const [isExpDeleting, setIsExpDeleting] = useState(false);
  const [deleteExpErrorMessage, setDeleteExpErrorMessage] = useState("");

  // Project Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isProjectSubmitting, setIsProjectSubmitting] = useState(false);
  const [projectErrorMessage, setProjectErrorMessage] = useState("");

  // Delete Confirmation Modal states (Project)
  const [deleteTargetProject, setDeleteTargetProject] = useState(null);
  const [isProjectDeleting, setIsProjectDeleting] = useState(false);
  const [deleteProjectErrorMessage, setDeleteProjectErrorMessage] = useState("");

  // Fresher toggle loading state
  const [isFresherToggling, setIsFresherToggling] = useState(false);

  // Avatar upload/remove states
  const fileInputRef = useRef(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isAvatarRemoving, setIsAvatarRemoving] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const handleAvatarClick = () => {
    if (isAvatarUploading || isAvatarRemoving) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    // Reset file input value so same file can be selected again
    e.target.value = "";

    if (!file) return;

    setAvatarError("");

    // Client-side validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const allowedExts = [".jpg", ".jpeg", ".png", ".webp"];

    if (!allowedTypes.includes(file.type) || !allowedExts.includes(ext)) {
      setAvatarError("Please select a valid image (.jpg, .jpeg, .png, or .webp).");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setAvatarError("Image size must be less than 3 MB.");
      return;
    }

    setIsAvatarUploading(true);
    try {
      const response = await uploadProfilePicture(file);

      if (response && response.success && response.user) {
        updateUser(response.user);
        setSuccessMessage("Profile picture updated successfully!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setAvatarError(response?.message || "Failed to upload image. Please try again.");
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
      setAvatarError("Unable to connect to server. Please try again.");
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (isAvatarUploading || isAvatarRemoving) return;

    setAvatarError("");
    setIsAvatarRemoving(true);

    try {
      const response = await deleteProfilePicture();

      if (response && response.success && response.user) {
        updateUser(response.user);
        setSuccessMessage("Profile picture removed successfully!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setAvatarError(response?.message || "Failed to remove profile picture.");
      }
    } catch (err) {
      console.error("Avatar delete error:", err);
      setAvatarError("Unable to connect to server. Please try again.");
    } finally {
      setIsAvatarRemoving(false);
    }
  };

  const userName = user?.name || "User";
  const userEmail = user?.email || "Not provided";
  const userResumeUrl = user?.resumeUrl || "";
  const userBio = user?.bio || "";
  const userSkills =
    Array.isArray(user?.skills) && user.skills.length > 0 ? user.skills : [];
  const userEducation =
    Array.isArray(user?.education) ? user.education : [];
  const userExperience =
    Array.isArray(user?.experience) ? user.experience : [];
  const userProjects =
    Array.isArray(user?.projects) ? user.projects : [];

  // Sort education entries descending by startYear for display only
  const sortedEducation = [...userEducation].sort(
    (a, b) => (Number(b.startYear) || 0) - (Number(a.startYear) || 0)
  );

  // Sort experience entries descending by startDate for display only
  const sortedExperience = [...userExperience].sort((a, b) => {
    const dateA = a?.startDate || "";
    const dateB = b?.startDate || "";
    return dateB.localeCompare(dateA);
  });

  // Date formatter for Experience: "2025-06" -> "Jun 2025"
  const formatMonthYear = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return "";
    const parts = dateStr.trim().split("-");
    if (parts.length !== 2) return dateStr;
    const [year, month] = parts;
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthIdx = parseInt(month, 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${monthNames[monthIdx]} ${year}`;
    }
    return dateStr;
  };

  const handleStartEdit = () => {
    setFormData({
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      location: user?.location ?? "",
      headline: user?.headline ?? "",
      preferredRole: user?.preferredRole ?? "",
      skills: Array.isArray(user?.skills) ? user.skills.join(", ") : "",
      resumeUrl: user?.resumeUrl ?? "",
      bio: user?.bio ?? "",
    });
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      location: user?.location ?? "",
      headline: user?.headline ?? "",
      preferredRole: user?.preferredRole ?? "",
      skills: Array.isArray(user?.skills) ? user.skills.join(", ") : "",
      resumeUrl: user?.resumeUrl ?? "",
      bio: user?.bio ?? "",
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
    setErrorMessage("");
    setSuccessMessage("");

    // Validate required full name
    if (!formData.name || !formData.name.trim()) {
      setErrorMessage("Name is required");
      return;
    }

    if (formData.name.trim().length < 2) {
      setErrorMessage("Name must be at least 2 characters long");
      return;
    }

    // Validate bio length
    if (formData.bio && formData.bio.trim().length > 1500) {
      setErrorMessage("Bio cannot exceed 1500 characters.");
      return;
    }

    setIsSubmitting(true);

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
      bio: formData.bio.trim(),
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

  // ----------------------------------------------------
  // EDUCATION HANDLERS
  // ----------------------------------------------------
  const handleOpenAddEducation = () => {
    if (userEducation.length >= 5) {
      return;
    }
    setEditingEducation(null);
    setEducationErrorMessage("");
    setIsEducationModalOpen(true);
  };

  const handleOpenEditEducation = (entry) => {
    setEditingEducation(entry);
    setEducationErrorMessage("");
    setIsEducationModalOpen(true);
  };

  const handleCloseEducationModal = () => {
    setIsEducationModalOpen(false);
    setEditingEducation(null);
    setEducationErrorMessage("");
  };

  const handleSaveEducation = async (educationData) => {
    setEducationErrorMessage("");
    setIsEducationSubmitting(true);

    let updatedEducationList;

    if (editingEducation) {
      // Edit existing entry
      updatedEducationList = userEducation.map((item) => {
        const matchesId =
          editingEducation._id && item._id === editingEducation._id;
        if (matchesId || item === editingEducation) {
          return {
            ...educationData,
            _id: editingEducation._id || item._id,
          };
        }
        return item;
      });
    } else {
      // Add new entry
      if (userEducation.length >= 5) {
        setEducationErrorMessage("You can add up to 5 education entries.");
        setIsEducationSubmitting(false);
        return;
      }
      updatedEducationList = [...userEducation, educationData];
    }

    try {
      const response = await updateProfile({ education: updatedEducationList });

      if (response && response.success && response.user) {
        updateUser(response.user);
        setIsEducationModalOpen(false);
        setEditingEducation(null);
        setSuccessMessage(
          editingEducation
            ? "Education entry updated successfully!"
            : "Education entry added successfully!"
        );
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
      } else {
        setEducationErrorMessage(
          response?.message || "Failed to save education. Please try again."
        );
      }
    } catch (err) {
      console.error("Error saving education:", err);
      setEducationErrorMessage("Unable to connect to server. Please try again.");
    } finally {
      setIsEducationSubmitting(false);
    }
  };

  const handleOpenDeleteEducation = (entry) => {
    setDeleteErrorMessage("");
    setDeleteTargetEducation(entry);
  };

  const handleConfirmDeleteEducation = async () => {
    if (!deleteTargetEducation) return;

    setIsEducationDeleting(true);
    setDeleteErrorMessage("");

    const updatedEducationList = userEducation.filter((item) => {
      if (deleteTargetEducation._id && item._id) {
        return item._id !== deleteTargetEducation._id;
      }
      return item !== deleteTargetEducation;
    });

    try {
      const response = await updateProfile({ education: updatedEducationList });

      if (response && response.success && response.user) {
        updateUser(response.user);
        setDeleteTargetEducation(null);
        setSuccessMessage("Education entry removed.");
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
      } else {
        setDeleteErrorMessage(
          response?.message || "Failed to remove education entry."
        );
      }
    } catch (err) {
      console.error("Error deleting education:", err);
      setDeleteErrorMessage("Unable to connect to server. Please try again.");
    } finally {
      setIsEducationDeleting(false);
    }
  };

  // ----------------------------------------------------
  // FRESHER STATUS HANDLER
  // ----------------------------------------------------
  const handleToggleFresher = async (e) => {
    const newStatus = e.target.checked;
    setIsFresherToggling(true);

    try {
      const response = await updateProfile({ isFresher: newStatus });

      if (response && response.success && response.user) {
        updateUser(response.user);
        setSuccessMessage(
          newStatus
            ? "Fresher status enabled! Open to entry-level opportunities."
            : "Fresher status updated."
        );
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
      } else {
        setErrorMessage(
          response?.message || "Failed to update fresher status."
        );
      }
    } catch (err) {
      console.error("Error updating fresher status:", err);
      setErrorMessage("Unable to connect to server. Please try again.");
    } finally {
      setIsFresherToggling(false);
    }
  };

  // ----------------------------------------------------
  // EXPERIENCE HANDLERS
  // ----------------------------------------------------
  const handleOpenAddExperience = () => {
    if (userExperience.length >= 10) {
      return;
    }
    setEditingExperience(null);
    setExperienceErrorMessage("");
    setIsExperienceModalOpen(true);
  };

  const handleOpenEditExperience = (entry) => {
    setEditingExperience(entry);
    setExperienceErrorMessage("");
    setIsExperienceModalOpen(true);
  };

  const handleCloseExperienceModal = () => {
    setIsExperienceModalOpen(false);
    setEditingExperience(null);
    setExperienceErrorMessage("");
  };

  const handleSaveExperience = async (experienceData) => {
    setExperienceErrorMessage("");
    setIsExperienceSubmitting(true);

    let updatedExperienceList;

    if (editingExperience) {
      // Edit existing entry
      updatedExperienceList = userExperience.map((item) => {
        const matchesId =
          editingExperience._id && item._id === editingExperience._id;
        if (matchesId || item === editingExperience) {
          const updatedItem = {
            ...experienceData,
          };
          if (editingExperience._id || item._id) {
            updatedItem._id = editingExperience._id || item._id;
          }
          return updatedItem;
        }
        return item;
      });
    } else {
      // Add new entry
      if (userExperience.length >= 10) {
        setExperienceErrorMessage("You can add up to 10 experience entries.");
        setIsExperienceSubmitting(false);
        return;
      }
      updatedExperienceList = [...userExperience, experienceData];
    }

    try {
      const response = await updateProfile({ experience: updatedExperienceList });

      if (response && response.success && response.user) {
        updateUser(response.user);
        setIsExperienceModalOpen(false);
        setEditingExperience(null);
        setSuccessMessage(
          editingExperience
            ? "Experience entry updated successfully!"
            : "Experience entry added successfully!"
        );
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
      } else {
        setExperienceErrorMessage(
          response?.message || "Failed to save experience. Please try again."
        );
      }
    } catch (err) {
      console.error("Error saving experience:", err);
      setExperienceErrorMessage("Unable to connect to server. Please try again.");
    } finally {
      setIsExperienceSubmitting(false);
    }
  };

  const handleOpenDeleteExperience = (entry) => {
    setDeleteExpErrorMessage("");
    setDeleteTargetExperience(entry);
  };

  const handleConfirmDeleteExperience = async () => {
    if (!deleteTargetExperience) return;

    setIsExpDeleting(true);
    setDeleteExpErrorMessage("");

    const updatedExperienceList = userExperience.filter((item) => {
      if (deleteTargetExperience._id && item._id) {
        return item._id !== deleteTargetExperience._id;
      }
      return item !== deleteTargetExperience;
    });

    try {
      const response = await updateProfile({ experience: updatedExperienceList });

      if (response && response.success && response.user) {
        updateUser(response.user);
        setDeleteTargetExperience(null);
        setSuccessMessage("Experience entry removed.");
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
      } else {
        setDeleteExpErrorMessage(
          response?.message || "Failed to remove experience entry."
        );
      }
    } catch (err) {
      console.error("Error deleting experience:", err);
      setDeleteExpErrorMessage("Unable to connect to server. Please try again.");
    } finally {
      setIsExpDeleting(false);
    }
  };

  // ----------------------------------------------------
  // PROJECT HANDLERS
  // ----------------------------------------------------
  const handleOpenAddProject = () => {
    if (userProjects.length >= 6) {
      return;
    }
    setEditingProject(null);
    setProjectErrorMessage("");
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (entry) => {
    setEditingProject(entry);
    setProjectErrorMessage("");
    setIsProjectModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
    setProjectErrorMessage("");
  };

  const handleSaveProject = async (projectData) => {
    setProjectErrorMessage("");
    setIsProjectSubmitting(true);

    let updatedProjectList;

    if (editingProject) {
      // Edit existing entry
      updatedProjectList = userProjects.map((item) => {
        const matchesId =
          editingProject._id && item._id === editingProject._id;
        if (matchesId || item === editingProject) {
          const updatedItem = {
            ...projectData,
          };
          if (editingProject._id || item._id) {
            updatedItem._id = editingProject._id || item._id;
          }
          return updatedItem;
        }
        return item;
      });
    } else {
      // Add new entry
      if (userProjects.length >= 6) {
        setProjectErrorMessage("You can add up to 6 projects.");
        setIsProjectSubmitting(false);
        return;
      }
      updatedProjectList = [...userProjects, projectData];
    }

    try {
      const response = await updateProfile({ projects: updatedProjectList });

      if (response && response.success && response.user) {
        updateUser(response.user);
        setIsProjectModalOpen(false);
        setEditingProject(null);
        setSuccessMessage(
          editingProject
            ? "Project updated successfully!"
            : "Project added successfully!"
        );
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
      } else {
        setProjectErrorMessage(
          response?.message || "Failed to save project. Please try again."
        );
      }
    } catch (err) {
      console.error("Error saving project:", err);
      setProjectErrorMessage("Unable to connect to server. Please try again.");
    } finally {
      setIsProjectSubmitting(false);
    }
  };

  const handleOpenDeleteProject = (entry) => {
    setDeleteProjectErrorMessage("");
    setDeleteTargetProject(entry);
  };

  const handleConfirmDeleteProject = async () => {
    if (!deleteTargetProject) return;

    setIsProjectDeleting(true);
    setDeleteProjectErrorMessage("");

    const updatedProjectList = userProjects.filter((item) => {
      if (deleteTargetProject._id && item._id) {
        return item._id !== deleteTargetProject._id;
      }
      return item !== deleteTargetProject;
    });

    try {
      const response = await updateProfile({ projects: updatedProjectList });

      if (response && response.success && response.user) {
        updateUser(response.user);
        setDeleteTargetProject(null);
        setSuccessMessage("Project removed.");
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
      } else {
        setDeleteProjectErrorMessage(
          response?.message || "Failed to remove project."
        );
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      setDeleteProjectErrorMessage("Unable to connect to server. Please try again.");
    } finally {
      setIsProjectDeleting(false);
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
                  {/* Hidden file input for avatar upload */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.webp"
                    style={{ display: "none" }}
                    aria-label="Upload profile picture"
                  />

                  <div className="profile-avatar-wrapper">
                    <div
                      className="profile-avatar-container-large"
                      onClick={handleAvatarClick}
                      title="Click to change profile picture"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleAvatarClick();
                        }
                      }}
                    >
                      <UserAvatar
                        user={user}
                        size={84}
                        className="profile-avatar-large"
                      />
                      <div className="avatar-hover-overlay">
                        <FaCamera className="avatar-hover-icon" />
                        <span>{isAvatarUploading ? "Uploading..." : "Change"}</span>
                      </div>
                    </div>

                    <div className="avatar-controls-row">
                      <button
                        type="button"
                        className="btn-avatar-action"
                        onClick={handleAvatarClick}
                        disabled={isAvatarUploading || isAvatarRemoving}
                        aria-label="Change profile picture"
                      >
                        <FaCamera style={{ fontSize: "11px" }} />
                        {isAvatarUploading ? "Uploading..." : "Change Photo"}
                      </button>

                      {user?.profilePicture && (
                        <button
                          type="button"
                          className="btn-avatar-action btn-avatar-remove"
                          onClick={handleRemoveAvatar}
                          disabled={isAvatarUploading || isAvatarRemoving}
                          aria-label="Remove profile picture"
                        >
                          <FaTrashAlt style={{ fontSize: "10px" }} />
                          {isAvatarRemoving ? "Removing..." : "Remove"}
                        </button>
                      )}
                    </div>

                    {avatarError && (
                      <span className="avatar-upload-feedback avatar-upload-error">
                        {avatarError}
                      </span>
                    )}
                  </div>

                  <div className="profile-details">
                    <h2>{userName}</h2>
                    <p>
                      {user?.headline ? (
                        user.headline
                      ) : (
                        <span className="empty-placeholder">Add a headline</span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-edit-profile"
                  onClick={handleStartEdit}
                  aria-label="Edit entire profile"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* ABOUT / BIO SECTION */}
              <div className="profile-section profile-about-section">
                <div className="section-title-row">
                  <h3>About Me</h3>
                  {!userBio && (
                    <button
                      type="button"
                      className="btn-add-inline"
                      onClick={handleStartEdit}
                      aria-label="Add About"
                    >
                      <FaPlus style={{ fontSize: "11px" }} /> Add About
                    </button>
                  )}
                </div>

                {userBio ? (
                  <div className="profile-bio-text">
                    <p>{userBio}</p>
                  </div>
                ) : (
                  <div className="profile-bio-empty">
                    <p>Tell employers a little about yourself, your background, and your career goals.</p>
                    <button
                      type="button"
                      className="btn-add-bio"
                      onClick={handleStartEdit}
                      aria-label="Add Bio"
                    >
                      <FaPlus style={{ fontSize: "12px", marginRight: "6px" }} /> Add Bio
                    </button>
                  </div>
                )}
              </div>

              {/* PERSONAL INFORMATION SECTION */}
              <div className="profile-section">
                <h3>Personal Information</h3>
                <div className="profile-info-grid">
                  <div className="info-item">
                    <span className="info-label">
                      Email Address <FaLock style={{ fontSize: "10px", marginLeft: "4px" }} title="Read-only" />
                    </span>
                    <span className="info-value">
                      {user?.email ? (
                        user.email
                      ) : (
                        <span className="empty-placeholder">Not provided</span>
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">
                      {user?.phone ? (
                        user.phone
                      ) : (
                        <span className="empty-placeholder">Not provided</span>
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Location</span>
                    <span className="info-value">
                      {user?.location ? (
                        user.location
                      ) : (
                        <span className="empty-placeholder">Not provided</span>
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Preferred Role</span>
                    <span className="info-value">
                      {user?.preferredRole ? (
                        user.preferredRole
                      ) : (
                        <span className="empty-placeholder">Not provided</span>
                      )}
                    </span>
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
                        <span className="empty-placeholder">Not provided</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* SKILLS & EXPERTISE SECTION */}
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

              {/* EDUCATION SECTION */}
              <div className="profile-section profile-education-section">
                <div className="section-title-row">
                  <div className="section-title-left">
                    <FaGraduationCap className="section-title-icon" />
                    <h3>Education</h3>
                    <span className="section-count-badge">
                      {userEducation.length} / 5
                    </span>
                  </div>

                  {userEducation.length < 5 ? (
                    <button
                      type="button"
                      className="btn-add-inline"
                      onClick={handleOpenAddEducation}
                      aria-label="Add Education entry"
                    >
                      <FaPlus style={{ fontSize: "11px" }} /> Add Education
                    </button>
                  ) : (
                    <span className="limit-notice-badge">Maximum 5 reached</span>
                  )}
                </div>

                {sortedEducation.length > 0 ? (
                  <div className="education-timeline">
                    {sortedEducation.map((edu, idx) => {
                      const dateDisplay = edu.currentlyStudying
                        ? `${edu.startYear} – Currently studying`
                        : edu.endYear
                        ? `${edu.startYear} – ${edu.endYear}`
                        : `${edu.startYear}`;

                      return (
                        <div key={edu._id || idx} className="education-item">
                          <div className="education-item-content">
                            <div className="education-item-header">
                              <div>
                                <h4 className="education-degree">{edu.degree}</h4>
                                <p className="education-institution">{edu.institution}</p>
                              </div>

                              <div className="item-action-buttons">
                                <button
                                  type="button"
                                  className="btn-action-icon btn-action-edit"
                                  onClick={() => handleOpenEditEducation(edu)}
                                  title="Edit education entry"
                                  aria-label={`Edit ${edu.degree}`}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  type="button"
                                  className="btn-action-icon btn-action-delete"
                                  onClick={() => handleOpenDeleteEducation(edu)}
                                  title="Delete education entry"
                                  aria-label={`Delete ${edu.degree}`}
                                >
                                  <FaTrashAlt />
                                </button>
                              </div>
                            </div>

                            {edu.fieldOfStudy && (
                              <p className="education-field">
                                <strong>Field of Study:</strong> {edu.fieldOfStudy}
                              </p>
                            )}

                            <span className="education-dates">
                              <FaCalendarAlt style={{ fontSize: "11px", marginRight: "5px" }} />
                              {dateDisplay}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="profile-empty-state">
                    <p>Add your education history to strengthen your profile.</p>
                    <button
                      type="button"
                      className="btn-add-cta"
                      onClick={handleOpenAddEducation}
                      aria-label="Add Education"
                    >
                      <FaPlus style={{ fontSize: "12px", marginRight: "6px" }} /> Add Education
                    </button>
                  </div>
                )}
              </div>

              {/* EXPERIENCE SECTION */}
              <div className="profile-section profile-experience-section">
                <div className="section-title-row">
                  <div className="section-title-left">
                    <FaBriefcase className="section-title-icon" />
                    <h3>Experience</h3>
                    <span className="section-count-badge">
                      {userExperience.length} / 10
                    </span>
                  </div>

                  {userExperience.length < 10 ? (
                    <button
                      type="button"
                      className="btn-add-inline"
                      onClick={handleOpenAddExperience}
                      aria-label="Add Experience entry"
                    >
                      <FaPlus style={{ fontSize: "11px" }} /> Add Experience
                    </button>
                  ) : (
                    <span className="limit-notice-badge">Maximum 10 reached</span>
                  )}
                </div>

                {/* Fresher Status Toggle */}
                <div className="fresher-toggle-card">
                  <label className="fresher-toggle-label" htmlFor="fresher-checkbox">
                    <input
                      type="checkbox"
                      id="fresher-checkbox"
                      checked={Boolean(user?.isFresher)}
                      onChange={handleToggleFresher}
                      disabled={isFresherToggling}
                    />
                    <div className="fresher-toggle-content">
                      <span className="fresher-toggle-title">
                        I am a fresher / student with no formal work experience
                      </span>
                      <span className="fresher-toggle-desc">
                        Signals that you are seeking entry-level roles and fulfills the Experience requirement for Profile Strength.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Fresher Status Banner */}
                {user?.isFresher && (
                  <div className="fresher-status-banner">
                    <div className="fresher-status-icon-wrap">
                      <FaGraduationCap className="fresher-status-icon" />
                    </div>
                    <div className="fresher-status-text">
                      <strong>Fresher — Open to entry-level opportunities</strong>
                      <p>Your profile is highlighted for entry-level roles and internships.</p>
                    </div>
                  </div>
                )}

                {sortedExperience.length > 0 ? (
                  <div className="experience-timeline">
                    {sortedExperience.map((exp, idx) => {
                      const dateDisplay = exp.currentlyWorking
                        ? `${formatMonthYear(exp.startDate)} – Present`
                        : exp.endDate
                        ? `${formatMonthYear(exp.startDate)} – ${formatMonthYear(exp.endDate)}`
                        : `${formatMonthYear(exp.startDate)}`;

                      return (
                        <div key={exp._id || idx} className="experience-item">
                          <div className="experience-item-content">
                            <div className="experience-item-header">
                              <div>
                                <h4 className="experience-title">{exp.jobTitle}</h4>
                                <p className="experience-company">{exp.company}</p>
                              </div>

                              <div className="item-action-buttons">
                                <button
                                  type="button"
                                  className="btn-action-icon btn-action-edit"
                                  onClick={() => handleOpenEditExperience(exp)}
                                  title="Edit experience entry"
                                  aria-label={`Edit ${exp.jobTitle} at ${exp.company}`}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  type="button"
                                  className="btn-action-icon btn-action-delete"
                                  onClick={() => handleOpenDeleteExperience(exp)}
                                  title="Delete experience entry"
                                  aria-label={`Delete ${exp.jobTitle} at ${exp.company}`}
                                >
                                  <FaTrashAlt />
                                </button>
                              </div>
                            </div>

                            <div className="experience-meta-row">
                              {exp.employmentType && (
                                <span className="badge-employment-type">
                                  {exp.employmentType}
                                </span>
                              )}
                              <span className="experience-dates">
                                <FaCalendarAlt style={{ fontSize: "11px", marginRight: "5px" }} />
                                {dateDisplay}
                              </span>
                            </div>

                            {exp.description && (
                              <p className="experience-desc">{exp.description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="profile-empty-state">
                    <p>
                      {user?.isFresher
                        ? "No formal work experience added. You can still add internships, freelance, or academic roles below."
                        : "Add your work or internship experience to showcase your background."}
                    </p>
                    <button
                      type="button"
                      className="btn-add-cta"
                      onClick={handleOpenAddExperience}
                      aria-label="Add Experience"
                    >
                      <FaPlus style={{ fontSize: "12px", marginRight: "6px" }} /> Add Experience
                    </button>
                  </div>
                )}
              </div>

              {/* PROJECTS SECTION */}
              <div className="profile-section profile-projects-section">
                <div className="section-title-row">
                  <div className="section-title-left">
                    <FaFolderOpen className="section-title-icon" />
                    <h3>Projects</h3>
                    <span className="section-count-badge">
                      {userProjects.length} / 6
                    </span>
                  </div>

                  {userProjects.length < 6 ? (
                    <button
                      type="button"
                      className="btn-add-inline"
                      onClick={handleOpenAddProject}
                      aria-label="Add Project"
                    >
                      <FaPlus style={{ fontSize: "11px" }} /> Add Project
                    </button>
                  ) : (
                    <span className="limit-notice-badge">Maximum 6 reached</span>
                  )}
                </div>

                {userProjects.length > 0 ? (
                  <div className="projects-grid">
                    {userProjects.map((project, idx) => (
                      <div key={project._id || idx} className="project-card">
                        <div>
                          <div className="project-card-header">
                            <h4 className="project-title">{project.name}</h4>

                            <div className="item-action-buttons">
                              <button
                                type="button"
                                className="btn-action-icon btn-action-edit"
                                onClick={() => handleOpenEditProject(project)}
                                title="Edit project"
                                aria-label={`Edit project: ${project.name}`}
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                className="btn-action-icon btn-action-delete"
                                onClick={() => handleOpenDeleteProject(project)}
                                title="Delete project"
                                aria-label={`Delete project: ${project.name}`}
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          </div>

                          <p className="project-description">{project.description}</p>

                          {Array.isArray(project.technologies) &&
                            project.technologies.length > 0 && (
                              <div className="project-tech-tags">
                                {project.technologies.map((tech) => (
                                  <span key={tech} className="tech-tag">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>

                        {(project.projectUrl || project.githubUrl) && (
                          <div className="project-links-row">
                            {project.projectUrl && (
                              <a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link"
                                aria-label={`View live project for ${project.name}`}
                              >
                                <FaExternalLinkAlt style={{ fontSize: "11px" }} /> View Project
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link"
                                aria-label={`View GitHub repository for ${project.name}`}
                              >
                                <FaGithub style={{ fontSize: "13px" }} /> GitHub
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="profile-empty-state">
                    <p>
                      <strong>No projects added yet</strong>
                      <br />
                      Showcase your academic, personal, internship, or portfolio projects.
                    </p>
                    <button
                      type="button"
                      className="btn-add-cta"
                      onClick={handleOpenAddProject}
                      aria-label="Add Project"
                    >
                      <FaPlus style={{ fontSize: "12px", marginRight: "6px" }} /> Add Project
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* EDIT MODE */
            <form onSubmit={handleSubmit} className="profile-edit-form" autoComplete="off">
              <div className="profile-header edit-header">
                <div className="profile-header-left">
                  <UserAvatar user={user} size={84} className="profile-avatar-large" />
                  <div className="profile-details">
                    <h2>Edit Profile</h2>
                    <p>Update your details, preferred role, skills, and summary</p>
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
                    <label htmlFor="profile-email-display" className="form-label">
                      Email Address <span className="read-only-badge"><FaLock /> Read-only</span>
                    </label>
                    <div
                      id="profile-email-display"
                      className="readonly-field-value"
                      aria-readonly="true"
                    >
                      {userEmail}
                    </div>
                    <span className="field-hint">Email address cannot be changed</span>
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

              {/* ABOUT / BIO EDIT SECTION */}
              <div className="profile-section">
                <h3>About Me</h3>
                <div className="form-group">
                  <label htmlFor="bio" className="form-label">
                    Summary / Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    className="form-input form-textarea"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Write a brief professional summary about your background, strengths, and what you are looking for..."
                    maxLength={1500}
                  />
                  <div className="char-counter-row">
                    <span className="field-hint">
                      Brief overview of your experience and interests (minimum 30 characters recommended for Profile Strength).
                    </span>
                    <span
                      className={`char-counter ${
                        formData.bio.length >= 1450 ? "char-counter-warn" : ""
                      }`}
                      aria-live="polite"
                    >
                      {formData.bio.length} / 1500
                    </span>
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

        <ProfileStrengthCard
          user={user}
          onEditProfile={handleStartEdit}
          onAddEducation={handleOpenAddEducation}
          onAddExperience={handleOpenAddExperience}
          onAddProject={handleOpenAddProject}
        />

        <ResumeScoreWidget />

        {/* Education Add/Edit Modal */}
        <EducationModal
          isOpen={isEducationModalOpen}
          onClose={handleCloseEducationModal}
          onSave={handleSaveEducation}
          initialData={editingEducation}
          isSubmitting={isEducationSubmitting}
          errorMessage={educationErrorMessage}
        />

        {/* Delete Confirmation Modal (Education) */}
        <DeleteConfirmModal
          isOpen={Boolean(deleteTargetEducation)}
          title="Remove Education"
          message="Remove this education entry?"
          itemPreview={
            deleteTargetEducation
              ? `${deleteTargetEducation.degree} at ${deleteTargetEducation.institution}`
              : ""
          }
          onConfirm={handleConfirmDeleteEducation}
          onCancel={() => {
            setDeleteTargetEducation(null);
            setDeleteErrorMessage("");
          }}
          isDeleting={isEducationDeleting}
          errorMessage={deleteErrorMessage}
        />

        {/* Experience Add/Edit Modal */}
        <ExperienceModal
          isOpen={isExperienceModalOpen}
          onClose={handleCloseExperienceModal}
          onSave={handleSaveExperience}
          initialData={editingExperience}
          isSubmitting={isExperienceSubmitting}
          errorMessage={experienceErrorMessage}
        />

        {/* Delete Confirmation Modal (Experience) */}
        <DeleteConfirmModal
          isOpen={Boolean(deleteTargetExperience)}
          title="Remove Experience"
          message="Remove this experience entry?"
          itemPreview={
            deleteTargetExperience
              ? `${deleteTargetExperience.jobTitle} at ${deleteTargetExperience.company}`
              : ""
          }
          onConfirm={handleConfirmDeleteExperience}
          onCancel={() => {
            setDeleteTargetExperience(null);
            setDeleteExpErrorMessage("");
          }}
          isDeleting={isExpDeleting}
          errorMessage={deleteExpErrorMessage}
        />

        {/* Project Add/Edit Modal */}
        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={handleCloseProjectModal}
          onSave={handleSaveProject}
          initialData={editingProject}
          isSubmitting={isProjectSubmitting}
          errorMessage={projectErrorMessage}
        />

        {/* Delete Confirmation Modal (Project) */}
        <DeleteConfirmModal
          isOpen={Boolean(deleteTargetProject)}
          title="Remove Project"
          message="Remove this project?"
          itemPreview={deleteTargetProject ? deleteTargetProject.name : ""}
          onConfirm={handleConfirmDeleteProject}
          onCancel={() => {
            setDeleteTargetProject(null);
            setDeleteProjectErrorMessage("");
          }}
          isDeleting={isProjectDeleting}
          errorMessage={deleteProjectErrorMessage}
        />
      </div>
    </MainLayout>
  );
}

export default Profile;