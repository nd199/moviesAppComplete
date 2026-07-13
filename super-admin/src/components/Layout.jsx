import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { HiHome, HiUserPlus, HiUsers, HiShieldCheck, HiArrowRightOnRectangle } from 'react-icons/hi2';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const navItems = [
  { name: 'Dashboard', href: '/super-admin', icon: HiHome },
  { name: 'Invite Admin', href: '/super-admin/invite', icon: HiUserPlus },
  { name: 'Admins', href: '/super-admin/admins', icon: HiUsers },
];

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authAPI.logout();
    toast.success('Logged out');
    navigate('/super-admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <HiShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Super Admin</h1>
              <p className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase">System Control</p>
            </div>
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
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <HiArrowRightOnRectangle className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-100 border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">System Control Panel</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage administrators and system access</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">SA</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
