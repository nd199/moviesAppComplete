import { Facebook, Instagram, MailOutlined, PlaceOutlined, Twitter, WhatsApp, Send } from '@mui/icons-material';
import { useState } from 'react';
import { HiOutlinePhone } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../Utils/useScrollReveal';

const socials = [
  { icon: Facebook, label: "Facebook", url: "#", color: "hover:bg-[#1877f2]/20 hover:text-[#1877f2] hover:border-[#1877f2]/30" },
  { icon: Twitter, label: "Twitter", url: "#", color: "hover:bg-[#1da1f2]/20 hover:text-[#1da1f2] hover:border-[#1da1f2]/30" },
  { icon: Instagram, label: "Instagram", url: "#", color: "hover:bg-[#e4405f]/20 hover:text-[#e4405f] hover:border-[#e4405f]/30" },
  { icon: WhatsApp, label: "WhatsApp", url: "#", color: "hover:bg-[#25d366]/20 hover:text-[#25d366] hover:border-[#25d366]/30" },
];

const links = [
  { to: "/", label: "Home" },
  { to: "/movies", label: "Movies" },
  { to: "/shows", label: "Shows" },
  { to: "/about", label: "About" },
];

const contacts = [
  { icon: <PlaceOutlined sx={{ fontSize: 18 }} />, text: "Chennai, Tamil Nadu" },
  { icon: <HiOutlinePhone size={18} />, text: "+91 8072205480" },
  { icon: <MailOutlined sx={{ fontSize: 18 }} />, text: "#" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const footerRef = useScrollReveal({ threshold: 0.1 });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer ref={footerRef} className="reveal relative bg-surface-900 text-white pt-16 pb-8 px-6 max-md:px-4 max-md:pt-10 max-md:pb-6">
      <div className="section-divider absolute top-0 inset-x-0" />

      {/* Newsletter section */}
      <div className="max-w-[1200px] mx-auto mb-12">
        <div className="relative rounded-2xl overflow-hidden p-8 sm:p-10 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(6,182,212,0.06) 100%)', border: '1px solid rgba(124,58,237,0.12)' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-brand-500/8 blur-[80px] pointer-events-none" />
          <h3 className="text-xl font-bold text-white m-0 mb-2 relative z-10">Stay in the Loop</h3>
          <p className="text-[#5a6380] text-sm mb-5 m-0 relative z-10">Get notified about new releases and exclusive content.</p>
          <form onSubmit={handleSubscribe} className="relative z-10 flex items-center gap-2 max-w-[420px] mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 glass rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:border-brand-500/40 transition-all"
              required
            />
            <button type="submit" className="btn-primary !px-5 !py-2.5 !rounded-xl flex items-center gap-2 text-sm shrink-0">
              <Send sx={{ fontSize: 16 }} />
              <span className="hidden sm:inline">Subscribe</span>
            </button>
          </form>
          {subscribed && (
            <p className="text-accent-400 text-xs mt-3 m-0 relative z-10 animate-fade-in">Thanks for subscribing!</p>
          )}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-12 max-lg:grid-cols-2 max-lg:gap-8 max-md:grid-cols-1 max-md:text-center">
          <div className="flex flex-col gap-5 max-md:items-center">
            <span className="text-2xl font-extrabold text-gradient">CN.io</span>
            <p className="text-[#5a6380] text-sm leading-relaxed max-w-[360px] m-0">Your ultimate destination for movies and TV shows. 4K streaming, offline downloads, and personalized recommendations.</p>
            <div className="flex gap-2 max-md:justify-center">
              {socials.map(({ icon: Icon, label, url, color }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-[#5a6380] flex items-center justify-center transition-all duration-300 no-underline ${color}`}>
                  <Icon sx={{ fontSize: 18 }} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 max-md:items-center">
            <h3 className="text-sm font-semibold text-[#8892b0] uppercase tracking-wider m-0">Quick Links</h3>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              {links.map(({ to, label }) => (
                <li key={label}><Link to={to} className="text-[#5a6380] no-underline text-sm hover:text-brand-300 transition-colors">{label}</Link></li>
              ))}
              <li className="text-[#5a6380] text-sm">Privacy Policy</li>
              <li className="text-[#5a6380] text-sm">Terms of Service</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 max-md:items-center">
            <h3 className="text-sm font-semibold text-[#8892b0] uppercase tracking-wider m-0">Contact</h3>
            {contacts.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-[#5a6380] text-sm max-md:justify-center">
                <span className="text-accent-400">{icon}</span> {text}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex justify-between items-center flex-wrap gap-4 max-md:justify-center max-md:text-center">
          <span className="text-[#3b4560] text-xs">© 2025 CN.io. All rights reserved.</span>
          <span className="text-[#3b4560] text-xs">Made in Chennai</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
