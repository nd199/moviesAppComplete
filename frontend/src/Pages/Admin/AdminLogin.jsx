import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginStart, loginFailure, setTokens, setAuthStatus, fetchCurrentSuccess } from '../../redux/userSlice';
import { setAccessToken, setRefreshToken } from '../../authStore';
import { fetchCurrentUserDetails } from '../../Network/ApiCalls';
import { adminLogin } from '../../services/adminApi';
import { mockAdminUser } from '../../mockData';

const isMockMode = process.env.REACT_APP_MOCK_MODE === 'true';

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    dispatch(loginStart());
    try {
      const response = await adminLogin({ username, password });
      const { accessToken, refreshToken } = response;
      setAccessToken(accessToken);
      if (refreshToken) setRefreshToken(refreshToken);
      dispatch(setTokens({ accessToken, refreshToken }));
      dispatch(setAuthStatus('authenticated'));
      if (isMockMode) dispatch(fetchCurrentSuccess(mockAdminUser));
      else await fetchCurrentUserDetails(dispatch);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      dispatch(loginFailure(err.response?.data?.message || "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex relative overflow-hidden">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 relative items-center justify-center p-12">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-white/10 rounded-3xl rotate-45" />
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-white/10 rounded-2xl -rotate-12" />
        <div className="relative z-10 max-w-md text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur mb-8 shadow-xl">
            <span className="text-white font-bold text-3xl">M</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Welcome to the<br /><span className="text-white/90">Admin Panel</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            Manage your content, users, and subscriptions from one powerful dashboard.
          </p>
          <div className="mt-10 flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-sm text-white/60">Users</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">567</p>
              <p className="text-sm text-white/60">Movies</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-sm text-white/60">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/25">
              <span className="text-white font-bold text-xl">M</span>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Sign in to Admin</h2>
            <p className="text-gray-600 mt-1">Enter your credentials to access the panel</p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={loginHandler} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
                  placeholder="admin@cnio.dev" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
                  placeholder="Enter your password" required />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 text-sm">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : 'Sign In'}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-3">
            <Link to="/admin/cm-login" className="block text-sm text-gray-600 hover:text-violet-600 transition-colors font-medium">
              Content Manager Login
            </Link>
            <Link to="/login" className="block text-sm text-violet-600 hover:text-violet-700 font-semibold">
              ← Back to User Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
