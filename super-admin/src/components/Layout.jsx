import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { HiHome, HiUserPlus, HiUsers, HiShieldCheck, HiArrowRightOnRectangle, HiSun, HiMoon } from 'react-icons/hi2';
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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

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

  return (
    <div className={`flex h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-100'}`}>
      {showWarning && (
        <SessionWarning onStayLoggedIn={handleStayLoggedIn} timeRemaining={timeRemaining} />
      )}

      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-[72px]' : 'w-64'} bg-gray-900 flex flex-col transition-all duration-300`}>
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 flex-shrink-0">
              <HiShieldCheck className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
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
              {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800 space-y-1">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
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
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'} border-b px-6 py-4 flex items-center justify-between flex-shrink-0`}>
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>System Control Panel</h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>Manage administrators and system access</p>
          </div>
          <div className="flex items-center gap-3">
            {remainingMin != null && (
              <span className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
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
        <main className={`flex-1 overflow-y-auto p-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
