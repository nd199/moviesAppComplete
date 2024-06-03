import React, { useEffect, useState } from "react";
import "./Navbar.css";
import Lottie from "react-lottie";
import popcornAnimation from "../animations/popcorn.json";
import { ArrowDropDown, Notifications } from "@mui/icons-material";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  return (
    <div className={isScrolled ? "nav-bar scrolled" : "nav-bar"}>
      <div className="nav-wrapper">
        <div className="leftNavbar">
          <div className="logo">
            <Lottie options={defaultOptions} height={70} width={70} />
            <span className="title">CN.io</span>
          </div>
          <div className="nav-links">
            <Link to={"/"}>
              <span>Home</span>
            </Link>
            <Link to={"/About"}>
              <span>About Us</span>
            </Link>
            <Link to={"/Movies"}>
              <span>Movies</span>
            </Link>
            <Link to={"/Shows"}>
              <span>Shows</span>
            </Link>
            <Link>
              <span>My WishList</span>
            </Link>
          </div>
        </div>
        <div className="rightNavbar">
          <div className="profile" onClick={toggleDropdown}>
            <div className="p-image">
              <img
                src="images/naren.png"
                alt=""
                style={{ width: "35px", height: "35px", borderRadius: "10px" }}
              />
              <ArrowDropDown className="dropdown" />
            </div>
            <span>kids</span>
            <Notifications />
            {dropdownOpen && (
              <div className="profile-drop">
                <div className="options">
                  <span>Settings</span>
                  <hr />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
