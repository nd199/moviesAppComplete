import { useLocation } from 'react-router-dom';
import { IoNotificationsOutline } from 'react-icons/io5';
import UserProfileDropdown from './UserProfileDropdown';

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
      case '/users/edit/:id':
        return 'Edit User';
      case '/movies':
        return 'Movies Management';
      case '/movies/new':
        return 'Create New Movie';
      case '/movies/edit/:id':
        return 'Edit Movie';
      case '/shows':
        return 'Shows Management';
      case '/shows/new':
        return 'Create New Show';
      case '/shows/edit/:id':
        return 'Edit Show';
      case '/admins':
        return 'Admins Management';
      case '/admins/new':
        return 'Create New Admin';
      case '/admins/edit/:id':
        return 'Edit Admin';
      case '/contentManagers':
        return 'Content Managers';
      case '/contentManagers/new':
        return 'Create Content Manager';
      case '/contentManagers/edit/:id':
        return 'Edit Content Manager';
      case '/settings':
        return 'Settings';
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
      case '/users/edit/:id':
        return 'Update user information';
      case '/movies':
        return 'Manage movies and shows';
      case '/movies/new':
        return 'Add a new movie or show';
      case '/movies/edit/:id':
        return 'Update movie information';
      case '/shows':
        return 'Manage TV shows and series';
      case '/shows/new':
        return 'Add a new TV show or series';
      case '/shows/edit/:id':
        return 'Update show information';
      case '/admins':
        return 'Manage admin users';
      case '/admins/new':
        return 'Add a new admin user';
      case '/admins/edit/:id':
        return 'Update admin user information';
      case '/contentManagers':
        return 'Manage content managers';
      case '/contentManagers/new':
        return 'Add a new content manager';
      case '/contentManagers/edit/:id':
        return 'Update content manager information';
      case '/settings':
        return 'Configure application settings';
      default:
        return 'Welcome back to your admin panel';
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b border-slate-700 bg-slate-950 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">{getPageTitle()}</h2>
            <p className="text-sm text-slate-300">{getPageDescription()}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
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
