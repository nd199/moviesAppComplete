import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordRequest, login } from "../../Network/ApiCalls";
import { resetErrorMessage } from "../../redux/userSlice";
import loginUserBg from "./loginUserBg.jpg";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      
      // Role-based redirect
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
    <div className="flex items-center justify-center min-h-screen p-5 relative" style={{ backgroundImage: `linear-gradient(rgba(5,8,16,0.85),rgba(5,8,16,0.85)),url(${loginUserBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-full max-w-[400px] glass-strong rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative z-10 max-md:p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white m-0 mb-1">Welcome Back</h1>
          <p className="text-[#5a6380] text-sm m-0">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#8892b0]">Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:border-brand-500/40 transition-all" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#8892b0]">Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:border-brand-500/40 transition-all" />
          </div>
          {error && <div className="text-red-400 text-xs text-center py-2 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl btn-primary border-none disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#5a6380] space-y-2">
          <p className="m-0">Don't have an account? <Link to="/register" className="text-brand-400 font-semibold no-underline hover:text-brand-300">Register</Link></p>
          <p className="m-0"><span className="cursor-pointer hover:text-white transition-colors" onClick={handleForgot}>Forgot password?</span></p>
          <p className="m-0"><Link to="/admin/login" className="text-brand-400 font-semibold no-underline hover:text-brand-300">Admin Login</Link></p>
          <div className="mt-4 p-3 glass rounded-xl text-[#8892b0] text-xs font-medium">
            Demo: demo@example.com / Demo123456
          </div>
        </div>
      </div>

      {popup.show && (
        <div className="fixed inset-0 bg-surface-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-strong rounded-2xl p-8 max-w-sm w-[90%] text-center shadow-2xl">
            <p className="text-white text-sm mb-5 m-0">{popup.msg}</p>
            <button onClick={() => setPopup({ show: false, msg: "" })} className="px-6 py-2.5 rounded-xl btn-primary !p-2">OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
