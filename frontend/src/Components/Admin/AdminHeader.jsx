import { useLocation, useNavigate } from 'react-router-dom';
import { IoNotificationsOutline } from 'react-icons/io5';
import { HiBars3 } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { performLogout } from '../../Utils/logout';

const AdminHeader = ({ onMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const getPageBreadcrumb = () => {
    const path = location.pathname.replace('/admin', '');
    if (path === '/dashboard') return 'Admin / Dashboard';
    if (path.includes('/movies')) return 'Admin / Movies';
    if (path.includes('/shows')) return 'Admin / Shows';
    if (path.includes('/users')) return 'Admin / Users';
    if (path.includes('/admins')) return 'Admin / Admins';
    if (path.includes('/content-managers')) return 'Admin / Content Managers';
    if (path.includes('/settings')) return 'Admin / Settings';
    return 'Admin';
  };

  const handleLogout = async () => {
    await performLogout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-surface-900 border-b border-surface-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-surface-500 hover:text-white hover:bg-surface-800 rounded-xl transition-all"
        >
          <HiBars3 className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">{getPageTitle()}</h1>
          <p className="text-xs sm:text-sm text-surface-500 mt-0.5 truncate">{getPageBreadcrumb()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* User badge — hidden on very small screens */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-800 border border-surface-700">
          <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-accent-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          <span className="text-xs font-medium text-white">{user?.name || 'Admin'}</span>
        </div>

        <button className="relative p-2 sm:p-2.5 text-surface-500 hover:text-white hover:bg-surface-800 rounded-xl transition-all duration-200">
          <IoNotificationsOutline className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-surface-900"></span>
        </button>

        <button onClick={handleLogout}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 text-xs sm:text-sm font-medium text-surface-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
