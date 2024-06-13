import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/ApiCalls";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";
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
    } catch (err) {
      console.error(
        "Login error: ",
        err.response?.data?.error || "An unexpected error occurred"
      );
      return err.response?.data?.error || "An unexpected error occurred";
    }
  };

  return (
    <div className="loginAdmin">
      <div className="login-logo">CN.io</div>
      <div className="loginCard">
        <h1>Welcome Admin</h1>
        <h4>Please Login below</h4>
        <form
          onSubmit={loginHandler}
          className="reg-form"
        >
          <div className="lg_inputs">
            <input
              type="email"
              placeholder="Cena@gmail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
            />
            <label>EMAIL :</label>
          </div>
          <div className="lg_inputs">
              <input
                style={{ marginBottom: "2px" }}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            <label>PASSWORD :</label>
          </div>
          <div className="lg_inputs">
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <label>PHONE NUMBER :</label>
          </div>
          {lError && <div className="error">{lError}</div>}
          <button className="btn" type="submit">
            L O G I N
          </button>
        </form>
        <p>
          New to CN.IO? Register{" "}
          <Link to="/registerAdmin">
            <span>here</span>
          </Link>
        </p>
        <p>
          Forgot Password? Click{" "}
          <Link to="/forgotPassword">
            <span>here</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
