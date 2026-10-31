import "./ProfileStrengthCard.css";
import { useMemo } from "react";
import {
  FaCheckCircle,
  FaRegCircle,
  FaArrowRight,
  FaAward,
  FaLayerGroup,
  FaLightbulb,
} from "react-icons/fa";
import { calculateProfileStrength, MAX_POINTS } from "../../utils/profileStrength";

const FIELD_METADATA = {
  name: { label: "Add your full name", category: "identity", action: "edit" },
  email: { label: "Provide a valid email address", category: "identity", action: "edit" },
  phone: { label: "Add a contact phone number", category: "identity", action: "edit" },
  location: { label: "Add your location / city", category: "identity", action: "edit" },
  headline: { label: "Add a professional headline", category: "professional", action: "edit" },
  preferredRole: { label: "Specify your target / preferred role", category: "professional", action: "edit" },
  bio: { label: "Write a summary bio (at least 30 characters)", category: "professional", action: "edit" },
  skills: { label: "Add technical skills (5+ skills for full points)", category: "technical", action: "edit" },
  projects: { label: "Showcase at least one project", category: "technical", action: "project" },
  resumeUrl: { label: "Add a link to your resume (HTTP/HTTPS URL)", category: "technical", action: "edit" },
  education: { label: "Add your education history", category: "history", action: "education" },
  experience: { label: "Add work experience or mark yourself as fresher", category: "history", action: "experience" },
};

