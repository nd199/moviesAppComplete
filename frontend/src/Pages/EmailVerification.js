import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmailSubscriptionVerify from "../Components/EmailSubscriptionVerify";
import "./EmailVerification.css";

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
    const initiatePayment = async () => {
      if (!isVerified) return;
      if (!selectedPlan?.selectedPlan) return;

      try {
        const res = await axios.post(
          "https://movieticket-api.onrender.com/api/v1/subscription/intent",
          {
            planId: selectedPlan.selectedPlan.id,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );

        const { paymentToken } = res.data;

        window.location.href = `https://movies-app-complete-payment.vercel.app/checkout?token=${paymentToken}`;
      } catch (err) {
        console.error("Payment initiation failed", err);
      }
    };

    initiatePayment();
  }, [isVerified, selectedPlan, currentUser]);

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
