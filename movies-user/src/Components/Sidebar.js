import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Info, 
  Movie, 
  Tv, 
  Bookmark, 
  Close,
  Settings,
  CreditCard,
  History,
  Help,
  Logout
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';
import { clearAuth, getRefreshToken } from '../authStore';
import api from '../AxiosMethods';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.currentUser);
  const authStatus = useSelector((state) => state.user?.authStatus);
  
  const isAuthenticated = authStatus === 'authenticated';

  console.log('Sidebar render - isOpen:', isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = async () => {
    try {
      const refreshToken = getRefreshToken();
      await api.post('/auth/logout', refreshToken ? { refreshToken } : {});
    } catch (error) {
      console.error('Logout error:', error);
    }
    clearAuth();
    dispatch(logout());
    onClose();
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Info },
    { path: '/movies', label: 'Movies', icon: Movie },
    { path: '/shows', label: 'TV Shows', icon: Tv },
    { path: '/watchlist', label: 'Watchlist', icon: Bookmark },
  ];

  return (
    <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="sidebar-container" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={handleLinkClick}>
            CN.io
          </Link>
          <button className="sidebar-close" onClick={onClose}>
            <Close />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <item.icon />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {isAuthenticated && currentUser && (
          <div className="sidebar-user">
            <div className="sidebar-user-info">
              <img 
                src={currentUser.imageUrl || "/images/defaultAvatar.png"} 
                alt={currentUser.name}
                className="sidebar-user-avatar"
              />
              <div className="sidebar-user-details">
                <span className="sidebar-user-name">{currentUser.name}</span>
                <span className="sidebar-user-email">{currentUser.email}</span>
              </div>
            </div>

            <div className="sidebar-menu">
              <Link to="/profile" className="sidebar-menu-item" onClick={handleLinkClick}>
                <Settings />
                <span>Settings</span>
              </Link>
              <Link to="/subscription" className="sidebar-menu-item" onClick={handleLinkClick}>
                <CreditCard />
                <span>Subscription</span>
              </Link>
              <Link to="/history" className="sidebar-menu-item" onClick={handleLinkClick}>
                <History />
                <span>Watch History</span>
              </Link>
              <Link to="/help" className="sidebar-menu-item" onClick={handleLinkClick}>
                <Help />
                <span>Help Center</span>
              </Link>
              <button className="sidebar-menu-item sidebar-logout" onClick={handleLogout}>
                <Logout />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
