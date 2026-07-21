import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuth } from '../authStore';

const SessionWarning = ({ onStayLoggedIn, timeRemaining }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(timeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1000) {
          clearInterval(timer);
          handleLogout();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/super-admin/login');
  };

  const minutes = Math.floor(countdown / 60000);
  const seconds = Math.floor((countdown % 60000) / 1000);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Session Expiring</h3>
        <p className="text-sm text-gray-500 mb-4">
          Your session will expire in{' '}
          <span className="font-mono font-bold text-amber-600">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
          >
            Logout
          </button>
          <button
            onClick={onStayLoggedIn}
            className="flex-1 py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionWarning;
