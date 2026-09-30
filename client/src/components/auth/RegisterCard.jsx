import "./RegisterCard.css";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import { registerUser } from "../../services/registerService";
import { validateRegister } from "../../utils/validation";

function RegisterCard() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    setServerError("");
    setSuccessMessage("");

    const validationErrors = validateRegister(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await registerUser(formData);

      if (response?.success) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setServerError(response?.message || "Registration failed. Please try again.");
        setIsSubmitting(false);
      }
    } catch {
      setServerError("Unable to connect to server. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Left Hero Branding Side-Panel for Desktop */}
        <div className="register-hero-panel">
          <img src={logo} alt="CareerVista Logo" className="register-hero-logo" />
          <h2>Join the Future of Career Growth</h2>
          <p>Create your account to unlock AI job matching, resume insights, and market analytics.</p>
        </div>

        {/* Right Form Container */}
        <div className="register-form-panel">
          <img src={logo} alt="CareerVista Logo" className="register-logo-mobile" />

          <h1>Create Account</h1>
          <p className="register-subtitle">Join CareerVista today.</p>

          {/* Inline Success Banner */}
          {successMessage && (
            <div
              className="success-banner"
              style={{
                marginBottom: "14px",
                padding: "10px 14px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {successMessage}
            </div>
          )}

          {/* Server Error Banner */}
          {serverError && (
            <p className="error-text" style={{ marginBottom: "12px", textAlign: "center" }}>
              {serverError}
            </p>
          )}

          {/* Name Field */}
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          {errors.name && <p className="error-text">{errors.name}</p>}

          {/* Email Field */}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <p className="error-text">{errors.email}</p>}

          {/* Password Field */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}

          {/* Confirm Password Field with Independent Toggle */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              title={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
          )}

          <button
            className="register-btn"
            onClick={handleRegister}
            disabled={isSubmitting}
            style={isSubmitting ? { opacity: 0.75, cursor: "not-allowed" } : {}}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          <p className="login-link">
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterCard;