import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f8f5ff, #ffffff)",
        padding: "20px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "72px", color: "#5b21b6", margin: "0" }}>404</h1>
      <h2 style={{ fontSize: "24px", color: "#111827", margin: "10px 0 15px" }}>
        Page Not Found
      </h2>
      <p style={{ color: "#6b7280", marginBottom: "25px", maxWidth: "400px" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        style={{
          padding: "14px 28px",
          background: "#5b21b6",
          color: "white",
          borderRadius: "12px",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;