import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginStart, loginFailure, setTokens, setAuthStatus, fetchCurrentSuccess } from '../../redux/userSlice';
import { setAccessToken, setRefreshToken } from '../../authStore';
import { fetchCurrentUserDetails } from '../../Network/ApiCalls';
import { contentManagerLogin } from '../../services/adminApi';
import { mockContentManagerUser } from '../../mockData';

const isMockMode = process.env.REACT_APP_MOCK_MODE === 'true';

const ContentManagerLogin = () => {
  const [email, setEmail] = useState("");
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
      const response = await contentManagerLogin({ email, password });
      const { accessToken, refreshToken } = response;
      setAccessToken(accessToken);
      if (refreshToken) setRefreshToken(refreshToken);
      dispatch(setTokens({ accessToken, refreshToken }));
      dispatch(setAuthStatus('authenticated'));
      if (isMockMode) dispatch(fetchCurrentSuccess(mockContentManagerUser));
      else await fetchCurrentUserDetails(dispatch);
      toast.success('Content Manager login successful!');
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 relative items-center justify-center p-12">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-white/10 rounded-3xl rotate-45" />
        <div className="relative z-10 max-w-md text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur mb-8 shadow-xl">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Content<br /><span className="text-white/90">Management</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            Manage your movies, shows, and content library from a beautiful dashboard.
          </p>
          <div className="mt-10 flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">567</p>
              <p className="text-sm text-white/60">Movies</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">234</p>
              <p className="text-sm text-white/60">Shows</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">4K</p>
              <p className="text-sm text-white/60">Quality</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
              <span className="text-white font-bold text-xl">C</span>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Content Manager Login</h2>
            <p className="text-gray-600 mt-1">Sign in to manage your content</p>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  placeholder="cm@cnio.dev" required />
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
                  className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  placeholder="Enter your password" required />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 text-sm">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : 'Sign In'}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-3">
            <Link to="/admin/login" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Admin Login
            </Link>
            <Link to="/login" className="block text-sm text-emerald-600 hover:text-emerald-700 font-semibold">
              ← Back to User Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagerLogin;
