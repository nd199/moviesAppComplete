import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userRequest } from "../AxiosMethods";
import EmailSubscriptionVerify from "../Components/EmailSubscriptionVerify";
import "./EmailVerification.css";

const EmailVerification = () => {
  const selectedPlan = useSelector((state) => state?.payment.paymentPlan);
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifiedError, setIsVerifiedError] = useState("");
  const req = userRequest();

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
    const initiatePayment = async () => {
      if (!isVerified) return;
      if (!selectedPlan?.selectedPlan) return;

      try {
        const res = await req.post("/subscription/intent", {
          planId: selectedPlan?.selectedPlan?.id,
        });
        const { paymentToken } = res.data;
        window.location.href = `http://localhost:8080/checkout?token=${paymentToken}`;
      } catch (err) {
        console.error("Payment initiation failed", err);
      }
    };

    initiatePayment();
  }, [isVerified, selectedPlan?.selectedPlan, req]);

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
