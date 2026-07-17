import { NavLink } from 'react-router-dom';
import {
  HiHome,
  HiUserGroup,
  HiFilm,
  HiCog6Tooth,
  HiShieldCheck,
  HiTv,
  HiUser,
  HiArrowTopRightOnSquare,
} from 'react-icons/hi2';
import { useSelector } from 'react-redux';

const AdminSidebar = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const userRoles = currentUser?.roles || [];
  const isAdmin = userRoles.some(role =>
    role === 'ROLE_ADMIN' || role?.name === 'ROLE_ADMIN'
  );

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HiHome, adminOnly: true },
    { name: 'Users', href: '/admin/users', icon: HiUserGroup, adminOnly: true },
    { name: 'Admins', href: '/admin/admins', icon: HiShieldCheck, adminOnly: true },
    { name: 'Movies', href: '/admin/movies', icon: HiFilm, adminOnly: false },
    { name: 'Shows', href: '/admin/shows', icon: HiTv, adminOnly: false },
    { name: 'Content Managers', href: '/admin/content-managers', icon: HiUser, adminOnly: true },
    { name: 'Settings', href: '/admin/settings', icon: HiCog6Tooth, adminOnly: true },
  ];

  const filteredItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <NavLink to="/admin/dashboard" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight tracking-tight m-0">CN.io</h1>
            <p className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase m-0">Admin Panel</p>
          </div>
        </NavLink>
      </div>

      {/* Section label */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase m-0">Navigation</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {filteredItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 no-underline ${
                isActive
                  ? 'bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 shadow-sm border border-violet-200/60'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* View Site Link */}
      <div className="px-3 pb-2">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 no-underline">
          <HiArrowTopRightOnSquare className="h-4 w-4" />
          View Site
        </a>
      </div>

      {/* User Card */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white text-xs font-bold">
              {currentUser?.name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate m-0">{currentUser?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 truncate m-0">{currentUser?.email || 'admin'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
