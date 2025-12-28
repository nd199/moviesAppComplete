import { ArrowDropDown, Close, Menu, Notifications } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import Lottie from "react-lottie";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";
import popcornAnimation from "../Utils/animations/popcorn.json";
import "./NavBar.css";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: popcornAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const toggleDropdown = useCallback(() => {
    setDropdownOpen((prev) => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const userLogoutHandler = useCallback(() => {
    localStorage.removeItem("persist:root");
    dispatch(logout());
    navigate("/Login");
  }, [dispatch, navigate]);

  const userProfileHandler = useCallback(() => {
    navigate("/Profile");
    closeDropdown();
  }, [navigate, closeDropdown]);

  const closeMobileMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <nav className="nav-container">
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
        <ul className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>
          <li>
            <Link to="/" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/About" onClick={closeMobileMenu}>
              About
            </Link>
          </li>
          <li>
            <Link to="/Movies" onClick={closeMobileMenu}>
              Movies
            </Link>
          </li>
          <li>
            <Link to="/Shows" onClick={closeMobileMenu}>
              Shows
            </Link>
          </li>
        </ul>
        <div className="nav-right">
          <div className="profile-container">
            <button className="profile-btn" onClick={toggleDropdown}>
              <div className="profile-image">
                <img
                  src={
                    user?.currentUser?.imageUrl || "/images/default-avatar.png"
                  }
                  alt="Profile"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              </div>
              <ArrowDropDown />
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <button className="dropdown-item" onClick={userProfileHandler}>
                  Profile
                </button>
                <hr />
                <button
                  className="dropdown-item logout"
                  onClick={userLogoutHandler}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <Notifications className="notification-icon" />
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {menuOpen ? <Close /> : <Menu />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
