import { NavLink } from 'react-router-dom';
import {
  HiHome,
  HiUserGroup,
  HiFilm,
  HiCog6Tooth,
  HiShieldCheck,
  HiTv,
  HiUser,
} from 'react-icons/hi2';

const Sidebar = () => {

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HiHome },
    { name: 'Users', href: '/users', icon: HiUserGroup },
    { name: 'Admins', href: '/admins', icon: HiShieldCheck },
    { name: 'Movies', href: '/movies', icon: HiFilm },
    { name: 'Shows', href: '/shows', icon: HiTv },
    { name: 'Content Managers', href: '/contentManagers', icon: HiUser },
    { name: 'Settings', href: '/settings', icon: HiCog6Tooth },
  ];

  return (
    <div className="w-48 fixed top-0 left-0 h-screen bg-slate-900 text-white border-r border-slate-700 z-50 shadow-sm">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-semibold tracking-wide text-white">Movies Admin</h1>
        <div className="mt-2 h-px w-full bg-gradient-to-r from-red-400/30 via-purple-400/20 to-transparent" />
      </div>

      <nav className="mt-6 overflow-y-auto pb-40">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-900/30 border-r-2 border-blue-500 text-blue-200'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
