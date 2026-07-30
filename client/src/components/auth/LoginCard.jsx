import "./LoginCard.css";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

import { loginUser } from "../../services/authService";
import { validateLogin } from "../../utils/validation";

function LoginCard() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    const validationErrors = validateLogin(email, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const response = await loginUser(email, password);

    if (response.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="CareerVista Logo" className="login-logo" />

        <h1>Welcome Back</h1>

        <p>Sign in to continue your journey.</p>

        <div className="input-group">
          <FaEnvelope className="input-icon" />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {errors.email && (
          <p className="error-text">{errors.email}</p>
        )}

        <div className="input-group">
          <FaLock className="input-icon" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {errors.password && (
          <p className="error-text">{errors.password}</p>
        )}

        <div className="login-options">
          <label>
            <input type="checkbox" />
            Remember Me
          </label>

          <Link to="#">Forgot Password?</Link>
        </div>

        <button
          className="login-btn"
          onClick={handleLogin}
        >
          Sign In
        </button>

        <p className="register-link">
          Don't have an account?

          <Link to="/register"> Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginCard;