import "./ExperienceModal.css";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const YYYY_MM_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;
const EMPLOYMENT_TYPES = [
  "Full Time",
  "Part Time",
  "Internship",
  "Contract",
  "Freelance",
];

function ExperienceModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  isSubmitting = false,
  errorMessage = "",
}) {
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    employmentType: "Full Time",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
  });

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        jobTitle: initialData.jobTitle || "",
        company: initialData.company || "",
        employmentType: initialData.employmentType || "Full Time",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        currentlyWorking: Boolean(initialData.currentlyWorking),
        description: initialData.description || "",
      });
    } else {
      setFormData({
        jobTitle: "",
        company: "",
        employmentType: "Full Time",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        description: "",
      });
    }
    setValidationError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isEditMode = Boolean(initialData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    // Job Title validation: 2 - 100 characters
    const trimmedTitle = formData.jobTitle.trim();
    if (!trimmedTitle || trimmedTitle.length < 2) {
      setValidationError("Job title must be at least 2 characters.");
      return;
    }
    if (trimmedTitle.length > 100) {
      setValidationError("Job title cannot exceed 100 characters.");
      return;
    }

    // Company validation: 2 - 150 characters
    const trimmedCompany = formData.company.trim();
    if (!trimmedCompany || trimmedCompany.length < 2) {
      setValidationError("Company name must be at least 2 characters.");
      return;
    }
    if (trimmedCompany.length > 150) {
      setValidationError("Company name cannot exceed 150 characters.");
      return;
    }

    // Start Date: required, YYYY-MM format
    const trimmedStartDate = formData.startDate.trim();
    if (!trimmedStartDate) {
      setValidationError("Start date is required.");
      return;
    }
    if (!YYYY_MM_REGEX.test(trimmedStartDate)) {
      setValidationError("Start date must be in YYYY-MM format (e.g. 2024-05).");
      return;
    }

    // End Date handling
    let finalEndDate = "";
    if (!formData.currentlyWorking) {
      const trimmedEndDate = formData.endDate ? formData.endDate.trim() : "";
      if (trimmedEndDate) {
        if (!YYYY_MM_REGEX.test(trimmedEndDate)) {
          setValidationError("End date must be in YYYY-MM format (e.g. 2025-02).");
          return;
        }
        if (trimmedEndDate < trimmedStartDate) {
          setValidationError("End date cannot be earlier than start date.");
          return;
        }
        finalEndDate = trimmedEndDate;
      }
    }

    // Description validation: optional, max 1000 characters
    const trimmedDescription = formData.description
      ? formData.description.trim()
      : "";
    if (trimmedDescription.length > 1000) {
      setValidationError("Description cannot exceed 1000 characters.");
      return;
    }

    const payload = {
      jobTitle: trimmedTitle,
      company: trimmedCompany,
      employmentType: formData.employmentType || "Full Time",
      startDate: trimmedStartDate,
      endDate: finalEndDate,
      currentlyWorking: Boolean(formData.currentlyWorking),
      description: trimmedDescription,
    };

    if (initialData?._id) {
      payload._id = initialData._id;
    }

    onSave(payload);
  };

  return (
    <div
      className="experience-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="experience-modal-title"
    >
      <div
        className="experience-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="experience-modal-header">
          <h3 id="experience-modal-title">
            {isEditMode ? "Edit Experience" : "Add Experience"}
          </h3>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close experience modal"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="experience-modal-body">
            {(validationError || errorMessage) && (
              <div className="modal-alert-error" role="alert">
                {validationError || errorMessage}
              </div>
            )}

            {/* Job Title */}
            <div className="form-group">
              <label htmlFor="exp-jobTitle" className="form-label">
                Job Title <span className="required-star">*</span>
              </label>
              <input
                id="exp-jobTitle"
                name="jobTitle"
                type="text"
                className="form-input"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer or Software Engineering Intern"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Company */}
            <div className="form-group">
              <label htmlFor="exp-company" className="form-label">
                Company / Organization <span className="required-star">*</span>
              </label>
              <input
                id="exp-company"
                name="company"
                type="text"
                className="form-input"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. ABC Technologies or Startup Labs"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Employment Type */}
            <div className="form-group">
              <label htmlFor="exp-employmentType" className="form-label">
                Employment Type
              </label>
              <select
                id="exp-employmentType"
                name="employmentType"
                className="form-select"
                value={formData.employmentType}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="form-grid-2col">
              <div className="form-group">
                <label htmlFor="exp-startDate" className="form-label">
                  Start Date <span className="required-star">*</span>
                </label>
                <input
                  id="exp-startDate"
                  name="startDate"
                  type="month"
                  className="form-input"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="exp-endDate" className="form-label">
                  End Date
                </label>
                <input
                  id="exp-endDate"
                  name="endDate"
                  type="month"
                  className={`form-input ${
                    formData.currentlyWorking ? "form-input-disabled" : ""
                  }`}
                  value={formData.currentlyWorking ? "" : formData.endDate}
                  onChange={handleChange}
                  placeholder={formData.currentlyWorking ? "Present" : ""}
                  disabled={formData.currentlyWorking || isSubmitting}
                />
              </div>
            </div>

            {/* Currently Working Checkbox */}
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="currentlyWorking"
                checked={formData.currentlyWorking}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <span>I currently work in this role</span>
            </label>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="exp-description" className="form-label">
                Description / Key Responsibilities
              </label>
              <textarea
                id="exp-description"
                name="description"
                rows="4"
                className="form-input form-textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your responsibilities, key achievements, technologies used, or impact..."
                maxLength={1000}
                disabled={isSubmitting}
              />
              <div className="char-counter-row">
                <span className="field-hint">
                  Highlight key accomplishments and tools used (max 1000 characters).
                </span>
                <span
                  className={`char-counter ${
                    formData.description.length >= 950 ? "char-counter-warn" : ""
                  }`}
                  aria-live="polite"
                >
                  {formData.description.length} / 1000
                </span>
              </div>
            </div>
          </div>

          <div className="experience-modal-footer">
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
                "Save Experience"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExperienceModal;
