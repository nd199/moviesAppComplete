import React, {useEffect, useState} from "react";
import "./Register.css";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";
import {resetErrorMessage} from "../redux/userSlice";
import {register} from "../redux/ApiCalls";
import EmailVerifyAdmin from "../components/EmailVerifyAdmin";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [matchText, setMatchText] = useState("");
    const [otpTimer, setOtpTimer] = useState(0);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const dispatch = useDispatch();
    const nav = useNavigate();
    const lError = useSelector((state) => state.user.errorMessage?.message);
    console.log(lError);

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

    const handleConfirmPasswordChange = (e) => {
        const confirmPasswordValue = e.target.value;
        setConfirmPassword(confirmPasswordValue);
        if (password !== confirmPasswordValue && password && confirmPasswordValue) {
            setMatchText("Passwords Do Not Match");
        } else {
            setMatchText("Passwords Match");
        }
    };

    const handleEmailChange = (emailValue) => {
        setEmail(emailValue);
    };

    const handleEmailVerified = (status) => {
        setIsEmailVerified(status);
    };

    const registerHandler = async (e) => {
        e.preventDefault();

        if (password === confirmPassword) {
            try {
                await register(dispatch, {name, email, password, phoneNumber});
                nav("/Home");
            } catch (err) {
                console.error(err);
            }
        } else {
            setMatchText("Passwords Do Not Match");
        }
    };

    return (
        <div className="register_Admin">
            <div>
                <div className="regisCard">
                    <div className="image-container">
                        <div className="rg--title">
                            <h1>R E G I S T E R</h1>
                        </div>
                        <img src="/images/MbReg.gif" alt="reg.gif" className="MBReg"/>
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
                        <EmailVerifyAdmin
                            onEmailUpdate={handleEmailChange}
                            onEmailVerified={handleEmailVerified}
                        />
                        <div className="inputs">
                            <label>PHONE NUMBER :</label>
                            <input
                                type="tel"
                                inputMode="tel"
                                placeholder="(+91) (123 - 456 - 789)"
                                pattern="[+][0-9]{1,4}[0-9]{7,12}"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
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
                                        scoreWordStyle={{fontSize: "17px"}}
                                        style={{height: "20px"}}
                                        password={password}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="inputs">
                            <label className="lblPassword">CONFIRM PASSWORD :</label>
                            <div className="passInput">
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
                                            fontSize: "18px",
                                            marginTop: "10px",
                                            marginBottom: "-35px",
                                            color:
                                                password === confirmPassword ? "lightGreen" : "red",
                                        }}
                                    >
                                        {matchText}
                                    </p>
                                )}
                            </div>
                        </div>
                        {lError && <div className="error">{lError}</div>}
                        {isEmailVerified && <p style={{color: "white"}}> {!isEmailVerified ? "Verify Your Email To continue" : ""}</p>}
                        <button
                            className="RegisterButton"
                            type="submit"
                            disabled={!isEmailVerified}
                            style={{cursor: !isEmailVerified ? "not-allowed" : "pointer"}}
                        >
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
