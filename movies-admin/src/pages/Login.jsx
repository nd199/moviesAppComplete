import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      setError("");
    };
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
    setError("");
    
    dispatch(loginStart());
    
    try {
      const response = await authService.login({ 
        username, 
        password 
      });
      
      // Dispatch success action with admin data
      dispatch(loginSuccess({ 
        admin: response.user 
      }));
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error: ", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      dispatch(loginFailure(err.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(rgba(2, 6, 23, 0.78), rgba(2, 6, 23, 0.78)), url("/REGBack.jpg") no-repeat center center',
        backgroundSize: 'cover',
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-100">Movies Admin</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to manage your OTT platform</p>
        </div>

        <form onSubmit={loginHandler} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              placeholder="admin@domain.com"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
              className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
          </div>

          {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>}

          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-purple-600 px-4 text-sm font-semibold text-white shadow-lg shadow-red-500/10 hover:from-red-400 hover:to-purple-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        {error !== "Profile Not Found, If you are new here consider registering first, else contact us" && (
          <p className="text-white">
            Forgot Password? Click{" "}
            <Link to="/forgotPassword">
              <span className="text-purple-400 hover:text-purple-300 hover:underline transition-colors cursor-pointer">here</span>
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
