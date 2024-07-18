import React, {useState} from "react";
import "./ForgotPassword.css";
import PasswordStrengthBar from "react-password-strength-bar";
import {useDispatch} from "react-redux";
import {forgotPassword} from "../Network/ApiCalls";

const ForgotPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [matchText, setMatchText] = useState("");
    const [typeOfVerification, setTypeOfVerification] = useState("");
    const [enteredOtp, setEnteredOtp] = useState("");
    const dispatch = useDispatch();

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
            // Handle response if needed
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-wrapper">
                <div className="forgot-password-left">
                    <img src="/images/FP.gif" alt="Forgot Password" className="forgot-password-gif"/>
                </div>
                <div className="forgot-password-right">
                    <div className="forgot-password-title">
                        <h1>Forgot Password</h1>
                    </div>
                    <form className="password-change-form" onSubmit={handlePasswordChange}>
                        <div className="form-input">
                            <label>Password:</label>
                            <div className="password-input">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {password && (
                                    <PasswordStrengthBar
                                        scoreWordStyle={{fontSize: "17px"}}
                                        style={{height: "20px"}}
                                        password={password}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="form-input">
                            <label>Confirm Password:</label>
                            <div className="confirm-password-input">
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
                                                password === confirmPassword ? "lightgreen" : "red",
                                            marginTop: "10px",
                                        }}
                                    >
                                        {matchText}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="form-input">
                            <label>Verification Type:</label>
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
                        <div className="form-input">
                            <label>One Time Password:</label>
                            <input
                                type="number"
                                placeholder="One Time Password"
                                value={enteredOtp}
                                onChange={(e) => setEnteredOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button className="forgot-password-btn" type="submit">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;