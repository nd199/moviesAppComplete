import { useLocation } from 'react-router-dom';
import { IoNotificationsOutline } from 'react-icons/io5';
import UserProfileDropdown from './UserProfileDropdown';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/users':
        return 'Users Management';
      case '/users/new':
        return 'Create New User';
      case '/movies':
        return 'Movies Management';
      case '/movies/new':
        return 'Create New Movie';
      default:
        return 'Dashboard';
    }
  };

  const getPageDescription = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Welcome back to your admin panel';
      case '/users':
        return 'Manage platform users';
      case '/users/new':
        return 'Add a new user to the platform';
      case '/movies':
        return 'Manage movies and shows';
      case '/movies/new':
        return 'Add a new movie or show';
      default:
        return 'Welcome back to your admin panel';
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/60 backdrop-blur">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">{getPageTitle()}</h2>
            <p className="text-sm text-slate-400">{getPageDescription()}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Dark</span>
              <DarkModeToggle />
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 text-slate-300 hover:text-white transition-colors">
              <IoNotificationsOutline className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User Profile Dropdown */}
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
