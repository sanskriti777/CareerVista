import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaSpinner } from "react-icons/fa";
import "./ForgotPasswordCard.css";
import logo from "../../assets/logo.png";
import { forgotPassword } from "../../services/authService";
import { validateForgotPassword } from "../../utils/validation";

function ForgotPasswordCard() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    setServerError("");

    const validationErrors = validateForgotPassword(email);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await forgotPassword(email);

      if (response && response.success) {
        setSuccessInfo({
          message:
            response.message ||
            "If an account with that email exists, a password reset link has been sent.",
          devResetUrl: response.devResetUrl,
          devNotice: response.devNotice,
        });
      } else {
        setServerError(
          response?.message || "Failed to process request. Please try again."
        );
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        {/* Left Hero Branding Side-Panel */}
        <div className="forgot-hero-panel">
          <img src={logo} alt="CareerVista Logo" className="forgot-hero-logo" />
          <h2>Account Security &amp; Recovery</h2>
          <p>
            Regain secure access to your CareerVista profile, active applications,
            and tailored career recommendations.
          </p>

          <div className="security-reassurance-badge">
            <span>Security Guarantee</span>
            <ul>
              <li>Cryptographically randomized single-use tokens</li>
              <li>Strict 15-minute expiration period</li>
              <li>Zero plaintext credential storage</li>
            </ul>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="forgot-form-panel">
          <img src={logo} alt="CareerVista Logo" className="forgot-logo-mobile" />

          <h1>Forgot Password?</h1>
          <p className="forgot-subtitle">
            Enter your registered email address and we'll send you instructions to reset your password.
          </p>

          {serverError && (
            <p className="error-text" style={{ marginBottom: "14px", textAlign: "left" }}>
              {serverError}
            </p>
          )}

          {successInfo ? (
            <div>
              <div className="forgot-success-box">
                <h3>
                  <FaCheckCircle /> Request Received
                </h3>
                <p>{successInfo.message}</p>
                <p style={{ marginTop: "8px", fontSize: "13px", color: "#166534" }}>
                  Please check your inbox (and spam/junk folder) for the password reset link.
                </p>
              </div>

              {successInfo.devResetUrl && (
                <div className="dev-preview-box">
                  <strong>Local Development Simulation:</strong>
                  <span>SMTP is unconfigured. For immediate local testing, click below:</span>
                  <div style={{ marginTop: "6px" }}>
                    <Link to={successInfo.devResetUrl.replace(/^https?:\/\/[^/]+/, "")}>
                      {successInfo.devResetUrl}
                    </Link>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="forgot-btn"
                onClick={() => {
                  setSuccessInfo(null);
                  setEmail("");
                }}
                style={{ marginTop: "16px" }}
              >
                Send Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  placeholder="Enter your account email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>

              {errors.email && <p className="error-text">{errors.email}</p>}

              <button type="submit" className="forgot-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <FaSpinner className="fa-spin" /> Sending Reset Link...
                  </>
                ) : (
                  "Send Reset Link"
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

export default ForgotPasswordCard;
