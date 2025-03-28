import React, {useEffect, useState} from "react";
import "./Registration.css";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";
import {resetErrorMessage} from "../redux/userSlice";
import Box from "@mui/material/Box";
import {register} from "../Network/ApiCalls";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import LinearProgress from "@mui/material/LinearProgress";
import {app} from "../Firebase";
import EmailVerifyUser from "../Components/EmailVerifyUser";

const Register = () => {
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [matchText, setMatchText] = useState("");
    const [otpTimer, setOtpTimer] = useState(0);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [phoneError, setPhoneError] = useState("");
    const [error, setError] = useState(null);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const confirmPasswordValue = e.target.value;
        setConfirmPassword(confirmPasswordValue);
        if (password !== confirmPasswordValue && password && confirmPasswordValue) {
            setMatchText("Passwords Do Not Match");
        }
        if (password === confirmPasswordValue) {
            setMatchText("Passwords Match");
        }
    };

    const handleEmailChange = (emailValue) => {
        setEmail(emailValue);
    };

    const handleEmailVerified = (status) => {
        setIsEmailVerified(status);
    };

    const handlePhoneNumberChange = (e) => {
        const phoneNumberValue = e.target.value;
        setPhoneNumber(phoneNumberValue);

        const phoneNumberPattern = /^[+][0-9]{1,4}[0-9]{7,12}$/;
        if (!phoneNumberPattern.test(phoneNumberValue)) {
            setPhoneError("Phone number must contain only numbers and " +
                "follow the format (+Country code) (123 - 456 - 789)");
        } else {
            setPhoneError("");
        }
    };

    const registerHandler = async (e) => {
        e.preventDefault();
        if (!avatar) {
            setError("Upload a picture");
            return;
        }

        const fileName = new Date().getTime() + avatar.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, avatar);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload failed: ", error);
                setError("Upload failed. Please try again.");
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    const userData = {
                        name,
                        email,
                        password,
                        phoneNumber,
                        address,
                        imageUrl: downloadURL,
                    };
                    await register(dispatch, userData);
                    window.location.reload();
                } catch (error) {
                    console.error("Error getting download URL: ", error);
                    setError("Registration failed. Please try again.");
                }
            }
        );

        try {
            await uploadTask;
        } catch (error) {
            console.error("Upload failed: ", error);
        }
    };

    return (
        <div className="register_Admin">
            <div className="regisCard">
                <div className="image-container">
                    <div className="rg--title">
                        <h1 className="rg--title-heading">R E G I S T E R</h1>
                    </div>
                    <div className="upload-section">
                        <label htmlFor="avatar" className="upload-label">
                            Upload Avatar
                        </label>
                        <input
                            type="file"
                            id="avatar"
                            name="avatar"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="input"
                            required
                        />
                        {avatarPreview && (
                            <img
                                src={avatarPreview}
                                alt="Avatar Preview"
                                className="avatar-preview"
                            />
                        )}
                        <Box sx={{width: "100%"}}>
                            <LinearProgress
                                variant="determinate"
                                value={uploadProgress}
                                style={{
                                    height: "10px",
                                    borderRadius: "5px",
                                    marginBottom: "10px",
                                }}
                            />
                        </Box>
                    </div>
                    <div className="inputs">
                        <label htmlFor="name">ADDRESS :</label>
                        <input
                            type="text"
                            id="address"
                            placeholder="Chennai, India"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <form onSubmit={registerHandler} className="reg-form">
                    <div className="inputs">
                        <label htmlFor="name">NAME :</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="John-Cena"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <EmailVerifyUser
                        onEmailUpdate={handleEmailChange}
                        onEmailVerified={handleEmailVerified}
                    />
                    <div className="inputs">
                        <label htmlFor="phoneNumber">PHONE NUMBER :</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            inputMode="tel"
                            placeholder="(+91) (123 - 456 - 789)"
                            pattern="[+][0-9]{1,4}[0-9]{7,12}"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            required
                        />
                        {phoneError && <p className="error">{phoneError}</p>}
                    </div>
                    <div className="inputs">
                        <label className="lblPassword" htmlFor="password">
                            PASSWORD :
                        </label>
                        <div className="passInput">
                            <input
                                type="password"
                                id="password"
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
                        <label className="lblPassword" htmlFor="confirmPassword">
                            CONFIRM PASSWORD :
                        </label>
                        <div className="passInput">
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                            />
                            {confirmPassword && (
                                <p
                                    style={{
                                        fontSize: "17px",
                                        marginTop: "10px",
                                        color:
                                            password === confirmPassword ? "lightGreen" : "red",
                                    }}
                                >
                                    {matchText}
                                </p>
                            )}
                        </div>
                    </div>
                    {error && <div className="error" style={{color: "red"}}>{error}</div>}
                    {lError && <div className="error" style={{color: "red"}}>{lError}</div>}
                    <p style={{color: "white"}}>
                        {!isEmailVerified ? "Verify Your Email To continue" : ""}
                    </p>
                    <button
                        className="RegisterButton"
                        type="submit"
                        disabled={!isEmailVerified}
                    >
                        R E G I S T E R
                    </button>
                    <p className="last-text">
                        Have an Account ?
                        <Link className="Login--link" to="/login" style={{color: "orange"}}>
                            {"  "}L O G I N
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
