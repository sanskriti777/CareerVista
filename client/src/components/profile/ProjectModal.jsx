import "./ProjectModal.css";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const isValidHttpUrl = (str) => {
  if (typeof str !== "string") return false;
  const trimmed = str.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

function ProjectModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  isSubmitting = false,
  errorMessage = "",
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technologies: "",
    projectUrl: "",
    githubUrl: "",
  });

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        technologies: Array.isArray(initialData.technologies)
          ? initialData.technologies.join(", ")
          : "",
        projectUrl: initialData.projectUrl || "",
        githubUrl: initialData.githubUrl || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        technologies: "",
        projectUrl: "",
        githubUrl: "",
      });
    }
    setValidationError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isEditMode = Boolean(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Parse technology pills for live preview
  const parsedTechnologies = Array.from(
    new Set(
      formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    )
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    // Project Name validation: 2 - 120 characters
    const trimmedName = formData.name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setValidationError("Project name is required and must be at least 2 characters.");
      return;
    }
    if (trimmedName.length > 120) {
      setValidationError("Project name cannot exceed 120 characters.");
      return;
    }

    // Description validation: 10 - 600 characters
    const trimmedDescription = formData.description.trim();
    if (!trimmedDescription || trimmedDescription.length < 10) {
      setValidationError("Project description is required and must be at least 10 characters.");
      return;
    }
    if (trimmedDescription.length > 600) {
      setValidationError("Project description cannot exceed 600 characters.");
      return;
    }

    // Technologies normalization: trim, remove empty, remove duplicates
    const normalizedTechnologies = Array.from(
      new Set(
        formData.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech.length > 0)
      )
    );

    // Project URL validation
    const trimmedProjectUrl = formData.projectUrl ? formData.projectUrl.trim() : "";
    if (trimmedProjectUrl && !isValidHttpUrl(trimmedProjectUrl)) {
      setValidationError("Project URL must be a valid HTTP or HTTPS address.");
      return;
    }

    // GitHub URL validation
    const trimmedGithubUrl = formData.githubUrl ? formData.githubUrl.trim() : "";
    if (trimmedGithubUrl && !isValidHttpUrl(trimmedGithubUrl)) {
      setValidationError("GitHub URL must be a valid HTTP or HTTPS address.");
      return;
    }

    const payload = {
      name: trimmedName,
      description: trimmedDescription,
      technologies: normalizedTechnologies,
      projectUrl: trimmedProjectUrl,
      githubUrl: trimmedGithubUrl,
    };

    if (initialData?._id) {
      payload._id = initialData._id;
    }

    onSave(payload);
  };

  return (
    <div
      className="project-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className="project-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="project-modal-header">
          <h3 id="project-modal-title">
            {isEditMode ? "Edit Project" : "Add Project"}
          </h3>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close project modal"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="project-modal-body">
            {(validationError || errorMessage) && (
              <div className="modal-alert-error" role="alert">
                {validationError || errorMessage}
              </div>
            )}

            {/* Project Name */}
            <div className="form-group">
              <label htmlFor="proj-name" className="form-label">
                Project Name <span className="required-star">*</span>
              </label>
              <input
                id="proj-name"
                name="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. CareerVista - Job Recommendation Engine"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="proj-description" className="form-label">
                Description <span className="required-star">*</span>
              </label>
              <textarea
                id="proj-description"
                name="description"
                rows="4"
                className="form-input form-textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what the project does, key features, architecture, and impact (minimum 10 characters)..."
                maxLength={600}
                required
                disabled={isSubmitting}
              />
              <div className="char-counter-row">
                <span className="field-hint">
                  Minimum 10 characters, maximum 600 characters.
                </span>
                <span
                  className={`char-counter ${
                    formData.description.length >= 570 ? "char-counter-warn" : ""
                  }`}
                  aria-live="polite"
                >
                  {formData.description.length} / 600
                </span>
              </div>
            </div>

            {/* Technologies */}
            <div className="form-group">
              <label htmlFor="proj-technologies" className="form-label">
                Technologies (comma-separated)
              </label>
              <input
                id="proj-technologies"
                name="technologies"
                type="text"
                className="form-input"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind CSS"
                disabled={isSubmitting}
              />
              <span className="field-hint">
                Separate technologies with commas. Empty entries and duplicates are automatically cleaned.
              </span>

              {parsedTechnologies.length > 0 && (
                <div className="tech-preview-container">
                  {parsedTechnologies.map((tech) => (
                    <span key={tech} className="tech-pill-preview">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Project URL */}
            <div className="form-group">
              <label htmlFor="proj-projectUrl" className="form-label">
                Live Demo / Project URL
              </label>
              <input
                id="proj-projectUrl"
                name="projectUrl"
                type="url"
                className="form-input"
                value={formData.projectUrl}
                onChange={handleChange}
                placeholder="e.g. https://my-cool-project.com"
                disabled={isSubmitting}
              />
              <span className="field-hint">
                Optional. Direct link to live demo or hosted application (must start with http:// or https://).
              </span>
            </div>

            {/* GitHub URL */}
            <div className="form-group">
              <label htmlFor="proj-githubUrl" className="form-label">
                GitHub Repository URL
              </label>
              <input
                id="proj-githubUrl"
                name="githubUrl"
                type="url"
                className="form-input"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="e.g. https://github.com/username/project-repo"
                disabled={isSubmitting}
              />
              <span className="field-hint">
                Optional. Direct link to public GitHub repository (must start with http:// or https://).
              </span>
            </div>
          </div>

          <div className="project-modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
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
                "Save Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;
