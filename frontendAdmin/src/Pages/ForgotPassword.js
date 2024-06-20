import React, { useState } from "react";
import "./ForgotPassword.css";
import PasswordStrengthBar from "react-password-strength-bar";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/ApiCalls";

const ForgotPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchText, setMatchText] = useState("");
  const [typeOfVerification, setTypeOfVerification] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleConfirmPasswordChange = (e) => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);
    if (password !== confirmPasswordValue && password.length > 0) {
      setMatchText("Passwords Do Not Match");
    } else {
      setMatchText("Passwords Match");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(dispatch, {
        resetPassword: password,
        typeOfVerification,
        enteredOtp,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fPPage">
      <div className="fpWrapperCard">
        <div className="fpLft">
          <img src="/images/FP.gif" alt="FP.gif" className="fPGIf" />
        </div>
        <div className="fpRht">
          <div className="fp-title">
            <h1>FORGOT PASSWORD</h1>
          </div>
          <form className="pc-form" onSubmit={handlePasswordChange}>
            <div className="inputs">
              <label>PASSWORD :</label>
              <div className="p-Input">
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
              <label>CONFIRM PASSWORD :</label>
              <div className="c-input">
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
                      color:
                        password === confirmPassword ? "lightGreen" : "red",
                      marginTop: "10px",
                    }}
                  >
                    {matchText}
                  </p>
                )}
              </div>
            </div>
            <div className="inputs">
              <label>Verification Type</label>
              <select
                name="verificationType"
                value={typeOfVerification}
                onChange={(e) => setTypeOfVerification(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select verification type
                </option>
                <option value="Email">Email</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>
            <div className="inputs">
              <label>One Time Password :</label>
              <input
                type="number"
                placeholder="One Time Password"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                required
              />
            </div>
            <button className="fp-btn" type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
