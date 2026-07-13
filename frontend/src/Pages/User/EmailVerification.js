import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import EmailSubscriptionVerify from "../../Components/EmailSubscriptionVerify";

const EmailVerification = () => {
  const selectedPlan = useSelector(s => s?.payment.paymentPlan);
  const user = useSelector(s => s?.user?.currentUser);
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const plan = location.state?.plan || selectedPlan?.selectedPlan;

  const onVerify = useCallback((v) => setVerified(v), []);
  const onError = useCallback((e) => setError(e), []);

  if (verified && plan) {
    navigate(`/payment/${user?.id || user?.email || email}`, { state: { plan }, replace: true });
    return null;
  }
  if (verified && !plan) { navigate("/subscription", { replace: true }); return null; }

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center p-6 pt-24">
      <h2 className="text-2xl font-bold text-white mb-6 m-0">Email Verification</h2>
      <div className="w-full max-w-md glass-strong rounded-2xl p-6">
        <EmailSubscriptionVerify onEmailUpdate={setEmail} onEmailVerified={onVerify} onEmailError={onError} />
      </div>
      {error && <p className="text-red-400 text-sm mt-3 m-0">{error}</p>}
      {verified && selectedPlan && <p className="text-green-400 text-sm mt-3 m-0">Verified! Redirecting...</p>}
    </div>
  );
};

export default EmailVerification;
