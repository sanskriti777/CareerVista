import "./EducationModal.css";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

function EducationModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  isSubmitting = false,
  errorMessage = "",
}) {
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
    currentlyStudying: false,
  });

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        degree: initialData.degree || "",
        institution: initialData.institution || "",
        fieldOfStudy: initialData.fieldOfStudy || "",
        startYear: initialData.startYear ? String(initialData.startYear) : "",
        endYear: initialData.endYear ? String(initialData.endYear) : "",
        currentlyStudying: Boolean(initialData.currentlyStudying),
      });
    } else {
      setFormData({
        degree: "",
        institution: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        currentlyStudying: false,
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

    // Degree validation: 2-100 characters
    const trimmedDegree = formData.degree.trim();
    if (!trimmedDegree || trimmedDegree.length < 2) {
      setValidationError("Degree must be at least 2 characters.");
      return;
    }
    if (trimmedDegree.length > 100) {
      setValidationError("Degree cannot exceed 100 characters.");
      return;
    }

    // Institution validation: 2-150 characters
    const trimmedInstitution = formData.institution.trim();
    if (!trimmedInstitution || trimmedInstitution.length < 2) {
      setValidationError("Institution must be at least 2 characters.");
      return;
    }
    if (trimmedInstitution.length > 150) {
      setValidationError("Institution cannot exceed 150 characters.");
      return;
    }

    // Field of study: optional, max 100 characters
    const trimmedFieldOfStudy = formData.fieldOfStudy
      ? formData.fieldOfStudy.trim()
      : "";
    if (trimmedFieldOfStudy.length > 100) {
      setValidationError("Field of study cannot exceed 100 characters.");
      return;
    }

    // Start Year: integer, 1960 - 2100
    const startYearNum = Number(formData.startYear);
    if (
      !formData.startYear ||
      !Number.isInteger(startYearNum) ||
      startYearNum < 1960 ||
      startYearNum > 2100
    ) {
      setValidationError("Start year must be a valid year between 1960 and 2100.");
      return;
    }

    // End Year handling
    let finalEndYear = null;
    if (!formData.currentlyStudying) {
      if (formData.endYear !== "" && formData.endYear !== null && formData.endYear !== undefined) {
        const endYearNum = Number(formData.endYear);
        if (
          !Number.isInteger(endYearNum) ||
          endYearNum < 1960 ||
          endYearNum > 2100
        ) {
          setValidationError("End year must be a valid year between 1960 and 2100.");
          return;
        }
        if (endYearNum < startYearNum) {
          setValidationError("End year cannot be earlier than start year.");
          return;
        }
        finalEndYear = endYearNum;
      }
    }

    const payload = {
      degree: trimmedDegree,
      institution: trimmedInstitution,
      fieldOfStudy: trimmedFieldOfStudy,
      startYear: startYearNum,
      endYear: finalEndYear,
      currentlyStudying: formData.currentlyStudying,
    };

    if (initialData?._id) {
      payload._id = initialData._id;
    }

    onSave(payload);
  };

  return (
    <div
      className="education-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="education-modal-title"
    >
      <div
        className="education-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="education-modal-header">
          <h3 id="education-modal-title">
            {isEditMode ? "Edit Education" : "Add Education"}
          </h3>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close education modal"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="education-modal-body">
            {(validationError || errorMessage) && (
              <div className="modal-alert-error" role="alert">
                {validationError || errorMessage}
              </div>
            )}

            {/* Degree */}
            <div className="form-group">
              <label htmlFor="degree" className="form-label">
                Degree <span className="required-star">*</span>
              </label>
              <input
                id="degree"
                name="degree"
                type="text"
                className="form-input"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. Bachelor of Technology"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Institution */}
            <div className="form-group">
              <label htmlFor="institution" className="form-label">
                Institution / University <span className="required-star">*</span>
              </label>
              <input
                id="institution"
                name="institution"
                type="text"
                className="form-input"
                value={formData.institution}
                onChange={handleChange}
                placeholder="e.g. Stanford University or Delhi University"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Field of Study */}
            <div className="form-group">
              <label htmlFor="fieldOfStudy" className="form-label">
                Field of Study
              </label>
              <input
                id="fieldOfStudy"
                name="fieldOfStudy"
                type="text"
                className="form-input"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                placeholder="e.g. Computer Science & Engineering"
                disabled={isSubmitting}
              />
            </div>

            {/* Years */}
            <div className="form-grid-2col">
              <div className="form-group">
                <label htmlFor="startYear" className="form-label">
                  Start Year <span className="required-star">*</span>
                </label>
                <input
                  id="startYear"
                  name="startYear"
                  type="number"
                  min="1960"
                  max="2100"
                  className="form-input"
                  value={formData.startYear}
                  onChange={handleChange}
                  placeholder="YYYY (e.g. 2021)"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="endYear" className="form-label">
                  End Year
                </label>
                <input
                  id="endYear"
                  name="endYear"
                  type="number"
                  min="1960"
                  max="2100"
                  className={`form-input ${formData.currentlyStudying ? "form-input-disabled" : ""}`}
                  value={formData.currentlyStudying ? "" : formData.endYear}
                  onChange={handleChange}
                  placeholder={formData.currentlyStudying ? "Present" : "YYYY (e.g. 2025)"}
                  disabled={formData.currentlyStudying || isSubmitting}
                />
              </div>
            </div>

            {/* Currently Studying */}
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="currentlyStudying"
                checked={formData.currentlyStudying}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <span>I am currently enrolled / studying here</span>
            </label>
          </div>

          <div className="education-modal-footer">
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
                "Save Education"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EducationModal;
