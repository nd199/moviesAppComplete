import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { updatePasswordAndPushToLoginPage } from "../../Network/ApiCalls";
import { Lock, ArrowBack, Visibility, VisibilityOff, CheckCircle } from "@mui/icons-material";

const ForgotPassword = () => {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    if (!t) { setError("Invalid or missing reset link."); return; }
    setToken(t);
  }, []);

  const pwMatch = confirm.length > 0 && pw === confirm;
  const pwMismatch = confirm.length > 0 && pw !== confirm;

  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNum = /\d/.test(pw);
  const hasSpec = /[!@#$%^&*(),.?":{}|<>]/.test(pw);
  const hasMinLen = pw.length >= 8;
  const allValid = hasUpper && hasLower && hasNum && hasSpec && hasMinLen;

  const submit = async (e) => {
    e.preventDefault();
    if (!pwMatch || !allValid) return;
    setLoading(true);
    setError("");
    try {
      await updatePasswordAndPushToLoginPage(dispatch, { token, newPassword: pw });
      setSuccess(true);
      setTimeout(() => nav("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to reset password. The link may have expired.");
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
        <div className="w-full max-w-[440px] text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle sx={{ fontSize: 32, color: '#10b981' }} />
          </div>
          <h1 className="text-2xl font-bold text-white m-0 mb-2">Password Reset!</h1>
          <p className="text-[#5a6380] text-sm m-0 mb-6">Redirecting you to login...</p>
          <Link to="/login" className="inline-flex items-center gap-2 text-brand-400 text-sm font-medium no-underline hover:text-brand-300 transition-colors">
            <ArrowBack sx={{ fontSize: 16 }} /> Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6 relative">
      <div className="absolute top-[20%] left-[15%] w-[350px] h-[350px] bg-brand-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] bg-accent-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] rounded-2xl bg-white/[0.03] border border-white/5 p-8 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.5)] relative z-10">
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-[50%] h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock sx={{ fontSize: 24, color: '#7c3aed' }} />
          </div>
          <h1 className="text-xl font-bold text-white m-0 mb-1">Reset Password</h1>
          <p className="text-[#5a6380] text-sm m-0">Enter your new password below</p>
        </div>

        {!token && !error ? (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider">New Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  required
                  className="w-full rounded-xl bg-white/[0.06] border border-white/10 px-4 py-3 pr-10 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:border-brand-500 transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#5a6380] hover:text-white cursor-pointer transition-colors">
                  {showPw ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  className="w-full rounded-xl bg-white/[0.06] border border-white/10 px-4 py-3 pr-10 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:border-brand-500 transition-all"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#5a6380] hover:text-white cursor-pointer transition-colors">
                  {showConfirm ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                </button>
              </div>
              {pwMatch && <p className="text-emerald-400 text-xs m-0">Passwords match</p>}
              {pwMismatch && <p className="text-red-400 text-xs m-0">Passwords do not match</p>}
            </div>

            {pw.length > 0 && (
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                <p className="text-[0.65rem] text-[#5a6380] mb-2 m-0 uppercase tracking-wider font-medium">Requirements</p>
                <ul className="space-y-1.5 list-none p-0 m-0">
                  {[
                    { label: "Uppercase letter (A-Z)", check: hasUpper },
                    { label: "Lowercase letter (a-z)", check: hasLower },
                    { label: "Number (0-9)", check: hasNum },
                    { label: "Special character (!@#$%^&*)", check: hasSpec },
                    { label: "8+ characters", check: hasMinLen },
                  ].map(({ label, check }) => (
                    <li key={label} className="text-xs flex items-center gap-2" style={{ color: check ? '#10b981' : 'rgb(156,163,175)' }}>
                      <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[0.6rem]"
                        style={{ borderColor: check ? '#10b981' : 'rgb(156,163,175)' }}>
                        {check && '✓'}
                      </span>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <div className="text-red-400 text-xs text-center py-2.5 px-3 bg-red-500/10 rounded-xl border border-red-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !pwMatch || !allValid}
              className={`w-full py-3.5 rounded-xl font-bold text-sm border-none transition-all flex items-center justify-center gap-2 ${
                loading || !pwMatch || !allValid
                  ? 'bg-white/5 text-[#5a6380] cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand-500 to-accent-500 text-white hover:shadow-lg hover:shadow-brand-500/25 cursor-pointer'
              }`}
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Resetting...</>
              ) : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-[#5a6380] text-xs hover:text-white transition-colors no-underline">
            <ArrowBack sx={{ fontSize: 14 }} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
