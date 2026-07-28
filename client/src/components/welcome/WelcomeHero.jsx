import "./WelcomeHero.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

function WelcomeHero() {
  return (
    <div className="welcome-container">
      <div className="welcome-card">

        <img src={logo} alt="CareerVista Logo" className="welcome-logo" />

        <h1>Welcome to CareerVista</h1>

        <p className="subtitle">
          AI-Powered Job Market Intelligence &
          <br />
          Career Recommendation Platform
        </p>

        <Link to="/login">
          <button className="primary-btn">
            Get Started
          </button>
        </Link>

        <p className="login-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </div>
    </div>
  );
}

export default WelcomeHero;