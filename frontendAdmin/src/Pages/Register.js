import React, { useState, useEffect } from "react";
import "./Register.css";
import {
  fetchUserByEmail,
  fetchUserByPhoneNumber,
  register,
} from "../redux/ApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [matchText, setMatchText] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();

  const lError = useSelector((state) => state.user.errorMessage?.message);

  const handleConfirmPasswordChange = (e) => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);
    if (
      password !== confirmPasswordValue &&
      password.length > 0 &&
      confirmPassword.length > 0
    ) {
      setMatchText("Passwords Do Not Match");
    } else {
      setMatchText("Passwords Match");
    }
  };

  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      if (password === confirmPassword) {
        setMatchText("Passwords Match");
        await register(dispatch, { name, email, password, phoneNumber });
        // nav("/Home");
      } else {
        setMatchText("Passwords Do Not Match");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="register_Admin">
      <div className="regisCard">
        <div className="rg--title">
          <h1>Register</h1>
          <img src="/images/MbReg.gif" alt="reg.gif" className="MBReg" />
        </div>
        <form
          action=""
          method="post"
          onSubmit={registerHandler}
          className="reg-form"
        >
          <div className="inputs">
            <input
              type="text"
              placeholder="John-Cena"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>NAME :</label>
          </div>
          <div className="inputs">
            <input
              type="email"
              placeholder="Cena@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLocaleLowerCase())}
              required
            />
            <label>EMAIL :</label>
          </div>
          <div className="inputs">
            <div className="passInput">
              <input
                style={{ marginBottom: "2px" }}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password && (
                <PasswordStrengthBar
                  scoreWordStyle={{ fontSize: "17px" }}
                  style={{ height: "20px" }}
                  password={password}
                />
              )}
            </div>
            <label htmlFor={"password"}>PASSWORD :</label>
          </div>
          <div className="inputs">
            <div style={{ flex: "1" }}>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              {confirmPassword && (
                <p
                  style={{
                    fontSize: "15px",
                    color: `${
                      password === confirmPassword ? "lightGreen" : "red"
                    }`,
                    marginTop: "10px",
                  }}
                >
                  {matchText}
                </p>
              )}
            </div>
            <label>CONFIRM PASSWORD :</label>
          </div>
          <div className="inputs">
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
            R E G I S T E R
          </button>
        </form>
        <Link to={"/"}>
          <p>Have an account? Login here</p>
        </Link>
      </div>
    </div>
  );
};

export default Register;
