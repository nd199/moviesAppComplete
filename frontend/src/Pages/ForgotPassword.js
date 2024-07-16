import React, {useEffect, useState} from "react";
import "./ForgotPassword.css";
import PasswordStrengthBar from "react-password-strength-bar";
import {useDispatch, useSelector} from "react-redux";
import {updatePasswordAndPushToLoginPage} from "../Network/ApiCalls";
import {useNavigate} from "react-router-dom";

const ForgotPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [matchText, setMatchText] = useState("");
    const [token, setToken] = useState("");
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const errorMessage = useSelector((state) => state);
    console.log(errorMessage);
    const nav = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        setToken(token);

        const validateToken = async () => {
            try {
                const response = await fetch(`/api/password-reset/validate-token?token=${token}`);
                if (response.ok) {
                    return response;
                } else {
                    setError(`Failed to validate token. Status: ${response.status}`);
                }
            } catch (error) {
                setError('Error validating token. Please try again later.');
            }
        };
        validateToken();
    }, [token]);

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
            if (matchText === "Passwords Match") {
                try {
                    updatePasswordAndPushToLoginPage(dispatch, {token, newPassword: password});
                    nav("/Login");
                } catch (err) {
                    console.log(err);
                }
            }
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
                        <button className="forgot-password-btn" type="submit">
                            Submit
                        </button>
                    </form>
                    {error && (
                        <div className="popup">
                            <div className="popup-content">
                                <span className="close" onClick={() => setError('')}>&times;</span>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
