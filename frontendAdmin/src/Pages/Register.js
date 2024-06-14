import React, { useState, useEffect } from "react";
import "./Register.css";
import {
  register,
  validateOtp,
  verifyEmail,
  verifyPhone,
} from "../redux/ApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";
import { resetErrorMessage } from "../redux/userSlice";
import { Send } from "@mui/icons-material";
import CrossMark from "../animations/CrossMark.json";
import TickMark from "../animations/TickMark.json";

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
  const [phoneOtp, setPhoneOTP] = useState("");
  const [EmailOtp, setShowEmailOtp] = useState(false);
  const [PhoneOtp, setShowPhoneOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const lError = useSelector((state) => state.user.errorMessage?.message);

  useEffect(() => {
    return () => {
      dispatch(resetErrorMessage());
    };
  }, [dispatch]);

  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpTimer]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);
    if (password !== confirmPasswordValue && password && confirmPasswordValue) {
      setMatchText("Passwords Do Not Match");
    } else {
      setMatchText("Passwords Match");
    }
  };

  const handleEmailVerify = async () => {
    setIsSendingEmail(true);
    try {
      setEmShowVerify(false);
      setShowEmailOtp(true);
      await verifyEmail(dispatch, { email });
      setOtpTimer(60);
    } catch (error) {
      console.error("Error verifying email:", error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const otpValidationHandler = async () => {
    if (otpTimer <= 0) {
      console.log("OTP has expired");
      return;
    }
    try {
      const validateInfo = { customerEmail: email, enteredOTP: mailOtp };
      await validateOtp(dispatch, validateInfo);
      console.log(email, mailOtp);
    } catch (error) {
      setShowEmailOtp(false);
      console.error("Error validating email:", error);
    }
  };

  const handlePhoneVerify = async () => {
    try {
      setShowVerify(false);
      setShowPhoneOtp(true);
      await verifyPhone(phoneNumber, dispatch);
    } catch (error) {
      console.error("Error verifying phone number:", error);
    }
  };

  const registerHandler = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        await register(dispatch, { name, email, password, phoneNumber });
        nav("/Home");
      } catch (err) {
        console.error(err);
      }
    } else {
      setMatchText("Passwords Do Not Match");
    }
  };

  const TickMarkOptions = {
    loop: true,
    autoplay: true,
    animationData: TickMark,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const CrossMarkOptions = {
    loop: true,
    autoplay: true,
    animationData: CrossMark,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="register_Admin">
      <div>
        <div className="regisCard">
          <div className="image-container">
            <div className="rg--title">
              <h1>R E G I S T E R</h1>
            </div>
            <img src="/images/MbReg.gif" alt="reg.gif" className="MBReg" />
          </div>
          <form onSubmit={registerHandler} className="reg-form">
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
              {emVerify ? (
                <button
                  type="button"
                  onClick={handleEmailVerify}
                  className="verify-button"
                  disabled={!isValidEmail(email)}
                  style={{
                    cursor: !isValidEmail(email) ? "not-allowed" : "pointer",
                  }}
                  title={
                    !isValidEmail(email)
                      ? "Please enter a valid email"
                      : "Click to verify your email"
                  }
                >
                  Verify Email
                </button>
              ) : EmailOtp ? (
                <div className="otp-container">
                  <input
                    type="text"
                    placeholder="OTP"
                    value={mailOtp}
                    onChange={(e) => setMailOTP(e.target.value)}
                  />
                  <div>
                    {isSendingEmail ? (
                      <p>Sending Mail...</p>
                    ) : (
                      <div className="otp-Actions">
                        <Send
                          className="send-icon"
                          onClick={otpValidationHandler}
                        />
                        <span>
                          {" "}
                          OTP Expires in{" "}
                          <span className="timer">{otpTimer}</span> seconds
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="inputs">
              <label className="lblPassword" htmlFor={"password"}>
                PASSWORD :
              </label>
              <div className="passInput">
                <input
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
              <div>
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
                      color:
                        password === confirmPassword ? "lightGreen" : "red",
                    }}
                  >
                    {matchText}
                  </p>
                )}
              </div>
            </div>
            <div className="inputs">
              <label>PHONE NUMBER :</label>
              {verify ? (
                <button
                  type="button"
                  onClick={handlePhoneVerify}
                  className="verify-button"
                >
                  Verify Phone
                </button>
              ) : PhoneOtp ? (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOTP(e.target.value)}
                />
              ) : null}
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
            <button className="RegisterButton" type="submit">
              R E G I S T E R
            </button>
            <div className="reg-form-links">
              <Link to={"/"}>
                <p>
                  Have an account? Login{" "}
                  <span className="reg-login-link">here</span>
                </p>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
