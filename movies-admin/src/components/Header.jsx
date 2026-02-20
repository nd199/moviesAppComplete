import { useLocation } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';

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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{getPageTitle()}</h2>
            <p className="text-sm text-gray-600">{getPageDescription()}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
