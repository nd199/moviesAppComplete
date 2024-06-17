import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/ApiCalls";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { resetErrorMessage } from "../redux/userSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();

  let lError = useSelector((state) => state.user.errorMessage?.message);

  useEffect(() => {
    return () => {
      dispatch(resetErrorMessage());
    };
  }, [dispatch]);

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      await login(dispatch, { username, password });
      nav('/');
    } catch (err) {
      console.error(
        "Login error: ",
        err.response?.data?.error || "An unexpected error occurred"
      );
      return err.response?.data?.error || "An unexpected error occurred";
    }
  };

  return (
    <div className="login_Admin">
      <div className="loginCard">
        <div className="login-title">
          <h1>Welcome Admin</h1>
          <h4>Please Login below</h4>
        </div>
        <form method="post" onSubmit={loginHandler} className="login-form">
          <div className="login-inputs">
            <label>EMAIL :</label>
            <input
              type="email"
              placeholder="Cena@gmail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
            />
          </div>
          <div className="login-inputs">
            <label>PASSWORD :</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="login-inputs">
            <label>PHONE NUMBER :</label>
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          {lError && <div className="error">{lError}</div>}
          <button className="login-button" type="submit">
            L O G I N
          </button>
        </form>
        <div className="login-form-links">
          <p>
            New to CN.IO? <br /> Register{" "}
            <Link to="/registerAdmin">
              <span className="login-register-link">here</span>
            </Link>
          </p>
          <p>
            Forgot Password? Click{" "}
            <Link to="/forgotPassword">
              <span className="login-forgot-link">here</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
