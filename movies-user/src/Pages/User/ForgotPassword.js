import { useEffect, useState } from "react";
import PasswordStrengthBar from "react-password-strength-bar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePasswordAndPushToLoginPage } from "../../Network/ApiCalls";

const ForgotPassword = () => {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [match, setMatch] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(() => { setToken(new URLSearchParams(window.location.search).get("token")); }, []);

  const onConfirm = (e) => { setConfirm(e.target.value); setMatch(pw === e.target.value && pw.length > 0 ? "Match" : "No match"); };

  const submit = async (e) => {
    e.preventDefault();
    if (match !== "Match") return;
    try { await updatePasswordAndPushToLoginPage(dispatch, { token, newPassword: pw }); nav("/Login"); }
    catch { setError("Failed to update password."); }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-[480px] glass rounded-2xl p-8">
        <h1 className="text-xl font-bold text-white m-0 mb-6 text-center">Reset Password</h1>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#8892b0]">New Password</label>
            <input type="password" placeholder="••••••••" value={pw} onChange={e => setPw(e.target.value)} required className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#5a6380] focus:outline-none focus:border-brand-500 transition-all" />
            {pw && <PasswordStrengthBar password={pw} />}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#8892b0]">Confirm Password</label>
            <input type="password" placeholder="••••••••" value={confirm} onChange={onConfirm} required className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#5a6380] focus:outline-none focus:border-brand-500 transition-all" />
            {confirm && <p className={`text-xs m-0 ${pw === confirm ? 'text-green-400' : 'text-red-400'}`}>{match}</p>}
          </div>
          <button className="btn-primary w-full mt-2" type="submit">Reset Password</button>
        </form>
        {error && <p className="text-red-400 text-sm text-center mt-4 m-0">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
