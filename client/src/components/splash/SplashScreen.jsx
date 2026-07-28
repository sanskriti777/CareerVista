import "./SplashScreen.css";
import logo from "../../assets/logo.png";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function SplashScreen() {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/welcome");
        }, 2500);
        return () => clearTimeout(timer);
    }, [navigate]);
  return (
    <div className="splash-container">
      <img src={logo} alt="CareerVista Logo" className="logo" />

      <h1>CareerVista</h1>

      <p>Find. Analyze. Grow.</p>
    </div>
  );
}

export default SplashScreen;