import "./Profile.css";
import MainLayout from "../layouts/MainLayout";
import Topbar from "../components/dashboard/Topbar";
import ResumeScoreWidget from "../components/profile/ResumeScoreWidget";

function Profile() {
  return (
    <MainLayout>
      <Topbar />

      <div className="profile-page-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-large">S</div>
            <div className="profile-details">
              <h2>Sanskriti</h2>
              <p>Computer Science Student & Aspiring Developer</p>
            </div>
          </div>

          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="profile-info-grid">
              <div className="info-item">
                <span className="info-label">Email Address</span>
                <span className="info-value">sanskriti@example.com</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-value">+91 98765 43210</span>
              </div>
              <div className="info-item">
                <span className="info-label">Location</span>
                <span className="info-value">Bangalore, India</span>
              </div>
              <div className="info-item">
                <span className="info-label">Preferred Role</span>
                <span className="info-value">Frontend Developer</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Skills & Expertise</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["React.js", "JavaScript", "HTML/CSS", "Git", "Node.js"].map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: "8px 16px",
                    background: "#f5f3ff",
                    color: "#6d28d9",
                    border: "1px solid #ddd6fe",
                    borderRadius: "20px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <ResumeScoreWidget />
      </div>
    </MainLayout>
  );
}

export default Profile;