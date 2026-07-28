import "./LoginCard.css";

function LoginCard() {
  return (
    <div className="login-container">
      <div className="login-card">

        <h1>Welcome Back 👋</h1>

        <p>Login to continue your journey.</p>

        <input
          type="email"
          placeholder="Enter your email"
        />

        <input
          type="password"
          placeholder="Enter your password"
        />

        <button>Login</button>

      </div>
    </div>
  );
}

export default LoginCard;