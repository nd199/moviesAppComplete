import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logout } from '../store/authSlice';
import {
  HomeIcon,
  UserGroupIcon,
  FilmIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { admin } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Users', href: '/users', icon: UserGroupIcon },
    { name: 'Movies', href: '/movies', icon: FilmIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex-shrink-0 relative">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Movies Admin</h1>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-800 border-r-4 border-blue-500 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-800">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {admin?.name?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{admin?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400">{admin?.email || 'admin@example.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors"
        >
          <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
