import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordRequest, login } from "../Network/ApiCalls";
import "./Login.css";
import { resetErrorMessage } from "../redux/userSlice";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  let error = user?.errorMessage?.message;

  useEffect(() => {
    return () => {
      dispatch(resetErrorMessage());
    };
  }, [dispatch]);

  useEffect(() => {
    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(dispatch, { username: email, password });
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed: ", err);
    }
  };

  const handleForgotPassword = () => {
    setShowResetConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    try {
      setEmail("");
      setPassword("");
      forgotPasswordRequest(dispatch, email);
    } catch (error) {
      console.log(error);
    }
    setShowResetConfirmation(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="inputs">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target?.value)}
              required
            />
          </div>
          <div className="inputs">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target?.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="login-links">
          <Link to="/">
            <p>
              Don't have an account? Register{" "}
              <span style={{ color: "white" }} className="login-register-link">
                here
              </span>
            </p>
          </Link>
          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>
              <p onClick={handleForgotPassword}>
                Forgot Password? Click
                <span
                  style={{ color: "white", cursor: "pointer" }}
                  className="login-register-link"
                >
                  {" "}
                  here
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
      {showResetConfirmation && (
        <div className="popup">
          <div className="popup-content">
            <p>A password reset link has been sent to your email.</p>
            <button onClick={handleCloseConfirmation} className="popup-button">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
