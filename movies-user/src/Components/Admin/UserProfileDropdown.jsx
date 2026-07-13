import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HiArrowRightOnRectangle, HiCog6Tooth } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/userSlice';
import { clearAuth } from '../../authStore';
import axios from 'axios';

const getBaseURL = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:8080';
};

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await axios.post(`${getBaseURL()}/api/v1/auth/logout`, { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      dispatch(logout());
      navigate('/admin/login');
    }
  };

  const handleSettings = () => {
    navigate('/admin/settings');
    setIsOpen(false);
  };

  const getUserDisplayName = (user) => {
    if (!user) return 'User';
    if (user.name) return user.name;
    if (user.username) return user.username;
    return 'User';
  };

  const getUserEmail = (user) => {
    if (!user) return 'user@example.com';
    return user.email || 'user@example.com';
  };

  const getUserRole = (user) => {
    if (!user) return 'User';
    const roles = user.roles || [];
    if (roles.some(r => r === 'ROLE_ADMIN' || r?.name === 'ROLE_ADMIN')) return 'Admin';
    if (roles.some(r => r === 'ROLE_CONTENT_MANAGER' || r?.name === 'ROLE_CONTENT_MANAGER')) return 'Content Manager';
    return 'User';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {getUserDisplayName(currentUser).charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-white">{getUserDisplayName(currentUser)}</p>
          <p className="text-xs text-slate-300">{getUserRole(currentUser)}</p>
        </div>
        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-slate-700 bg-slate-800 backdrop-blur shadow-2xl shadow-black/50 z-20">
            <div className="p-3 border-b border-slate-700">
              <p className="text-sm font-medium text-white">{getUserDisplayName(currentUser)}</p>
              <p className="text-xs text-slate-300">{getUserEmail(currentUser)}</p>
              <p className="text-xs text-slate-400 mt-1">{getUserRole(currentUser)}</p>
            </div>

            <div className="p-2">
              <button
                onClick={handleSettings}
                className="flex items-center w-full px-3 py-2 text-sm text-slate-400 hover:bg-slate-700 hover:text-white rounded transition-colors"
              >
                <HiCog6Tooth className="mr-3 h-4 w-4" />
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm text-slate-400 hover:bg-slate-700 hover:text-white rounded transition-colors"
              >
                <HiArrowRightOnRectangle className="mr-3 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfileDropdown;
