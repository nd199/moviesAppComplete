import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HiArrowRightOnRectangle, HiUser, HiCog6Tooth } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { loginSuccess } from '../store/authSlice';

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const admin = useSelector((state) => state.auth.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch current admin data if not available
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (!admin) {
          // Try to fetch based on user type
          const isContentManager = admin?.userType === 'content_manager';
          const response = isContentManager
            ? await authService.getCurrentContentManager()
            : await authService.getCurrentAdmin();
          dispatch(loginSuccess({ admin: response }));
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };

    fetchCurrentUser();
  }, [admin, dispatch]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const handleSettings = () => {
    navigate('/settings');
    setIsOpen(false);
  };

  // Helper function to get user display name
  const getUserDisplayName = (user) => {
    if (!user) return 'User';

    // Try different possible name properties
    if (user.name) return user.name;
    if (user.username) return user.username;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;

    return 'User';
  };

  // Helper function to get user email
  const getUserEmail = (user) => {
    if (!user) return 'user@example.com';

    return user.email || user.emailAddress || 'user@example.com';
  };

  // Helper function to get user role display
  const getUserRole = (user) => {
    if (!user) return 'User';

    const roles = user.roles || [];
    const primaryRole = roles.find(role =>
      role.name === 'ROLE_ADMIN' || role === 'ROLE_ADMIN'
    );

    if (primaryRole) return 'Admin';

    const cmRole = roles.find(role =>
      role.name === 'ROLE_CONTENT_MANAGER' || role === 'ROLE_CONTENT_MANAGER'
    );

    if (cmRole) return 'Content Manager';

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
            {getUserDisplayName(admin).charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-white">{getUserDisplayName(admin)}</p>
          <p className="text-xs text-slate-300">{getUserRole(admin)}</p>
        </div>
        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-slate-700 bg-slate-800 backdrop-blur shadow-2xl shadow-black/50 z-20">
            <div className="p-3 border-b border-slate-700">
              <p className="text-sm font-medium text-white">{getUserDisplayName(admin)}</p>
              <p className="text-xs text-slate-300">{getUserEmail(admin)}</p>
              <p className="text-xs text-slate-400 mt-1">{getUserRole(admin)}</p>
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
