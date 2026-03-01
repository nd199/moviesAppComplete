import { NavLink } from 'react-router-dom';
import {
  HiHome,
  HiUserGroup,
  HiFilm,
  HiCog6Tooth,
  HiShieldCheck,
} from 'react-icons/hi2';

const Sidebar = () => {

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HiHome },
    { name: 'Users', href: '/users', icon: HiUserGroup },
    { name: 'Admins', href: '/admins', icon: HiShieldCheck },
    { name: 'Movies', href: '/movies', icon: HiFilm },
    { name: 'Settings', href: '/settings', icon: HiCog6Tooth },
  ];

  return (
    <div className="w-48 fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white flex-shrink-0 relative border-r border-white/10 z-50">
      <div className="p-6">
        <h1 className="text-xl font-semibold tracking-wide">Movies Admin</h1>
        <div className="mt-2 h-px w-full bg-gradient-to-r from-red-500/40 via-purple-500/30 to-transparent" />
      </div>
      
      <nav className="mt-6 overflow-y-auto pb-40">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 border-r-2 border-red-500 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
