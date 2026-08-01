import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  Film,
  Settings,
  ShieldCheck,
  Tv,
  User,
  ExternalLink,
} from 'lucide-react';
import { useSelector } from 'react-redux';

const AdminSidebar = ({ collapsed = false }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const userRoles = currentUser?.roles || [];
  const isAdmin = userRoles.includes('ROLE_ADMIN');

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home, adminOnly: true },
    { name: 'Users', href: '/admin/users', icon: Users, adminOnly: true },
    { name: 'Admins', href: '/admin/admins', icon: ShieldCheck, adminOnly: true },
    { name: 'Movies', href: '/admin/movies', icon: Film, adminOnly: false },
    { name: 'Shows', href: '/admin/shows', icon: Tv, adminOnly: false },
    { name: 'Content Managers', href: '/admin/content-managers', icon: User, adminOnly: true },
    { name: 'Settings', href: '/admin/settings', icon: Settings, adminOnly: true },
  ];

  const filteredItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} h-full bg-surface-900 border-r border-surface-700 flex flex-col transition-all duration-300`}>
      {/* Logo */}
      <div className={`${collapsed ? 'px-2 py-5' : 'px-5 py-5'} border-b border-surface-700`}>
        <NavLink to="/admin/dashboard" className={`flex items-center no-underline ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 via-brand-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 flex-shrink-0">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-white leading-tight tracking-tight m-0">CN.io</h1>
              <p className="text-[10px] text-surface-500 font-semibold tracking-widest uppercase m-0">Admin Panel</p>
            </div>
          )}
        </NavLink>
      </div>

      {/* Section label */}
      {!collapsed && (
        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] font-semibold text-surface-500 tracking-widest uppercase m-0">Navigation</p>
        </div>
      )}

      {/* Navigation */}
      <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-3'} space-y-0.5 overflow-y-auto`}>
        {filteredItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            title={collapsed ? item.name : undefined}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2.5'} rounded-xl text-sm font-medium transition-all duration-200 no-underline ${isActive
                ? 'bg-brand-600/15 text-brand-300 shadow-sm border border-brand-500/20'
                : 'text-surface-500 hover:bg-surface-800 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && item.name}
          </NavLink>
        ))}
      </nav>

      {/* View Site Link */}
      <div className={`${collapsed ? 'px-2 pb-2' : 'px-3 pb-2'}`}>
        <a href="/" target="_blank" rel="noopener noreferrer" title={collapsed ? 'View Site' : undefined}
          className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-2.5'} rounded-xl text-sm font-medium text-surface-500 hover:text-white hover:bg-surface-800 transition-all duration-200 no-underline`}>
          <ExternalLink className="h-4 w-4" />
          {!collapsed && 'View Site'}
        </a>
      </div>

      {/* User Card */}
      <div className={`${collapsed ? 'p-2' : 'p-3'} border-t border-surface-700`}>
        <div className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2.5'} rounded-xl bg-surface-800`}>
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 via-brand-600 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white text-xs font-bold">
              {currentUser?.name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate m-0">{currentUser?.name || 'Admin'}</p>
              <p className="text-xs text-surface-500 truncate m-0">{currentUser?.email || 'admin'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
