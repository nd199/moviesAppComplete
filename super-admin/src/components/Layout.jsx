import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { HiHome, HiUserPlus, HiUsers, HiShieldCheck, HiArrowRightOnRectangle, HiSun, HiMoon, HiBars3 } from 'react-icons/hi2';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useState, useEffect, useCallback } from 'react';
import { getSessionStartTime, updateActivity, getLastActivityTime, clearAuth } from '../authStore';
import { SESSION_TIMEOUT_MS, ABSOLUTE_TIMEOUT_MS, WARNING_BEFORE_MS } from '../config';
import SessionWarning from './SessionWarning';

const navItems = [
  { name: 'Dashboard', href: '/super-admin', icon: HiHome },
  { name: 'Invite Admin', href: '/super-admin/invite', icon: HiUserPlus },
  { name: 'Admins', href: '/super-admin/admins', icon: HiUsers },
];

const Layout = () => {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = useCallback(async () => {
    await authAPI.logout();
    toast.success('Logged out');
    navigate('/super-admin/login');
  }, [navigate]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const handleActivity = () => updateActivity();
    events.forEach(e => document.addEventListener(e, handleActivity));

    const checkSession = setInterval(() => {
      const sessionStart = getSessionStartTime();
      const lastActivity = getLastActivityTime();

      if (!sessionStart) return;

      const now = Date.now();

      if (now - sessionStart > ABSOLUTE_TIMEOUT_MS) {
        clearAuth();
        navigate('/super-admin/login');
        toast.error('Session expired');
        return;
      }

      if (lastActivity && now - lastActivity > SESSION_TIMEOUT_MS) {
        clearAuth();
        navigate('/super-admin/login');
        toast.error('Session expired due to inactivity');
        return;
      }

      if (lastActivity && now - lastActivity > SESSION_TIMEOUT_MS - WARNING_BEFORE_MS) {
        setTimeRemaining(SESSION_TIMEOUT_MS - (now - lastActivity));
        setShowWarning(true);
      }
    }, 5000);

    return () => {
      events.forEach(e => document.removeEventListener(e, handleActivity));
      clearInterval(checkSession);
    };
  }, [navigate]);

  const handleStayLoggedIn = () => {
    updateActivity();
    setShowWarning(false);
  };

  const remainingMin = (() => {
    const lastActivity = getLastActivityTime();
    if (!lastActivity) return null;
    const remaining = SESSION_TIMEOUT_MS - (Date.now() - lastActivity);
    return remaining > 0 ? Math.ceil(remaining / 60000) : 0;
  })();

  const sidebarContent = (
    <>
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 flex-shrink-0">
            <HiShieldCheck className="w-5 h-5 text-white" />
          </div>
          {(!sidebarCollapsed || mobileOpen) && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-white whitespace-nowrap">Super Admin</h1>
              <p className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase">System Control</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/super-admin'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 text-red-400 border border-red-500/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
            title={sidebarCollapsed ? item.name : undefined}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {(!sidebarCollapsed || mobileOpen) && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-800 space-y-1">
        <button
          onClick={() => {
            setSidebarCollapsed(!sidebarCollapsed);
            setMobileOpen(false);
          }}
          className="hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
          title="Toggle sidebar"
        >
          <svg className={`h-5 w-5 flex-shrink-0 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <HiArrowRightOnRectangle className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || mobileOpen) && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className={`flex h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-100'}`}>
      {showWarning && (
        <SessionWarning onStayLoggedIn={handleStayLoggedIn} timeRemaining={timeRemaining} />
      )}

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — mobile: slide-in, desktop: persistent */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-gray-900 flex flex-col transition-all duration-300
        lg:relative lg:translate-x-0
        ${mobileOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${!mobileOpen && sidebarCollapsed ? 'lg:w-[72px]' : 'w-64'}
      `}>
        {sidebarContent}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'} border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0`}>
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <HiBars3 className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>System Control Panel</h1>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5 truncate`}>Manage administrators and system access</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {remainingMin != null && (
              <span className={`hidden sm:inline text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                Session: {remainingMin}m left
              </span>
            )}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            >
              {isDark ? <HiSun className="h-5 w-5" /> : <HiMoon className="h-5 w-5" />}
            </button>
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">SA</span>
            </div>
          </div>
        </header>
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
