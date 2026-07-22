import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, Movie, Tv, Bookmark, Close, Settings, CreditCard, History, Help, Logout } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { performLogout } from '../Utils/logout';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const user = useSelector((s) => s.user?.currentUser);
  const auth = useSelector((s) => s.user?.authStatus);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLogout = async () => {
    await performLogout();
    onClose();
  };

  const nav = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Info },
    { path: '/movies', label: 'Movies', icon: Movie },
    { path: '/shows', label: 'TV Shows', icon: Tv },
    { path: '/watchlist', label: 'Watchlist', icon: Bookmark },
  ];

  return (
    <div className={`fixed inset-0 z-[10000] transition-all duration-400 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`} onClick={onClose}>
      <div className={`absolute inset-0 bg-surface-950/80 backdrop-blur-sm transition-opacity duration-400 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
      <div
        onClick={e => e.stopPropagation()}
        className={`absolute top-0 left-0 bottom-0 w-[280px] max-w-[85vw] glass-strong flex flex-col z-10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-brand-500/8 blur-[80px] pointer-events-none" />

        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5">
          <Link to="/" onClick={onClose} className="text-lg font-bold text-gradient no-underline">CN.io</Link>
          <button onClick={onClose} className="w-8 h-8 rounded-xl glass flex items-center justify-center text-[#8892b0] hover:text-white transition-all border-none cursor-pointer">
            <Close sx={{ fontSize: 16 }} />
          </button>
        </div>

        <nav className="flex-1 py-3 px-3">
          {nav.map(({ path, label, icon: Icon }, i) => (
            <Link key={path} to={path} onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium no-underline transition-all duration-300 mb-0.5
                ${location.pathname === path ? 'bg-brand-500/15 text-brand-300 glow-brand' : 'text-[#5a6380] hover:text-white hover:bg-white/5'}`}
              style={{ transitionDelay: isOpen ? `${i * 50}ms` : '0ms' }}>
              <Icon sx={{ fontSize: 20 }} /> {label}
            </Link>
          ))}
        </nav>

        {auth === 'authenticated' && user && (
          <div className="border-t border-white/5 p-3">
            <div className="flex items-center gap-3 p-3 rounded-xl glass mb-2">
              <img src={user.imageUrl || "/images/defaultAvatar.png"} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/30" />
              <div className="flex flex-col min-w-0">
                <span className="text-white text-sm font-medium truncate">{user.name}</span>
                <span className="text-[#4a5568] text-xs truncate">{user.email}</span>
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              {[
                { to: '/profile', icon: Settings, label: 'Settings' },
                { to: '/subscription', icon: CreditCard, label: 'Subscription' },
                { to: '/history', icon: History, label: 'History' },
                { to: '/help', icon: Help, label: 'Help' },
              ].map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 text-[#5a6380] no-underline text-sm rounded-xl hover:text-white hover:bg-white/5 transition-all">
                  <Icon sx={{ fontSize: 18 }} /> {label}
                </Link>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 text-sm rounded-xl bg-transparent border-none cursor-pointer transition-all">
                <Logout sx={{ fontSize: 18 }} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
