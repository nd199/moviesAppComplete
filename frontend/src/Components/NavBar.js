import { ArrowDropDown, Menu, Notifications, Person, Bookmark, History, CreditCard, Settings, Help, Search, Close } from "@mui/icons-material";
import { Badge } from "@mui/material";
import { useCallback, useEffect, useState, useRef } from "react";
import Lottie from "react-lottie";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/userSlice";
import api from "../AxiosMethods";
import { clearAuth, getRefreshToken } from "../authStore";
import popcornAnimation from "../Utils/animations/popcorn.json";

const NavBar = ({ onMenuClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user?.currentUser);
  const hideSignIn = location.pathname === '/login';

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const lottie = { loop: true, autoplay: true, animationData: popcornAnimation, rendererSettings: { preserveAspectRatio: "xMidYMid slice" } };

  const handleLogout = useCallback(async () => {
    try { await api.post('/auth/logout', { refreshToken: getRefreshToken() }); } catch {}
    clearAuth(); dispatch(logout()); navigate("/login"); setOpen(false);
  }, [dispatch, navigate]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }, [searchQuery, navigate]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/movies", label: "Movies" },
    { to: "/shows", label: "Shows" },
    ...(user ? [{ to: "/watchlist", label: "Watchlist" }] : []),
  ];

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'glass-strong h-14' : 'bg-gradient-to-b from-surface-950/90 to-transparent h-16'}`}>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
        <nav className="max-w-[1400px] h-full mx-auto px-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0">
            <Lottie options={lottie} height={scrolled ? 30 : 38} width={scrolled ? 30 : 38} />
            <span className="text-xl font-extrabold tracking-tight text-gradient">CN.io</span>
          </Link>

          <ul className="hidden lg:flex items-center gap-1 list-none m-0 p-0">
            {links.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={`relative px-4 py-2 text-[0.82rem] font-medium no-underline rounded-xl transition-all duration-300
                  ${location.pathname === to
                    ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                    : 'text-[#8892b0] hover:text-white hover:bg-white/5'}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[#8892b0] hover:text-white hover:bg-white/10 transition-all cursor-pointer border-none"
              title="Search (Ctrl+K)"
            >
              <Search sx={{ fontSize: 18 }} />
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setOpen(!open)} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl glass hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <img src={user.imageUrl || "/images/defaultAvatar.png"} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/40" onError={e => { e.target.src = "/images/default-avatar.png"; }} />
                  <span className="hidden sm:block text-white text-sm font-medium max-w-[80px] truncate">{user.name || 'User'}</span>
                  <ArrowDropDown className={`text-[#8892b0] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute top-[calc(100%+8px)] right-0 w-[260px] max-w-[calc(100vw-2.5rem)] glass-strong rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-50 overflow-hidden animate-fade-in">
                      <div className="flex flex-col items-center gap-2 p-5 border-b border-white/5">
                        <img src={user.imageUrl || "/images/defaultAvatar.png"} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/50" onError={e => { e.target.src = "/images/default-avatar.png"; }} />
                        <div className="text-center">
                          <div className="text-white font-semibold text-sm">{user.name || 'User'}</div>
                          <div className="text-[#5a6380] text-xs truncate max-w-[180px]">{user.email}</div>
                        </div>
                      </div>
                      <div className="py-1.5">
                        {[
                          { icon: Person, label: "Profile", action: () => { navigate("/profile"); setOpen(false); } },
                          { icon: Bookmark, label: "My List", action: () => { navigate("/watchlist"); setOpen(false); } },
                          { icon: History, label: "History", action: () => setOpen(false) },
                        ].map(({ icon: Icon, label, action }) => (
                          <button key={label} onClick={action} className="w-full flex items-center gap-3 px-5 py-2.5 text-[#8892b0] hover:text-white hover:bg-white/5 transition-all text-sm cursor-pointer bg-transparent border-none">
                            <Icon sx={{ fontSize: 18 }} /> {label}
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-white/5 py-1.5">
                        {[
                          { icon: CreditCard, label: "Subscription" },
                          { icon: Settings, label: "Settings" },
                          { icon: Help, label: "Help" },
                        ].map(({ icon: Icon, label }) => (
                          <button key={label} onClick={() => setOpen(false)} className="w-full flex items-center gap-3 px-5 py-2.5 text-[#8892b0] hover:text-white hover:bg-white/5 transition-all text-sm cursor-pointer bg-transparent border-none">
                            <Icon sx={{ fontSize: 18 }} /> {label}
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-white/5">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold cursor-pointer bg-transparent border-none">
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              !hideSignIn && (
                <Link to="/login" className="px-5 py-2 rounded-xl btn-primary text-sm no-underline !py-2 !px-5">
                  Sign In
                </Link>
              )
            )}

            <Badge badgeContent={3} color="secondary" className="!cursor-pointer">
              <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[#8892b0] hover:text-white hover:bg-white/10 transition-all cursor-pointer border-none">
                <Notifications sx={{ fontSize: 18 }} />
              </button>
            </Badge>

            <button onClick={onMenuClick} aria-label="Menu" className="lg:hidden w-9 h-9 rounded-xl glass flex items-center justify-center text-[#8892b0] hover:text-white hover:bg-white/10 transition-all cursor-pointer border-none">
              <Menu sx={{ fontSize: 18 }} />
            </button>
          </div>
        </nav>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] animate-fade-in" onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-md" />
          <div
            className="relative w-full max-w-[560px] mx-4 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" sx={{ fontSize: 22 }} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search movies, shows..."
                className="w-full glass-strong rounded-2xl pl-12 pr-12 py-4 text-white text-base placeholder:text-[#5a6380] focus:outline-none focus:border-brand-500/40 transition-all border border-white/10"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#5a6380] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <Close sx={{ fontSize: 16 }} />
              </button>
            </form>
            <div className="mt-3 px-2 flex items-center gap-2 text-[0.7rem] text-[#4a5568]">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#5a6380] font-mono">Enter</kbd>
              <span>to search</span>
              <span className="mx-1">·</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#5a6380] font-mono">Esc</kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
