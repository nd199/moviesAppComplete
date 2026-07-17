import { useEffect, useState } from "react";
import PasswordStrengthBar from "react-password-strength-bar";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { updatePasswordAndPushToLoginPage } from "../../Network/ApiCalls";
import { Lock, ArrowBack } from "@mui/icons-material";

const ForgotPassword = () => {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [match, setMatch] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(() => { setToken(new URLSearchParams(window.location.search).get("token")); }, []);

  const onConfirm = (e) => { setConfirm(e.target.value); setMatch(pw === e.target.value && pw.length > 0 ? "Match" : "No match"); };

  const submit = async (e) => {
    e.preventDefault();
    if (match !== "Match") return;
    setLoading(true);
    try { await updatePasswordAndPushToLoginPage(dispatch, { token, newPassword: pw }); nav("/login"); }
    catch { setError("Failed to update password."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6 relative">
      {/* Ambient glow */}
      <div className="absolute top-[20%] left-[15%] w-[350px] h-[350px] bg-brand-500/5 blur-[140px] pointer-events-none" />

      <div className="w-full max-w-[440px] glass-strong rounded-3xl p-8 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.5)] relative z-10">
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-[50%] h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="text-brand-400" sx={{ fontSize: 24 }} />
          </div>
          <h1 className="text-xl font-black text-white m-0 mb-1 tracking-tight">Reset Password</h1>
          <p className="text-[#5a6380] text-sm m-0">Enter your new password below</p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider">New Password</label>
            <input type="password" placeholder="Min 8 characters" value={pw} onChange={e => setPw(e.target.value)} required
              className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:border-brand-500/40 focus:shadow-[0_0_20px_rgba(124,58,237,0.1)] transition-all" />
            {pw && <PasswordStrengthBar password={pw} />}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider">Confirm Password</label>
            <input type="password" placeholder="Repeat password" value={confirm} onChange={onConfirm} required
              className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:border-brand-500/40 focus:shadow-[0_0_20px_rgba(124,58,237,0.1)] transition-all" />
            {confirm && (
              <p className={`text-xs m-0 ${pw === confirm ? 'text-emerald-400' : 'text-red-400'}`}>
                {pw === confirm ? 'Passwords match' : 'Passwords do not match'}
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-400 text-xs text-center py-2.5 px-3 bg-red-500/10 rounded-xl border border-red-500/20 animate-fade-in">
              {error}
            </div>
          )}

          <button className="btn-primary w-full mt-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2" type="submit" disabled={loading || match !== "Match"}>
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Resetting...</>
            ) : "Reset Password"}
          </button>
        </form>

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
