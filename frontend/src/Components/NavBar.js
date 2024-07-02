import React, { useEffect, useState } from "react";
import "./NavBar.css";
import Lottie from "react-lottie";
import popcornAnimation from "../animations/popcorn.json";
import { ArrowDropDown, Close, Menu, Notifications } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useNavigate();
  const user = useSelector((state) => state.user);
  let dropdownTimeout;

  window.onscroll = () => {
    setIsScrolled(window.scrollY === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: popcornAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    return () => {
      clearTimeout(dropdownTimeout);
    };
  }, []);

  const toggleDropdown = () => {
    clearTimeout(dropdownTimeout);
    setDropdownOpen(!dropdownOpen);
    dropdownTimeout = setTimeout(() => {
      setDropdownOpen(false);
    }, 20000);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const userLogoutHandler = () => {
    localStorage.removeItem("persist:root");
    nav("/Login");
    user.currentUser = null;
    window.location.reload();
  };

  return (
    <div className={isScrolled ? "nav-bar scrolled" : "nav-bar"}>
      <div className="nav-wrapper">
        <div className="leftNavbar">
          <div className="logo">
            <Lottie options={defaultOptions} height={70} width={70} />
            <span className="title">CN.io</span>
          </div>
          <div className={menuOpen ? "nav-links open" : "nav-links"}>
            <Link to={"/"} onClick={() => setMenuOpen(false)}>
              <span>Home</span>
            </Link>
            <Link to={"/About"} onClick={() => setMenuOpen(false)}>
              <span>About Us</span>
            </Link>
            <Link to={"/Movies"} onClick={() => setMenuOpen(false)}>
              <span>Movies</span>
            </Link>
            <Link to={"/Shows"} onClick={() => setMenuOpen(false)}>
              <span>Shows</span>
            </Link>
            <Link to={"/"} onClick={() => setMenuOpen(false)}>
              <span>My WishList</span>
            </Link>
          </div>
        </div>
        <div className="rightNavbar">
          <div className="profile">
            <div className="p-image">
              <img
                src={user?.currentUser?.imageUrl || "images/naren.png"}
                alt=""
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
              <ArrowDropDown className="dropdown" onClick={toggleDropdown} />
            </div>
            <span>kids</span>
            <Notifications className="notify" />
            {dropdownOpen && (
              <div className="profile-drop">
                <div className="options">
                  <span>Settings</span>
                  <hr />
                  <span onClick={userLogoutHandler}>Logout</span>
                </div>
              </div>
            )}
          </div>
          <div className="hamburger" onClick={toggleMenu}>
            {menuOpen ? <Close /> : <Menu />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
