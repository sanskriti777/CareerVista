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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    const validationErrors = validateRegister(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const response = await registerUser(formData);

    if (response.success) {
      alert("Registration Successful!");
      navigate("/login");
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

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
          )}

          <button className="register-btn" onClick={handleRegister}>
            Create Account
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