import React, {useCallback, useEffect, useState} from "react";
import EmailReg from "../Components/EmailReg";
import "./EmailVerification.css";
import {useDispatch, useSelector} from "react-redux";
import {pushToPaymentModule} from "../Network/ApiCalls";

const EmailVerification = () => {
    const selectedPlan = useSelector(state => state?.payment.paymentPlan);
    const [email, setEmail] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifiedError, setIsVerifiedError] = useState("");
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state?.user?.currentUser);

    const handleEmailUpdate = useCallback((email) => {
        setEmail(email);
    }, []);

    const handleEmailVerified = useCallback((verified) => {
        setIsVerified(verified);
    }, []);

    const handleEmailError = useCallback((error) => {
        setIsVerifiedError(error);
    }, []);

    useEffect(() => {
        if (isVerified && selectedPlan) {
            pushToPaymentModule(dispatch, {currentUser, selectedPlan});
            window.location.href = `http://localhost:5001/${currentUser.id}`;
        }
    }, [isVerified, selectedPlan, currentUser, dispatch]);

    return (
        <div className="email-verification-page">
            <h2>Email Verification</h2>
            <div className="email-verify-box">
                <EmailReg
                    onEmailUpdate={handleEmailUpdate}
                    onEmailVerified={handleEmailVerified}
                    onEmailError={handleEmailError}
                />
            </div>
            {isVerifiedError && <p className="error-message">{isVerifiedError}</p>}
            {isVerified && selectedPlan && (
                <div style={{
                    marginTop: "30px",
                    color: "lightGreen",
                    fontSize: "20px",
                    padding: "10px",
                    border: "2px solid white",
                    textAlign: "center",
                    borderRadius: "10px",
                    boxShadow: "2px 4px 18px lightGreen"
                }}>
                    <p>Email has been verified!</p>
                    <p>Selected Plan: {selectedPlan.name}</p>
                </div>
            )}
        </div>
    );
};

export default EmailVerification;
