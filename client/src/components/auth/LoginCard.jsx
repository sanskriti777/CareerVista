import "./LoginCard.css";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

import { loginUser } from "../../services/authService";
import { validateLogin } from "../../utils/validation";
import { useAuth } from "../../context/AuthContext";

function LoginCard() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleLogin = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    setServerError("");

    const validationErrors = validateLogin(email, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const response = await loginUser(email, password);

    if (response && response.success) {
      login(response.user, response.token);
      navigate("/dashboard");
    } else {
      setServerError(response?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Hero Branding Side-Panel for Desktop */}
        <div className="login-hero-panel">
          <img src={logo} alt="CareerVista Logo" className="login-hero-logo" />
          <h2>Build Your Career With AI Insights</h2>
          <p>Discover top opportunities, track applications, and level up your skills.</p>

          <div className="corporate-trust-badge">
            <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#c7d2fe" }}>
              Trusted by Candidates at
            </span>
            <div style={{ display: "flex", gap: "14px", fontSize: "13px", fontWeight: "600", color: "#ffffff", marginTop: "6px" }}>
              <span>• Google</span>
              <span>• Microsoft</span>
              <span>• Amazon</span>
            </div>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="login-form-panel">
          <img src={logo} alt="CareerVista Logo" className="login-logo-mobile" />

          <h1>Welcome Back</h1>
          <p className="login-subtitle">Sign in to continue your journey.</p>

          {serverError && (
            <p className="error-text" style={{ marginBottom: "12px", textAlign: "center" }}>
              {serverError}
            </p>
          )}

          <form onSubmit={handleLogin} autoComplete="off">
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            {errors.email && <p className="error-text">{errors.email}</p>}

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {errors.password && <p className="error-text">{errors.password}</p>}

            <div className="login-options">
              <label>
                <input type="checkbox" />
                Remember Me
              </label>

              <Link to="#">Forgot Password?</Link>
            </div>

            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>

          <p className="register-link">
            Don't have an account?
            <Link to="/register"> Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginCard;