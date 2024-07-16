import React from "react";
import "./Footer.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import {HandshakeOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer__container">
                <div className="footer__container__left">
                    <div className="footer__container__left__logo">
                        <h1>CN.io</h1>
                    </div>
                    <div className="footer__container__left__desc">
                        Welcome to CN.io, your ultimate destination for movies, TV shows,
                        and exclusive content. Dive into a vast library of diverse genres
                        and enjoy StreamHub Originals available only on our platform.
                        Experience seamless, high-definition streaming on all your devices
                        with personalized recommendations to discover new favorites. Enjoy
                        ad-free viewing, offline downloads, and affordable plans that fit
                        your budget. Keep your family safe with customizable parental
                        controls. Join StreamHub today and unlock a world of entertainment!
                    </div>
                    <div className="social-container">
                        <div className="s-icon">
                            <FacebookIcon
                                style={{background: "#385999"}}
                                className="wIcon"
                            />
                        </div>
                        <div className="s-icon">
                            <TwitterIcon
                                style={{background: "#55ACEE"}}
                                className="wIcon"
                            />
                        </div>
                        <div className="s-icon">
                            <InstagramIcon
                                style={{background: "#E4405F"}}
                                className="wIcon"
                            />
                        </div>
                        <div className="s-icon">
                            <WhatsAppIcon style={{background: "green"}} className="wIcon"/>
                        </div>
                    </div>
                </div>
                <div className="footer__container__center">
                    <div className="footer__container__center__title">Quick Links</div>
                    <div className="footer__container__center__links">
                        <div className="footer__container__center__links__link">
                            <Link to={"/"}>
                                <span>Home</span>
                            </Link>
                        </div>
                        <div className="footer__container__center__links__link">
                            <Link to={"/About"}>
                                <span>About Us</span>
                            </Link>
                        </div>
                        <div className="footer__container__center__links__link">
                            <Link to={"/Movies"}>
                                <span>Movies</span>
                            </Link>
                        </div>
                        <div className="footer__container__center__links__link">
                            <Link to={"/Shows"}>
                                <span>Shows</span>
                            </Link>
                        </div>
                        <div className="footer__container__center__links__link">
                            <Link to={"/"}>
                                <span>My WishList</span>
                            </Link>
                        </div>
                        <div className="footer__container__center__links__link">
                            Privacy Policy
                        </div>
                        <div className="footer__container__center__links__link">
                            Pricing Plans
                        </div>
                        <div className="footer__container__center__links__link">
                            My Account
                        </div>
                        <div className="footer__container__center__links__link">
                            My WishList
                        </div>
                        <div className="footer__container__center__links__link">
                            Latest Releases
                        </div>
                        <div className="footer__container__center__links__link">
                            Terms & Conditions
                        </div>
                        <div className="footer__container__center__links__link">
                            Help & Support
                        </div>
                        <div className="footer__container__center__links__link">FAQ</div>
                    </div>
                </div>
                <div className="footer__container__right">
                    <div className="footer__container__right__title">Contact Us</div>
                    <div className="r-info">
                        <div className="r-address">
                            <h3>
                                <PlaceOutlinedIcon style={{marginRight: "10px"}}/>
                                Address
                            </h3>
                            <p>Chennai, India</p>
                        </div>
                        <div className="phone">
                            <h3>
                                <CallOutlinedIcon style={{marginRight: "10px"}}/>
                                Phone
                            </h3>
                            <p>+91 8072205480</p>
                        </div>
                        <div className="mail">
                            <h3>
                                <MailOutlineOutlinedIcon style={{marginRight: "10px"}}/>
                                Email
                            </h3>
                            <p>naren06251999@gmail.com</p>
                        </div>
                        <div className="partners">
                            <h3>
                                <HandshakeOutlined style={{marginRight: "10px"}}/>
                                Partners
                            </h3>
                            <img
                                src="https://i.ibb.co/Qfvn4z6/payment.png"
                                alt=""
                                className="payment"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
