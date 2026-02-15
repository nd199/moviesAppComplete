import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordRequest, login } from "../../Network/ApiCalls";
import { resetErrorMessage } from "../../redux/userSlice";
import "./Login.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const error = user?.errorMessage?.message || user?.errorMessage || null;

  useEffect(() => {
    return () => dispatch(resetErrorMessage());
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Convert email to lowercase for consistency
    const normalizedEmail = email.toLowerCase().trim();
    
    // Basic validation
    if (!normalizedEmail || !password) {
      setPopupMessage("Please enter both email and password");
      setShowPopup(true);
      return;
    }
    
    setLoading(true);
    try {
      const result = await login(dispatch, { username: normalizedEmail, password });
      console.log('Login successful, user data:', result);
      setPopupMessage("Login successful! Redirecting...");
      setShowPopup(true);
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Login failed. Please try again.';
      setPopupMessage(errorMessage);
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const normalizedEmail = email.toLowerCase().trim();
    
    if (!normalizedEmail) {
      setPopupMessage("Please enter your email first.");
      setShowPopup(true);
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordRequest(dispatch, normalizedEmail);
      const message = res?.message || "Password reset link sent to your email";
      setPopupMessage(message);
      setShowPopup(true);
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong";
      setPopupMessage(backendMessage);
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => setShowPopup(false);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        <p className="login-subtitle">Access your movie streaming account</p>
        <form onSubmit={handleLogin} className="login-form">
          <div className="inputs">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="inputs">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="login-links">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="login-register-link">
              Register here
            </Link>
          </p>
          <p>
            Forgot Password?{" "}
            <span
              style={{ cursor: "pointer", color: "white" }}
              onClick={handleForgotPassword}
            >
              Click here
            </span>
          </p>
          <p className="demo-account">
            Demo Account: demo@example.com / Demo123456
            <br />
          </p>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={closePopup} className="popup-button">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
