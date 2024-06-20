import React, { useState, useEffect } from "react";
import Lottie from "react-lottie";
import { validateOtp, verifyEmail } from "../redux/ApiCalls";
import "./EmailReg.css";
import CrossMark from "../animations/CrossMark.json";
import TickMark from "../animations/TickMark.json";
import { Send } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { resetErrorMessage } from "../redux/userSlice";

const EmailReg = ({ onEmailUpdate, onEmailVerified }) => {
  const [email, setEmail] = useState("");
  const [emVerify, setEmShowVerify] = useState(false);
  const [mailOtp, setMailOTP] = useState("");
  const [EmailOtp, setShowEmailOtp] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [otpTimer, setOtpTimer] = useState();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [placeholder, setPlaceHolder] = useState("Cena@gmail.com")
  const [showSuccessErrorMessage, setShowSuccessErrorMessage] = useState(false);
  const [isEmailDisabled, setIsEmailDisabled] = useState(false);

  const dispatch = useDispatch();
  const lError = useSelector((state) => state.user.errorMessage?.message);

  useEffect(() => {
    return () => {
      dispatch(resetErrorMessage());
      setOtpMessage("");
      setShowSuccessErrorMessage("");
      setShowEmailOtp("");
    };
  }, [dispatch]);

  useEffect(() => {
    onEmailUpdate(email);
  }, [email, onEmailUpdate]);

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

  const isValidOtp = (mailOtp) => {
    const otpRegex = /^[0-9]{6}$/;
    return otpRegex.test(mailOtp);
  };

  const handleEmailVerify = async () => {
    setIsSendingEmail(true);
    try {
      setEmShowVerify(false);
      setShowEmailOtp(true);
      const res = await verifyEmail(dispatch, { email });
      setOtpMessage(res);
      setOtpTimer(20);
    } catch (error) {
      console.error("Error verifying email:", error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const otpValidationHandler = async () => {
    if (otpTimer <= 0 && mailOtp.length !== 0) {
      setShowSuccessErrorMessage("Otp has expired Please re enter your email to try again");
      setEmShowVerify(true);
      setShowEmailOtp(false);
      setOtpMessage("");
      setMailOTP("");
      setEmail("");
      setPlaceHolder("Cena@gmail.com");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      const validateInfo = { customerEmail: email, enteredOTP: mailOtp };
      const res = await validateOtp(dispatch, validateInfo);
      setOtpMessage(res);
      setShowEmailOtp(false);
      setShowSuccessErrorMessage("");
      if (res === "OTP verified successfully") {
        setIsEmailDisabled(true);
        onEmailVerified(true);
      }
    } catch (error) {
      setShowEmailOtp(false);
      setOtpMessage(error?.response?.data);
      setShowSuccessErrorMessage(
        error?.response?.data + " Please enter you email again to re-verify"
      );
      setPlaceHolder("Cena@gmail.com");
      setEmail("");
      setMailOTP("");
      setShowEmailOtp("");
      onEmailVerified(false);
    } finally {
      setIsVerifyingOtp(false);
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
    <>
      <div className="inputs">
        <label>EMAIL :</label>
        <div className="envVerify-message">
          <input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.toLocaleLowerCase());
              {
                email.length > 1
                  ? setEmShowVerify(true)
                  : setEmShowVerify(false);
              }
              setOtpMessage("");
            }}
            required
            disabled={isEmailDisabled}
            style={{cursor: !isEmailDisabled ? "pointer" : "not-allowed"}}
          />
          {otpMessage === "OTP verified successfully" ? (
            <Lottie
              options={TickMarkOptions}
              style={{ width: "40px", height: "40px" }}
              title="OTP verified successfully"
            />
          ) : otpMessage === "Invalid OTP or OTP expired" ? (
            <Lottie
              options={CrossMarkOptions}
              style={{ width: "40px", height: "40px" }}
              title="Invalid OTP or OTP expired"
            />
          ) : null}
        </div>
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
            {isVerifyingOtp ? (
              <p>Verifying OTP...</p>
            ) : (
              <>
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
                      <button
                        disabled={!isValidOtp(mailOtp)}
                        onClick={otpValidationHandler}
                        style={{
                          cursor: !isValidOtp(mailOtp)
                            ? "not-allowed"
                            : "pointer",
                        }}
                        title={
                          !isValidEmail(mailOtp)
                            ? "Please enter a valid OTP"
                            : "Click to verify your OTP"
                        }
                      >
                        <Send className="send-icon" />
                      </button>
                      <span>
                        {" "}
                        OTP Expires in <span className="timer">
                          {otpTimer}
                        </span>{" "}
                        seconds
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>
      <p style={{ marginBottom: "10px", color: "white" }}>
        {showSuccessErrorMessage}
      </p>
    </>
  );
};

export default EmailReg;
