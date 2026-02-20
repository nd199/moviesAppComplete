import {
  Facebook,
  HandshakeOutlined,
  Instagram,
  MailOutline,
  PlaceOutlined,
  Twitter,
  WhatsApp,
} from '@mui/icons-material';
import { HiOutlinePhone } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo & Description */}
        <div className="footer-brand">
          <div className="logo">
            <div className="logo-icon">🎬</div>
            <h2>CN.io</h2>
          </div>
          <p>
            Your ultimate destination for movies and TV shows. Enjoy 4K
            streaming, offline downloads, and personalized recommendations.
          </p>
          <div className="social-links">
            <button className="social-link facebook" aria-label="Facebook">
              <Facebook />
            </button>
            <button className="social-link twitter" aria-label="Twitter">
              <Twitter />
            </button>
            <button className="social-link instagram" aria-label="Instagram">
              <Instagram />
            </button>
            <button className="social-link whatsapp" aria-label="WhatsApp">
              <WhatsApp />
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Movies">Movies</Link>
            </li>
            <li>
              <Link to="/Shows">Shows</Link>
            </li>
            <li>
              <Link to="/About">About</Link>
            </li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h3>Contact Info</h3>
          <div className="contact-item">
            <PlaceOutlined className="contact-icon" />
            <span>Chennai, Tamil Nadu</span>
          </div>
          <div className="contact-item">
            <HiOutlinePhone className="contact-icon" />
            <span>+91 8072205480</span>
          </div>
          <div className="contact-item">
            <MailOutline className="contact-icon" />
            <span>naren06251999@gmail.com</span>
          </div>
        </div>

        {/* Payment & Legal */}
        <div className="footer-bottom">
          <div className="payment-methods">
            <HandshakeOutlined />
            <span>Secure Payments</span>
          </div>
          <div className="copyright">
            © 2025 CN.io. All rights reserved. Made in Chennai 🇮🇳
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
