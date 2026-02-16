import { ArrowDropDown, Close, Menu, Notifications } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import Lottie from "react-lottie";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";
import api from "../AxiosMethods";
import popcornAnimation from "../Utils/animations/popcorn.json";
import "./NavBar.css";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.currentUser);

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
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeMobileMenu = useCallback(() => setMenuOpen(false), []);

  const handleLogout = useCallback(async () => {
    try {
      // Call backend logout to clear HttpOnly cookies
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear redux state
    dispatch(logout());
    navigate("/login");
    closeDropdown();
    closeMobileMenu();
  }, [dispatch, navigate, closeDropdown, closeMobileMenu]);

  const goToProfile = useCallback(() => {
    navigate("/profile");
    closeDropdown();
    closeMobileMenu();
  }, [navigate, closeDropdown, closeMobileMenu]);

  return (
    <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <nav className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo-container" onClick={closeMobileMenu}>
          <div className="logo">
            <Lottie
              options={defaultOptions}
              height={isScrolled ? 50 : 60}
              width={isScrolled ? 50 : 60}
            />
            <span className="logo-title">CN.io</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>
          <li>
            <Link to="/" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={closeMobileMenu}>
              About
            </Link>
          </li>
          <li>
            <Link to="/movies" onClick={closeMobileMenu}>
              Movies
            </Link>
          </li>
          <li>
            <Link to="/shows" onClick={closeMobileMenu}>
              Shows
            </Link>
          </li>
        </ul>

        {/* Right Side */}
        <div className="nav-right">
          {/* Profile */}
          {currentUser && (
            <div className="profile-container">
              <button className="profile-btn" onClick={toggleDropdown}>
                <div className="profile-image">
                  <img
                    src={currentUser.imageUrl || "/images/defaultAvatar.png"}
                    alt="Profile"
                    onError={(e) => {
                      e.target.src = "/images/default-avatar.png";
                    }}
                  />
                </div>
                <ArrowDropDown />
              </button>

              {dropdownOpen && (
                <div className="profile-dropdown">
                  <button className="dropdown-item" onClick={goToProfile}>
                    Profile
                  </button>
                  <hr />
                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Notifications */}
          <Notifications className="notification-icon" />

          {/* Mobile menu toggle */}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {menuOpen ? <Close /> : <Menu />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
