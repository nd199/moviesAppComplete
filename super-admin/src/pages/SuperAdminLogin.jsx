import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiShieldExclamation, HiLockClosed, HiEnvelope, HiSparkles, HiServer } from 'react-icons/hi2';
import Cookies from 'js-cookie';
import { authAPI } from '../services/api';

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);

      if (response.status === 200) {
        const token = response.data?.token;
        if (token) {
          Cookies.set('jwt_token', token, { expires: 7 });
          console.log('Login: Using token-based auth fallback');
        } else {
          console.log('Login: Authentication cookies set by server');
        }
        
        toast.success('Login successful!');
        navigate('/super-admin/invite');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-900 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <HiShieldExclamation className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-8 text-4xl font-bold text-white">
            SuperAdmin Portal
          </h2>
          <p className="mt-3 text-lg text-gray-300">
            Secure System Administrator Access
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <HiSparkles className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-gray-400">Movies Platform Management</span>
            <HiSparkles className="h-5 w-5 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="email"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600/30 bg-white/10 backdrop-blur-sm placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="admin@movies.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600/30 bg-white/10 backdrop-blur-sm placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="Enter secure password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <HiServer className="mr-2 h-5 w-5" />
                    Access System
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <HiShieldExclamation className="h-4 w-4" />
            <span>Secure • Encrypted • Monitored</span>
          </div>
          <p className="text-xs text-gray-500">
            This is a restricted area. All access attempts are logged and monitored.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default SuperAdminLogin;
