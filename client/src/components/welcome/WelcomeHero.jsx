import "./WelcomeHero.css";
import logo from "../../assets/logo.png";
import welcomeImage from "../../assets/images/welcome.png";
import { Link } from "react-router-dom";

function WelcomeHero() {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-content-left">
          <img src={logo} alt="CareerVista Logo" className="welcome-logo" />

          <h1>
            Welcome to <span>CareerVista</span>
          </h1>

          <p className="subtitle">
            Discover jobs, analyze market trends, and build your career with
            AI-powered insights.
          </p>

          <div className="welcome-actions">
            <Link to="/login">
              <button className="primary-btn">Get Started</button>
            </Link>

            <Link to="/login">
              <button className="secondary-btn">Login</button>
            </Link>
          </div>

          <p className="login-text">
            New here?
            <Link to="/register"> Create an account</Link>
          </p>
        </div>

        <div className="welcome-content-right">
          <img
            src={welcomeImage}
            alt="Career Illustration"
            className="welcome-image"
          />
        </div>
      </div>
    </div>
  );
}

export default WelcomeHero;