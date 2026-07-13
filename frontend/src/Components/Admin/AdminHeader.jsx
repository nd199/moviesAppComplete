import { useLocation, useNavigate } from 'react-router-dom';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/userSlice';
import { clearAuth } from '../../authStore';
import axios from 'axios';

const getBaseURL = () => process.env.REACT_APP_API_URL || 'http://localhost:8080';

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getPageTitle = () => {
    const path = location.pathname.replace('/admin', '');
    const titles = {
      '/dashboard': 'Dashboard',
      '/users': 'Users Management',
      '/movies': 'Movies Management',
      '/shows': 'Shows Management',
      '/admins': 'Admins Management',
      '/content-managers': 'Content Managers',
      '/settings': 'Settings',
    };
    if (path.includes('/new')) return 'Create New';
    if (path.includes('/edit/')) return 'Edit';
    return titles[path] || 'Dashboard';
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await axios.post(`${getBaseURL()}/api/v1/auth/logout`, { refreshToken });
      }
    } catch (e) {}
    clearAuth();
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <header className="bg-gray-100 border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
        <p className="text-sm text-gray-600 mt-0.5">Manage your platform</p>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
          <IoNotificationsOutline className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
