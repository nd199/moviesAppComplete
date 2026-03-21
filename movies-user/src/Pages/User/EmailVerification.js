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

  // Get plan from location state or Redux store
  // Use state from location to ensure it's preserved across re-renders
  const plan = location.state?.plan || selectedPlan?.selectedPlan;

  const handleEmailUpdate = useCallback((email) => {
    setEmail(email);
  }, []);

  const handleEmailVerified = useCallback((verified) => {
    console.log('[EmailVerification] handleEmailVerified called with:', verified);
    setIsVerified(verified);
  }, []);

  const handleEmailError = useCallback((error) => {
    setIsVerifiedError(error);
  }, []);

  useEffect(() => {
    console.log('[EmailVerification] isVerified:', isVerified);
    console.log('[EmailVerification] location.state:', location.state);
    console.log('[EmailVerification] selectedPlan:', selectedPlan);
    console.log('[EmailVerification] selectedPlan?.selectedPlan:', selectedPlan?.selectedPlan);
    console.log('[EmailVerification] currentUser:', currentUser);
    console.log('[EmailVerification] email:', email);

    if (!isVerified) {
      console.log('[EmailVerification] Email not verified yet, returning...');
      return;
    }

    // Get the plan - from location state or Redux store
    const planData = location.state?.plan || selectedPlan?.selectedPlan;
    console.log('[EmailVerification] planData:', planData);
    
    // If no plan is available, redirect to subscription page to select one
    // Do NOT redirect to home - always go to subscription if no plan
    if (!planData) {
      console.log('[EmailVerification] No plan found, redirecting to /subscription');
      navigate("/subscription", { replace: true });
      return;
    }

    // User is verified and we have a plan - navigate to payment
    const userId = currentUser?.id || currentUser?.email || email;
    console.log('[EmailVerification] User verified, plan found. Redirecting to /payment/' + userId);
    
    // Navigate directly to payment page
    navigate(`/payment/${userId}`, {
      state: { plan: planData },
      replace: true
    });

  }, [isVerified, selectedPlan, location.state, navigate, currentUser?.id, currentUser?.email, email]);

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
