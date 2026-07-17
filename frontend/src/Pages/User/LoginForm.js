import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordRequest, login } from "../../Network/ApiCalls";
import { resetErrorMessage } from "../../redux/userSlice";
import loginUserBg from "./loginUserBg.jpg";
import { Mail, Lock, ArrowForward, Visibility, VisibilityOff } from "@mui/icons-material";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [popup, setPopup] = useState({ show: false, msg: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(s => s?.user?.errorMessage?.message || s?.user?.errorMessage);

  useEffect(() => () => dispatch(resetErrorMessage()), [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const em = email.toLowerCase().trim();
    if (!em || !password) { setPopup({ show: true, msg: "Enter both email and password" }); return; }
    setLoading(true);
    try {
      const response = await login(dispatch, { username: em, password });
      setPopup({ show: true, msg: "Login successful!" });

      const user = response?.user;
      const roles = user?.roles || [];
      const isAdmin = roles.some(r => r === 'ROLE_ADMIN' || r?.name === 'ROLE_ADMIN');
      const isCM = roles.some(r => r === 'ROLE_CONTENT_MANAGER' || r?.name === 'ROLE_CONTENT_MANAGER');

      setTimeout(() => {
        if (isAdmin || isCM) {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 800);
    } catch (err) {
      setPopup({ show: true, msg: err.response?.data?.message || err.response?.data?.error || 'Login failed.' });
    } finally { setLoading(false); }
  };

  const handleForgot = async () => {
    const em = email.toLowerCase().trim();
    if (!em) { setPopup({ show: true, msg: "Enter your email first." }); return; }
    setLoading(true);
    try { const r = await forgotPasswordRequest(dispatch, em); setPopup({ show: true, msg: r?.message || "Reset link sent." }); }
    catch (err) { setPopup({ show: true, msg: err.response?.data?.message || "Failed." }); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5 relative"
      style={{ backgroundImage: `linear-gradient(rgba(5,8,16,0.85),rgba(5,8,16,0.85)),url(${loginUserBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

      {/* Ambient glow */}
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-brand-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-accent-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] glass-strong rounded-3xl p-8 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.5)] relative z-10">
        {/* Top glow */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-[0_8px_30px_rgba(124,58,237,0.3)]">
            <span className="text-white font-black text-xl">C</span>
          </div>
          <h1 className="text-2xl font-black text-white m-0 mb-1 tracking-tight">Welcome Back</h1>
          <p className="text-[#5a6380] text-sm m-0">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a5568]" sx={{ fontSize: 18 }} />
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full glass rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:border-brand-500/40 focus:shadow-[0_0_20px_rgba(124,58,237,0.1)] transition-all" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a5568]" sx={{ fontSize: 18 }} />
              <input type={showPw ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full glass rounded-xl pl-10 pr-10 py-3 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:border-brand-500/40 focus:shadow-[0_0_20px_rgba(124,58,237,0.1)] transition-all" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5568] hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">
                {showPw ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-xs text-center py-2.5 px-3 bg-red-500/10 rounded-xl border border-red-500/20 animate-fade-in">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl btn-primary font-bold text-sm border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
            ) : (
              <>Sign In <ArrowForward sx={{ fontSize: 16 }} /></>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#5a6380] space-y-2.5">
          <p className="m-0">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 font-semibold no-underline hover:text-brand-300 transition-colors">Register</Link>
          </p>
          <p className="m-0">
            <span className="cursor-pointer hover:text-white transition-colors text-[0.85rem]" onClick={handleForgot}>
              Forgot password?
            </span>
          </p>
          <div className="mt-3 p-3 glass rounded-xl text-[#8892b0] text-xs font-medium">
            Demo: demo@example.com / Demo123456
          </div>
        </div>
      </div>

      {/* Popup modal */}
      {popup.show && (
        <div className="fixed inset-0 bg-surface-950/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="glass-strong rounded-2xl p-8 max-w-sm w-[90%] text-center shadow-2xl animate-slide-up">
            <p className="text-white text-sm mb-5 m-0">{popup.msg}</p>
            <button onClick={() => setPopup({ show: false, msg: "" })} className="px-8 py-2.5 rounded-xl btn-primary text-sm">OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
