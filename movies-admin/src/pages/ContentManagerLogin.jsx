import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';

const ContentManagerLogin = () => {
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
      const response = await authService.contentManagerLogin({
        email: username, // Backend expects email, not username
        password
      });

      // Dispatch success action with content manager data (follow admin pattern exactly)
      dispatch(loginSuccess({ 
        admin: response.user
      }));

      toast.success('Content Manager login successful!');
      navigate('/contentManagerDashboard');
    } catch (err) {
      console.error("Content Manager login error: ", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      dispatch(loginFailure(err.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-950"
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%), url("/REGBack.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-md">
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Logo/Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Content Manager</h1>
            <p className="text-slate-300">Sign in to your content manager account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={loginHandler} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In as Content Manager'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-2">
            <Link
              to="/forgot-password"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Forgot your password?
            </Link>
            <div className="text-sm text-slate-400">
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Admin Login
              </Link>
              {' | '}
              <Link
                to="/contentManagerLogin"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                Content Manager Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagerLogin;