function ProfileStrengthCard({
  user,
  onEditProfile,
  onAddEducation,
  onAddExperience,
  onAddProject,
}) {
  const strength = useMemo(() => {
    return calculateProfileStrength(user);
  }, [user]);

  const { score, milestone, breakdown, missing } = strength;

  const getMilestoneTheme = (tier) => {
    switch (tier) {
      case "All-Star Profile":
        return {
          textColor: "#15803d",
          bgColor: "#f0fdf4",
          borderColor: "#bbf7d0",
          barColor: "#16a34a",
        };
      case "Advanced Profile":
        return {
          textColor: "#6d28d9",
          bgColor: "#f5f3ff",
          borderColor: "#ddd6fe",
          barColor: "#7c3aed",
        };
      case "Intermediate":
        return {
          textColor: "#1d4ed8",
          bgColor: "#eff6ff",
          borderColor: "#bfdbfe",
          barColor: "#2563eb",
        };
      case "Basic Profile":
        return {
          textColor: "#b45309",
          bgColor: "#fffbeb",
          borderColor: "#fde68a",
          barColor: "#d97706",
        };
      case "Getting Started":
      default:
        return {
          textColor: "#475569",
          bgColor: "#f8fafc",
          borderColor: "#e2e8f0",
          barColor: "#64748b",
        };
    }
  };

  const theme = getMilestoneTheme(milestone);

  // Group breakdown points into 4 logical student-friendly categories
  const categories = [
    {
      id: "identity",
      title: "Identity & Contact",
      earned:
        (breakdown.name || 0) +
        (breakdown.email || 0) +
        (breakdown.phone || 0) +
        (breakdown.location || 0),
      max:
        MAX_POINTS.name +
        MAX_POINTS.email +
        MAX_POINTS.phone +
        MAX_POINTS.location, // 20
      description: "Name, email, phone, and city",
    },
    {
      id: "professional",
      title: "Professional Positioning",
      earned:
        (breakdown.headline || 0) +
        (breakdown.preferredRole || 0) +
        (breakdown.bio || 0),
      max: MAX_POINTS.headline + MAX_POINTS.preferredRole + MAX_POINTS.bio, // 20
      description: "Headline, target role, and bio summary",
    },
    {
      id: "technical",
      title: "Technical Profile",
      earned:
        (breakdown.skills || 0) +
        (breakdown.projects || 0) +
        (breakdown.resumeUrl || 0),
      max: MAX_POINTS.skills + MAX_POINTS.projects + MAX_POINTS.resumeUrl, // 35
      description: "Skills (5+), portfolio projects, and resume link",
    },
    {
      id: "history",
      title: "Career History",
      earned: (breakdown.education || 0) + (breakdown.experience || 0),
      max: MAX_POINTS.education + MAX_POINTS.experience, // 25
      description: "Degrees, institutions, and work experience/fresher status",
    },
  ];

  const handleActionClick = (actionType) => {
    if (actionType === "education" && onAddEducation) {
      onAddEducation();
    } else if (actionType === "experience" && onAddExperience) {
      onAddExperience();
    } else if (actionType === "project" && onAddProject) {
      onAddProject();
    } else if (onEditProfile) {
      onEditProfile();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="profile-strength-card" aria-labelledby="profile-strength-title">
      {/* Header */}
      <div className="strength-card-header">
        <div className="strength-header-left">
          <div className="strength-header-icon" aria-hidden="true">
            <FaAward />
          </div>
          <div>
            <h3 id="profile-strength-title">Profile Strength</h3>
            <p className="strength-card-subtitle">
              How complete your career profile is across identity, positioning, skills, and history.
            </p>
          </div>
        </div>

        <div
          className="strength-milestone-badge"
          style={{
            backgroundColor: theme.bgColor,
            color: theme.textColor,
            borderColor: theme.borderColor,
          }}
        >
          <span className="strength-badge-tier">{milestone}</span>
        </div>
      </div>

      {/* Progress Bar & Numeric Score */}
      <div className="strength-score-row">
        <div className="strength-score-number" style={{ color: theme.barColor }}>
          {score}
          <span className="strength-score-percent">%</span>
        </div>

        <div className="strength-progress-wrapper">
          <div className="strength-progress-meta">
            <span className="strength-progress-label">Completeness</span>
            <span className="strength-progress-status">
              {score === 100
                ? "Profile 100% Complete"
                : `${score} of 100 points earned`}
            </span>
          </div>

          <div
            className="strength-progress-track"
            role="progressbar"
            aria-label="Profile Strength progress"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="strength-progress-fill"
              style={{
                width: `${score}%`,
                backgroundColor: theme.barColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* 4-Category Breakdown Grid */}
      <div className="strength-breakdown-section">
        <div className="strength-section-label">
          <FaLayerGroup aria-hidden="true" />
          <span>Category Breakdown</span>
        </div>

        <div className="strength-categories-grid">
          {categories.map((cat) => {
            const catPercent = cat.max > 0 ? Math.round((cat.earned / cat.max) * 100) : 0;
            const isCategoryComplete = cat.earned === cat.max;

            return (
              <div key={cat.id} className="strength-category-box">
                <div className="category-box-top">
                  <div className="category-title-group">
                    {isCategoryComplete ? (
                      <FaCheckCircle className="cat-check-icon complete" aria-hidden="true" />
                    ) : (
                      <FaRegCircle className="cat-check-icon pending" aria-hidden="true" />
                    )}
                    <span className="category-title">{cat.title}</span>
                  </div>
                  <span className="category-points">
                    <strong>{cat.earned}</strong> / {cat.max} pts
                  </span>
                </div>

                <div className="category-mini-track">
                  <div
                    className="category-mini-fill"
                    style={{
                      width: `${catPercent}%`,
                      backgroundColor: isCategoryComplete ? "#16a34a" : theme.barColor,
                    }}
                  />
                </div>

                <p className="category-desc">{cat.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Missing Recommendations */}
      <div className="strength-recommendations-section">
        <div className="strength-section-label">
          <FaLightbulb aria-hidden="true" />
          <span>
            {missing.length === 0
              ? "All Profile Milestones Achieved"
              : "Recommended Steps to Strengthen Your Profile"}
          </span>
        </div>

        {missing.length === 0 ? (
          <div className="strength-complete-banner">
            <FaCheckCircle className="complete-icon" aria-hidden="true" />
            <div>
              <h4>Outstanding job!</h4>
              <p>Your profile is fully complete. Recruiters and career recommendations have maximum information to match opportunities.</p>
            </div>
          </div>
        ) : (
          <div className="strength-missing-list">
            {missing.map((key) => {
              const meta = FIELD_METADATA[key] || {
                label: `Add ${key}`,
                action: "edit",
              };

              return (
                <div key={key} className="strength-missing-item">
                  <div className="missing-item-left">
                    <FaRegCircle className="missing-circle-icon" aria-hidden="true" />
                    <span className="missing-item-text">{meta.label}</span>
                  </div>

                  <button
                    type="button"
                    className="btn-strength-action"
                    onClick={() => handleActionClick(meta.action)}
                    aria-label={`Action: ${meta.label}`}
                  >
                    Complete <FaArrowRight style={{ fontSize: "10px", marginLeft: "4px" }} aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProfileStrengthCard;
