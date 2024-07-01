import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/ApiCalls"; // Assume you have a login function in ApiCalls
import { resetErrorMessage } from "../redux/userSlice";
import "./Login.css"; // Updated CSS file for styling

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();
  const user = useSelector((state) => state.user);
  const error = user?.errorMessage?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(dispatch, { username: email, password });
      nav("/");
      window.location.reload();
    } catch (err) {
      console.error("Login failed: ", err);
    }
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
              <span className="login-register-link">here</span>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
