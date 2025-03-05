import React, { useCallback, useEffect, useState } from "react";
import "./EmailVerification.css";
import { useDispatch, useSelector } from "react-redux";
import { pushToPaymentModule } from "../Network/ApiCalls";
import EmailSubscriptionVerify from "../Components/EmailSubscriptionVerify";

const EmailVerification = () => {
  const selectedPlan = useSelector((state) => state?.payment.paymentPlan);
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifiedError, setIsVerifiedError] = useState("");
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state?.user?.currentUser);

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
      pushToPaymentModule(dispatch, { currentUser, selectedPlan });
      window.location.reload();
      window.location.href = `https://movies-app-complete-ilnf.vercel.app/${currentUser.id}`;
    }
  }, [isVerified, selectedPlan, currentUser, dispatch]);

  return (
    <div className="email-verification-page">
      <h2>Email Verification</h2>
      <div className="email-verify-box">
        <EmailSubscriptionVerify
          onEmailUpdate={handleEmailUpdate}
          onEmailVerified={handleEmailVerified}
          onEmailError={handleEmailError}
        />
      </div>
      {isVerifiedError && (
        <p className="error-message" style={{ color: "red" }}>
          {isVerifiedError}
        </p>
      )}
      {isVerified && selectedPlan && (
        <div className="success-message">
          <p>Email has been verified!</p>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
