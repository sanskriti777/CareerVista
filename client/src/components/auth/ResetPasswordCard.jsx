import { useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaArrowLeft,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./ResetPasswordCard.css";
import logo from "../../assets/logo.png";
import { resetPassword } from "../../services/authService";
import { validateResetPassword } from "../../utils/validation";

function ResetPasswordCard() {
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = paramToken || searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Live password checklist rules
  const rules = {
    length: password.length >= 8 && password.length <= 72,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

  const handleReset = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    setServerError("");

    if (!token) {
      setServerError(
        "Password reset token is missing from the link. Please request a new reset email."
      );
      return;
    }

    const validationErrors = validateResetPassword(password, confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await resetPassword(token, password);

      if (response && response.success) {
        setIsSuccess(true);
      } else {
        setServerError(
          response?.message ||
            "Failed to reset password. The token may be expired or already used."
        );
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        {/* Left Hero Branding Side-Panel */}
        <div className="reset-hero-panel">
          <img src={logo} alt="CareerVista Logo" className="reset-hero-logo" />
          <h2>Create a New Password</h2>
          <p>
            Choose a strong, unique password to safeguard your CareerVista account,
            job applications, and personal career data.
          </p>

          <div className="security-reassurance-badge">
            <span>Security Best Practice</span>
            <ul>
              <li>Use a combination of upper &amp; lower case letters</li>
              <li>Include numbers and special symbols</li>
              <li>Do not reuse passwords from other services</li>
            </ul>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="reset-form-panel">
          <img src={logo} alt="CareerVista Logo" className="reset-logo-mobile" />

          <h1>Reset Password</h1>
          <p className="reset-subtitle">
            Enter your new password below to complete the account recovery process.
          </p>

          {!token ? (
            <div className="reset-error-box">
              <h3>
                <FaExclamationTriangle /> Invalid Reset Link
              </h3>
              <p>
                No password reset token was detected in this link. Please request a new password reset email.
              </p>
              <Link to="/forgot-password" className="reset-btn" style={{ textDecoration: "none", textAlign: "center" }}>
                Request New Reset Link
              </Link>
            </div>
          ) : isSuccess ? (
            <div className="reset-success-box">
              <h3>
                <FaCheckCircle /> Password Reset Complete!
              </h3>
              <p>
                Your password has been successfully updated. You can now sign in using your new credentials.
              </p>
              <button
                type="button"
                className="reset-btn"
                onClick={() => navigate("/login")}
              >
                Proceed to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} noValidate>
              {serverError && (
                <p className="error-text" style={{ marginBottom: "14px", textAlign: "left" }}>
                  {serverError}
                </p>
              )}

              {/* New Password */}
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  id="reset-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password (min 8 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <p className="error-text">{errors.password}</p>}

              {/* Confirm Password */}
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  id="reset-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
              )}

              {/* Password Requirement Checklist */}
              <div className="password-rules-box">
                <span>Password Requirements:</span>
                <ul className="rules-list">
                  <li className={`rule-item ${rules.length ? "valid" : ""}`}>
                    {rules.length ? <FaCheckCircle /> : <FaTimesCircle />} 8–72 characters
                  </li>
                  <li className={`rule-item ${rules.upper ? "valid" : ""}`}>
                    {rules.upper ? <FaCheckCircle /> : <FaTimesCircle />} Uppercase letter
                  </li>
                  <li className={`rule-item ${rules.lower ? "valid" : ""}`}>
                    {rules.lower ? <FaCheckCircle /> : <FaTimesCircle />} Lowercase letter
                  </li>
                  <li className={`rule-item ${rules.number ? "valid" : ""}`}>
                    {rules.number ? <FaCheckCircle /> : <FaTimesCircle />} At least 1 number
                  </li>
                  <li className={`rule-item ${rules.special ? "valid" : ""}`}>
                    {rules.special ? <FaCheckCircle /> : <FaTimesCircle />} Special symbol
                  </li>
                </ul>
              </div>

              <button type="submit" className="reset-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <FaSpinner className="fa-spin" /> Updating Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          <div className="back-to-login-link">
            <Link to="/login">
              <FaArrowLeft /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordCard;
