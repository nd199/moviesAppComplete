import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import EmailSubscriptionVerify from "../../Components/EmailSubscriptionVerify";
import { useScrollReveal } from "../../Utils/useScrollReveal";
import { CheckCircle, Email, Payment, ArrowBack, Shield } from "@mui/icons-material";

const steps = [
  { label: 'Choose Plan', icon: CheckCircle },
  { label: 'Verify Email', icon: Email },
  { label: 'Payment', icon: Payment },
];

const EmailVerification = () => {
  const selectedPlan = useSelector(s => s?.payment.paymentPlan);
  const user = useSelector(s => s?.user?.currentUser);
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const plan = location.state?.plan || selectedPlan?.selectedPlan;
  const heroRef = useScrollReveal({ threshold: 0.1 });

  const onVerify = useCallback((v) => setVerified(v), []);
  const onError = useCallback((e) => setError(e), []);

  if (verified && plan) {
    navigate(`/payment/${user?.id || user?.email || email}`, { state: { plan }, replace: true });
    return null;
  }
  if (verified && !plan) { navigate("/subscription", { replace: true }); return null; }

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Hero header */}
      <div className="relative pt-24 pb-8 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-brand-500/8 blur-[120px] pointer-events-none" />

        <div ref={heroRef} className="reveal max-w-[600px] mx-auto relative z-10">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === 1;
              const isPast = i < 1;
              return (
                <div key={step.label} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.7rem] font-medium transition-all duration-300
                    ${isActive ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : isPast ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-[#4a5568] border border-white/5'}`}>
                    <Icon sx={{ fontSize: 14 }} />
                    <span className="hidden sm:inline">{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-8 h-px ${i < 1 ? 'bg-emerald-500/30' : i === 1 ? 'bg-brand-500/30' : 'bg-white/10'}`} />
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-gradient text-xs font-bold uppercase tracking-[0.2em] mb-3 text-center m-0">Step 2 of 3</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white m-0 mb-2 text-center tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-[#8892b0] text-sm max-w-[380px] mx-auto text-center m-0">
            Enter your registered email and verify with the OTP to continue.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[500px] mx-auto px-5 pb-16">
        {/* Selected plan summary */}
        {plan && (
          <div className="glass-strong rounded-2xl p-5 mb-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center shrink-0">
                <CheckCircle className="text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm m-0">{plan.name} Plan</h3>
                <p className="text-[#5a6380] text-xs m-0">₹{plan.price} / {plan.interval}</p>
              </div>
              <Link to="/subscription" className="text-brand-300 text-[0.7rem] font-medium no-underline hover:text-brand-200 transition-colors shrink-0">
                Change
              </Link>
            </div>
          </div>
        )}

        {/* Verification card */}
        <div className="glass-strong rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-brand-500/5 blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            {/* Shield icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <Shield className="text-brand-400" sx={{ fontSize: 28 }} />
              </div>
            </div>

            <h2 className="text-lg font-bold text-white text-center m-0 mb-1">Email Verification</h2>
            <p className="text-[#5a6380] text-xs text-center m-0 mb-6">
              We'll send a one-time password to verify your identity.
            </p>

            <EmailSubscriptionVerify onEmailUpdate={setEmail} onEmailVerified={onVerify} onEmailError={onError} />
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mt-4 glass rounded-xl p-3 border border-red-500/20 animate-fade-in">
            <p className="text-red-400 text-sm m-0 text-center">{error}</p>
          </div>
        )}

        {/* Back link */}
        <div className="mt-6 text-center">
          <button onClick={() => navigate("/subscription")} className="inline-flex items-center gap-1.5 text-[#5a6380] text-xs hover:text-white transition-colors bg-transparent border-none cursor-pointer">
            <ArrowBack sx={{ fontSize: 14 }} /> Back to plan selection
          </button>
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex items-center justify-center gap-4 text-[0.65rem] text-[#3b4560]">
          <span className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-emerald-500/60" />
            SSL Encrypted
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-emerald-500/60" />
            Secure OTP
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
