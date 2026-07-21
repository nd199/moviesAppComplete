import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { setPassword } from '../../services/adminApi';

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!token) { setError('Invalid or missing invitation link. Please request a new invite.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      await setPassword({ token, password, confirmPassword, type: 'admin' });
      toast.success('Password set successfully! You can now sign in.');
      navigate('/admin/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set password. The link may have expired.');
    } finally { setLoading(false); }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-14 h-14 bg-red-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Invalid Invitation Link</h2>
          <p className="text-surface-500">This invitation link is invalid or missing a token. Please contact your administrator for a new invite.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 flex relative overflow-hidden">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 relative items-center justify-center p-12">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-white/10 rounded-3xl rotate-45" />
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-white/10 rounded-2xl -rotate-12" />
        <div className="relative z-10 max-w-md text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur mb-8 shadow-xl">
            <span className="text-white font-bold text-3xl">M</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Set Up Your<br /><span className="text-white/90">Admin Account</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            Create a secure password to complete your admin account setup and access the dashboard.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-brand-600 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/25">
              <span className="text-white font-bold text-xl">M</span>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Set Your Password</h2>
            <p className="text-surface-500 mt-1">Choose a strong password for your admin account</p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-surface-500 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input type="password" value={password} onChange={(e) => setPasswordValue(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-surface-800 border border-surface-700 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-sm"
                  placeholder="At least 8 characters" required minLength={8} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-500 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-surface-800 border border-surface-700 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-sm"
                  placeholder="Re-enter your password" required minLength={8} />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 text-sm">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Setting password...
                </div>
              ) : 'Set Password & Sign In'}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-surface-700 text-center">
            <a href="/admin/login" className="text-sm text-brand-400 hover:text-brand-300 font-semibold">
              ← Back to Admin Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
