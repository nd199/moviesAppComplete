import { useLocation, useNavigate } from 'react-router-dom';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/userSlice';
import { clearAuth } from '../../authStore';
import axios from 'axios';

const getBaseURL = () => process.env.REACT_APP_API_URL || 'http://localhost:8080';

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(s => s?.user?.currentUser);

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

  const getPageSubtitle = () => {
    const path = location.pathname.replace('/admin', '');
    if (path.includes('/new')) return 'Add a new entry';
    if (path.includes('/edit/')) return 'Update existing record';
    return 'Manage your platform';
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
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">{getPageTitle()}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{getPageSubtitle()}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* User badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200">
          <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          <span className="text-xs font-medium text-gray-700">{user?.name || 'Admin'}</span>
        </div>

        <button className="relative p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
          <IoNotificationsOutline className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        <button onClick={handleLogout}
          className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
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
