import { ArrowDropDown, Menu, Notifications, Person, Bookmark, History, CreditCard, Settings, Help } from "@mui/icons-material";
import { Badge } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import Lottie from "react-lottie";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/userSlice";
import api from "../AxiosMethods";
import { clearAuth, getRefreshToken } from "../authStore";
import popcornAnimation from "../Utils/animations/popcorn.json";
import "./NavBar.css";

const NavBar = ({ onMenuClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.currentUser);
  const hideSignIn = location.pathname === '/login';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: popcornAnimation,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  const toggleDropdown = useCallback(
    () => setDropdownOpen((prev) => !prev),
    []
  );
  const closeDropdown = useCallback(() => setDropdownOpen(false), []);
  const handleLogout = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken();
      await api.post('/auth/logout', refreshToken ? { refreshToken } : {});
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    clearAuth();
    dispatch(logout());
    navigate("/login");
    closeDropdown();
  }, [dispatch, navigate, closeDropdown]);

  const goToProfile = useCallback(() => {
    navigate("/profile");
    closeDropdown();
  }, [navigate, closeDropdown]);

  return (
    <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <nav className="nav-container">
        <Link to="/" className="logo-container">
          <div className="logo">
            <Lottie
              options={defaultOptions}
              height={isScrolled ? 40 : 50}
              width={isScrolled ? 40 : 50}
            />
            <span className="logo-title">CN.io</span>
          </div>
        </Link>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/movies">Movies</Link></li>
          <li><Link to="/shows">Shows</Link></li>
          {currentUser && <li><Link to="/watchlist">Watchlist</Link></li>}
        </ul>

        <div className="nav-right">
          {currentUser ? (
            <div className="profile-container">
              <button className="profile-btn" onClick={toggleDropdown}>
                <div className="profile-image-wrapper">
                  <img
                    src={currentUser.imageUrl || "/images/defaultAvatar.png"}
                    alt={currentUser.name || "Profile"}
                    className="profile-img"
                    onError={(e) => {
                      e.target.src = "/images/default-avatar.png";
                    }}
                  />
                  <div className="profile-online-dot"></div>
                </div>
                <span className="profile-name">{currentUser.name || 'User'}</span>
                <ArrowDropDown className="profile-arrow" />
              </button>

              {dropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <img
                      src={currentUser.imageUrl || "/images/defaultAvatar.png"}
                      alt={currentUser.name || "Profile"}
                      className="dropdown-avatar"
                      onError={(e) => {
                        e.target.src = "/images/default-avatar.png";
                      }}
                    />
                    <div className="dropdown-user-info">
                      <span className="dropdown-user-name">{currentUser.name || 'User'}</span>
                      <span className="dropdown-user-email">{currentUser.email || ''}</span>
                    </div>
                  </div>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item" onClick={goToProfile}>
                    <Person /> Profile
                  </button>
                  <button className="dropdown-item">
                    <Bookmark /> My List
                  </button>
                  <button className="dropdown-item">
                    <History /> Watch History
                  </button>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item">
                    <CreditCard /> Subscription
                  </button>
                  <button className="dropdown-item">
                    <Settings /> Settings
                  </button>
                  <button className="dropdown-item">
                    <Help /> Help Center
                  </button>
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            !hideSignIn && (<Link to="/login" className="login-btn">
              Sign In
            </Link>)
          )}

          <Badge badgeContent={3} color="error" className="notification-badge">
            <Notifications className="notification-icon" />
          </Badge>

          <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Open menu">
            <Menu />
          </button>
          
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
