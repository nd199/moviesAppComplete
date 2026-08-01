import { useLocation, useNavigate } from 'react-router-dom';
import { IoNotificationsOutline, IoSearchOutline } from 'react-icons/io5';
import { HiBars3, HiX, HiChevronDown } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { performLogout } from '../../Utils/logout';
import { fetchUnreadCount } from '../../redux/notificationRedux';
import NotificationDropdown from '../NotificationDropdown';

const AdminHeader = ({ onMenuToggle, collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(s => s?.user?.currentUser);
  const unreadCount = useSelector(s => s?.notification?.unreadCount || 0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname.replace('/admin', '');
    const titles = {
      '/dashboard': 'Dashboard',
      '/users': 'Users',
      '/movies': 'Movies',
      '/shows': 'Shows',
      '/admins': 'Admins',
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
    setProfileOpen(false);
    await performLogout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-surface-900/95 backdrop-blur-md border-b border-surface-700/50 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
      {/* Left: Menu toggle + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="p-2 text-surface-500 hover:text-white hover:bg-surface-800 rounded-xl transition-all"
        >
          {collapsed ? <HiXMark className="h-5 w-5" /> : <HiBars3 className="h-5 w-5" />}
        </button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">{getPageTitle()}</h1>
          <p className="text-xs sm:text-sm text-surface-500 mt-0.5 truncate">{getPageBreadcrumb()}</p>
        </div>
      </div>

      {/* Right: Search + Notifications + Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-800/60 border border-surface-700/50 text-surface-500 hover:border-surface-600 transition-all min-w-[200px]">
          <IoSearchOutline className="h-4 w-4 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-xs text-white placeholder-surface-500 outline-none border-none w-full"
          />
          <span className="text-[10px] text-surface-600 font-mono bg-surface-700/50 px-1.5 py-0.5 rounded">⌘K</span>
        </div>

        {/* Notifications */}
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative p-2 sm:p-2.5 text-surface-500 hover:text-white hover:bg-surface-800 rounded-xl transition-all duration-200"
        >
          <IoNotificationsOutline className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-surface-900">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-800/60 border border-surface-700/50 hover:bg-surface-800 hover:border-surface-600 transition-all group"
          >
            <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-accent-500 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <span className="hidden sm:block text-xs font-medium text-white">{user?.name || 'Admin'}</span>
            <HiChevronDown className={`h-3.5 w-3.5 text-surface-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-800 border border-surface-700 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50">
              {/* User info */}
              <div className="px-4 py-3 border-b border-surface-700">
                <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-surface-500 truncate">{user?.email || 'admin@example.com'}</p>
              </div>
              {/* Menu items */}
              <div className="p-2 space-y-0.5">
                <button onClick={() => { setProfileOpen(false); navigate('/admin/settings'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-surface-400 hover:text-white hover:bg-surface-700/50 transition-all text-left">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                <button onClick={() => { setProfileOpen(false); window.open('/', '_blank'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-surface-400 hover:text-white hover:bg-surface-700/50 transition-all text-left">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Site
                </button>
              </div>
              {/* Logout */}
              <div className="border-t border-surface-700 p-2">
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
