import { ArrowDropDown, Menu, Notifications, Person, Bookmark, History, CreditCard, Settings, Help, Search, Close, MovieFilter, Tv } from "@mui/icons-material";
import { Badge } from "@mui/material";
import { useCallback, useEffect, useState, useRef } from "react";
import Lottie from "react-lottie";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api, { publicRequest } from "../AxiosMethods";
import { performLogout } from "../utils/logout";
import popcornAnimation from "../Utils/animations/popcorn.json";

const NavBar = ({ onMenuClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ movies: [], shows: [] });
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const searchInputRef = useRef(null);
  const searchTimerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((s) => s.user?.currentUser);
  const authStatus = useSelector((s) => s.user?.authStatus);
  const hideSignIn = location.pathname === '/login' || location.pathname === '/register';

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
      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(""); setSearchResults({ movies: [], shows: [] }); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Live search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ movies: [], shows: [] });
      setSearching(false);
      return;
    }
    setSearching(true);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const [moviesRes, showsRes] = await Promise.allSettled([
          publicRequest().get(`/tmdb/search/movies?query=${encodeURIComponent(searchQuery.trim())}&page=1`),
          publicRequest().get(`/tmdb/search/shows?query=${encodeURIComponent(searchQuery.trim())}&page=1`),
        ]);
        setSearchResults({
          movies: moviesRes.status === 'fulfilled' ? (moviesRes.value.data?.results || []).slice(0, 5) : [],
          shows: showsRes.status === 'fulfilled' ? (showsRes.value.data?.results || []).slice(0, 5) : [],
        });
      } catch {
        setSearchResults({ movies: [], shows: [] });
      }
      setSearching(false);
    }, 350);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [searchQuery]);

  const lottie = { loop: true, autoplay: true, animationData: popcornAnimation, rendererSettings: { preserveAspectRatio: "xMidYMid slice" } };

  const handleLogout = useCallback(async () => {
    await performLogout();
    navigate("/login");
    setOpen(false);
  }, [navigate]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults({ movies: [], shows: [] });
    }
  }, [searchQuery, navigate]);

  const handleResultClick = useCallback((item, mediaType) => {
    const name = item.title || item.name || 'unknown';
    navigate(`/video/${name}`, { state: { trailer: item.trailer } });
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults({ movies: [], shows: [] });
  }, [navigate]);

  const filteredMovies = activeTab === "shows" ? [] : searchResults.movies;
  const filteredShows = activeTab === "movies" ? [] : searchResults.shows;
  const hasResults = filteredMovies.length > 0 || filteredShows.length > 0;
  const totalResults = searchResults.movies.length + searchResults.shows.length;

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/movies", label: "Movies" },
    { to: "/shows", label: "Shows" },
    ...(user ? [{ to: "/watchlist", label: "Watchlist" }] : []),
  ];

  const getPoster = (item) => {
    const p = item.poster;
    if (!p) return 'https://via.placeholder.com/60x90/111827/3b4560?text=N/A';
    return p.startsWith('http') ? p : `https://image.tmdb.org/t/p/w92${p}`;
  };

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
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[#8892b0] hover:text-white hover:bg-white/10 transition-all cursor-pointer border-none"
              title="Search (Ctrl+K)"
            >
              <Search sx={{ fontSize: 18 }} />
            </button>

            {!hideSignIn && user && authStatus === 'authenticated' ? (
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
              !hideSignIn && authStatus !== 'loading' && (
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

      {/* Search Overlay with Dropdown */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] animate-fade-in" onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults({ movies: [], shows: [] }); }}>
          <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-md" />
          <div className="relative w-full max-w-[560px] mx-4 animate-slide-up" onClick={e => e.stopPropagation()}>
            {/* Search input */}
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
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults({ movies: [], shows: [] }); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#5a6380] hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                <Close sx={{ fontSize: 16 }} />
              </button>
            </form>

            {/* Results dropdown */}
            {searchQuery.trim() && (
              <div className="mt-2 glass-strong rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden max-h-[400px] overflow-y-auto">
                {/* Tabs */}
                {totalResults > 0 && (
                  <div className="flex items-center gap-1 px-4 pt-3 pb-2 border-b border-white/5">
                    {[
                      { key: "all", label: `All (${totalResults})` },
                      { key: "movies", label: `Movies (${searchResults.movies.length})` },
                      { key: "shows", label: `Shows (${searchResults.shows.length})` },
                    ].map(tab => (
                      <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`px-3 py-1.5 rounded-lg text-[0.7rem] font-semibold transition-all border-none cursor-pointer
                          ${activeTab === tab.key ? 'bg-brand-500/20 text-brand-300' : 'bg-transparent text-[#5a6380] hover:text-white hover:bg-white/5'}`}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}

                {searching ? (
                  <div className="flex items-center justify-center py-8 gap-2">
                    <span className="w-4 h-4 border-2 border-brand-500/30 border-t-brand-400 rounded-full animate-spin" />
                    <span className="text-[#5a6380] text-xs">Searching...</span>
                  </div>
                ) : hasResults ? (
                  <>
                    {/* Movies */}
                    {filteredMovies.length > 0 && (
                      <div className="py-2">
                        <div className="px-4 py-1.5">
                          <span className="text-[0.65rem] font-semibold text-[#4a5568] uppercase tracking-wider">Movies</span>
                        </div>
                        {filteredMovies.map((item, i) => (
                          <button key={`m-${i}`} onClick={() => handleResultClick(item, 'movie')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-all cursor-pointer bg-transparent border-none text-left">
                            <img src={getPoster(item)} alt="" className="w-10 h-[60px] rounded-lg object-cover bg-surface-800 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-white text-sm font-medium truncate m-0">{item.title || item.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[0.65rem] text-[#5a6380]">{item.year}</span>
                                {item.rating && <span className="text-[0.65rem] text-gold-400 font-semibold">★ {item.rating}</span>}
                                <span className="text-[0.6rem] text-[#4a5568] bg-white/5 px-1.5 py-0.5 rounded flex items-center gap-0.5"><MovieFilter sx={{ fontSize: 10 }} /> Movie</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Shows */}
                    {filteredShows.length > 0 && (
                      <div className="py-2 border-t border-white/5">
                        <div className="px-4 py-1.5">
                          <span className="text-[0.65rem] font-semibold text-[#4a5568] uppercase tracking-wider">TV Shows</span>
                        </div>
                        {filteredShows.map((item, i) => (
                          <button key={`s-${i}`} onClick={() => handleResultClick(item, 'tv')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-all cursor-pointer bg-transparent border-none text-left">
                            <img src={getPoster(item)} alt="" className="w-10 h-[60px] rounded-lg object-cover bg-surface-800 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-white text-sm font-medium truncate m-0">{item.name || item.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[0.65rem] text-[#5a6380]">{item.year}</span>
                                {item.rating && <span className="text-[0.65rem] text-gold-400 font-semibold">★ {item.rating}</span>}
                                <span className="text-[0.6rem] text-[#4a5568] bg-white/5 px-1.5 py-0.5 rounded flex items-center gap-0.5"><Tv sx={{ fontSize: 10 }} /> Show</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* View all results */}
                    <button onClick={handleSearch}
                      className="w-full py-3 text-center text-brand-300 text-xs font-semibold hover:bg-white/5 transition-all border-t border-white/5 bg-transparent border-x-0 border-b-0 cursor-pointer">
                      View all results for "{searchQuery}"
                    </button>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-[#5a6380] text-sm m-0">No results found</p>
                    <p className="text-[#3b4560] text-xs m-0 mt-1">Try a different search term</p>
                  </div>
                )}
              </div>
            )}

            {/* Keyboard hints */}
            {!searchQuery.trim() && (
              <div className="mt-3 px-2 flex items-center gap-2 text-[0.7rem] text-[#4a5568]">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#5a6380] font-mono">Enter</kbd>
                <span>to search</span>
                <span className="mx-1">·</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#5a6380] font-mono">Esc</kbd>
                <span>to close</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
