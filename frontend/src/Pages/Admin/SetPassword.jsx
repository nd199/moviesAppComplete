import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiLockClosed, HiEye, HiEyeSlash, HiExclamationTriangle } from 'react-icons/hi2';
import api from '../../AxiosMethods';

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) setError('Invalid or missing invitation token');
  }, [token]);

  const checkPasswordStrength = (password) => {
    if (!password) { setPasswordStrength(''); return; }
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#20c997'];
    setPasswordStrength({ text: levels[Math.min(strength - 1, 4)], color: colors[Math.min(strength - 1, 4)] });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') checkPasswordStrength(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password.length < 8) { setError('Password must be at least 8 characters'); setLoading(false); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }

    try {
      const response = await api.post('/auth/set-password', {
        token, password: formData.password, confirmPassword: formData.confirmPassword, type: type || 'admin'
      });
      if (response.status === 200) {
        toast.success(`${type === 'content-manager' ? 'Content Manager' : 'Admin'} account created! Redirecting...`);
        setTimeout(() => navigate(type === 'content-manager' ? '/admin/cm-login' : '/admin/login'), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
            <HiExclamationTriangle className="h-16 w-16 text-red-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-100 mb-2">Invalid Invitation</h2>
            <p className="text-slate-400">This invitation link is invalid or has expired.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center border border-white/10 bg-gradient-to-br ${type === 'content-manager' ? 'from-green-500/30 to-teal-600/30' : 'from-red-500/30 to-purple-600/30'}`}>
            <HiLockClosed className="h-8 w-8 text-slate-100" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-100">Setup Your {type === 'content-manager' ? 'Content Manager' : 'Admin'} Account</h2>
          <p className="mt-2 text-sm text-slate-400">Create your password to access the platform</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          {error && <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"><p className="text-red-200 text-sm">{error}</p></div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handlePasswordChange}
                  className="appearance-none relative block w-full pr-10 pl-3 py-3 border border-white/10 bg-slate-950/40 placeholder-slate-500 text-slate-100 rounded-lg focus:outline-none focus:ring-red-500/50 sm:text-sm" placeholder="Enter your password" />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <HiEyeSlash className="h-5 w-5 text-slate-400" /> : <HiEye className="h-5 w-5 text-slate-400" />}
                </button>
              </div>
              {passwordStrength && <div className="mt-2"><span className="text-xs font-medium" style={{ color: passwordStrength.color }}>Password strength: {passwordStrength.text}</span></div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <div className="relative">
                <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={handlePasswordChange}
                  className="appearance-none relative block w-full pr-10 pl-3 py-3 border border-white/10 bg-slate-950/40 placeholder-slate-500 text-slate-100 rounded-lg focus:outline-none focus:ring-purple-500/40 sm:text-sm" placeholder="Confirm your password" />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <HiEyeSlash className="h-5 w-5 text-slate-400" /> : <HiEye className="h-5 w-5 text-slate-400" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r ${type === 'content-manager' ? 'from-green-500 to-teal-600 hover:from-green-400 hover:to-teal-500' : 'from-red-500 to-purple-600 hover:from-red-400 hover:to-purple-500'} disabled:opacity-50 transition duration-200`}>
              {loading ? 'Creating Account...' : `Create ${type === 'content-manager' ? 'Content Manager' : 'Admin'} Account`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
