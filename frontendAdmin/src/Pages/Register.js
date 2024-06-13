import React, { useState, useEffect } from "react";
import "./Register.css";
import {
  fetchUserByEmail,
  fetchUserByPhoneNumber,
  register,
  verifyEmail,
  verifyPhone,
} from "../redux/ApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";
import { resetErrorMessage } from "../redux/userSlice";
import { Send } from "@mui/icons-material";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [matchText, setMatchText] = useState("");
  const [verify, setShowVerify] = useState(false);
  const [emVerify, setEmShowVerify] = useState(false);
  const [mailOtp, setMailOTP] = useState("");
  // const { isFetching, successMessage, errorMessage } = useSelector(
  //   (state) => state.verifyEmail
  // );

  const [phoneOtp, setPhoneOTP] = useState("");
  const [EmailOtp, setShowEmailOtp] = useState(false);
  const [PhoneOtp, setShowPhoneOtp] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const lError = useSelector((state) => state.user.errorMessage?.message);

  useEffect(() => {
    return () => {
      dispatch(resetErrorMessage());
    };
  }, [dispatch]);

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

  const handleEmailVerify = async () => {
    try {
      setEmShowVerify(false);
      setShowEmailOtp(true);
      const res = await verifyEmail(email, dispatch);
      console.log(res);
    } catch (error) {
      console.error("Error verifying email:", error);
    }
  };

  const handlePhoneVerify = async () => {
    try {
      setShowVerify(false);
      setShowPhoneOtp(true);
      const res = await verifyPhone(phoneNumber, dispatch);
      console.log(res);
    } catch (error) {
      console.error("Error verifying phone number:", error);
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
            <label>NAME :</label>
            <input
              type="text"
              placeholder="John-Cena"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="inputs">
            <label>EMAIL :</label>
            {(emVerify && (
              <button
                type="button"
                onClick={handleEmailVerify}
                className="verify-button"
              >
                Verify Email
              </button>
            )) ||
              (EmailOtp && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "white",
                    width: "120px",
                    padding: "0 5px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="OTP"
                    value={mailOtp}
                    style={{ width: "40%" }}
                    onChange={(e) => setMailOTP(e.target.value)}
                  />
                  <Send
                    style={{ color: "blue !important", cursor: "pointer" }}
                  />
                </div>
              ))}
            <input
              type="email"
              placeholder="Cena@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.toLocaleLowerCase());
                setEmShowVerify(true);
              }}
              required
            />
          </div>
          <div className="inputs">
            <label className="lblPassword" htmlFor={"password"}>
              PASSWORD :
            </label>
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
          </div>
          <div className="inputs">
            <label className="lblPassword">CONFIRM PASSWORD :</label>
            <div style={{ flex: "1" }}>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                className="passInput"
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
          </div>
          <div className="inputs">
            <label>PHONE NUMBER :</label>
            {(verify && (
              <button
                type="button"
                onClick={handlePhoneVerify}
                className="verify-button"
              >
                Verify Phone
              </button>
            )) ||
              (PhoneOtp && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOTP(e.target.value)}
                />
              ))}
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setShowVerify(true);
              }}
              required
            />
          </div>
          {lError && <div className="error">{lError}</div>}
          <button className="btn" type="submit">
            R E G I S T E R
          </button>
        </form>
        <Link to={"/"}>
          <p>
            Have an account? Login <span style={{ color: "green" }}>here</span>
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Register;
