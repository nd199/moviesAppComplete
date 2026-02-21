import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import EmailSubscriptionVerify from "../../Components/EmailSubscriptionVerify";
import "./EmailVerification.css";

const EmailVerification = () => {
  const selectedPlan = useSelector((state) => state?.payment.paymentPlan);
  const currentUser = useSelector((state) => state?.user?.currentUser);
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifiedError, setIsVerifiedError] = useState("");
  const navigate = useNavigate();

  const plan = location.state?.plan || selectedPlan?.selectedPlan;

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
    console.log("Selected Plan Redux:", selectedPlan);
    console.log("Plan from route state:", location.state?.plan);
    console.log("Final plan being used:", plan);
    
    if (!isVerified) return;

    if (!plan) {
      console.warn("No selected plan found. Redirecting to subscription.");
      navigate("/subscription");
      return;
    }

    const userId = currentUser?.id || currentUser?.email || email;
    
    console.log('EmailVerification - Attempting redirect to:', `/payment/${userId}`);
    
    setTimeout(() => {
      try {
        navigate(`/payment/${userId}`, {
          state: { plan: plan }
        });
      } catch (error) {
        console.error('Navigation failed:', error);
        window.location.href = `/payment/${userId}`;
      }
    }, 1500);

}, [isVerified, plan, navigate, currentUser?.id, currentUser?.email, email, location.state?.plan, selectedPlan?.selectedPlan]);

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
          <p>Email verified! Redirecting to payment...</p>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
