import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Add, BookmarkAdded } from '@mui/icons-material';
import { watchlistAPI } from '../AxiosMethods';

const WatchlistButton = ({ tmdbId, mediaType, title, posterPath, size = 'medium', showLabel = true, className = '', onSuccess, onError }) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useSelector(s => s.user?.authStatus);
  const isAuth = auth === 'authenticated';

  useEffect(() => {
    if (!isAuth || !tmdbId || !mediaType) return;
    watchlistAPI.checkInWatchlist(tmdbId, mediaType)
      .then(r => setInWatchlist(r.data.inWatchlist))
      .catch(() => {});
  }, [tmdbId, mediaType, isAuth]);

  const toggle = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuth) { navigate('/login', { state: { from: window.location.pathname } }); return; }
    setLoading(true);
    try {
      if (inWatchlist) { await watchlistAPI.removeFromWatchlist(tmdbId, mediaType); setInWatchlist(false); onSuccess?.('Removed'); }
      else { await watchlistAPI.addToWatchlist({ tmdbId, title: title || '', posterPath: posterPath || '', mediaType }); setInWatchlist(true); onSuccess?.('Added'); }
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      onError?.(err.message);
    } finally { setLoading(false); }
  };

  const isCompact = className.includes('!w-9') || className.includes('!w-8') || className.includes('col-action') || className.includes('rounded-xl') || className.includes('rounded-lg') || className.includes('rounded');

  if (isCompact) {
    return (
      <button onClick={toggle} disabled={loading} title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        className={`flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-50
          ${inWatchlist
            ? '!bg-brand-500/25 !border-brand-500/50 !text-brand-300 hover:!bg-brand-500/35'
            : 'bg-white/8 border border-white/15 text-[#8892b0] hover:bg-white/15 hover:text-white hover:border-white/25'}
          ${className}`}>
        {loading
          ? <span className="w-3.5 h-3.5 border-2 border-white/25 border-t-brand-400 rounded-full animate-spin" />
          : inWatchlist
            ? <BookmarkAdded sx={{ fontSize: 16 }} />
            : <Add sx={{ fontSize: 16 }} />}
      </button>
    );
  }

  return (
    <button onClick={toggle} disabled={loading}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 border
        ${inWatchlist
          ? 'bg-brand-500/20 border-brand-500/40 text-brand-300 hover:bg-brand-500/30 hover:border-brand-500/50 shadow-[0_0_15px_rgba(124,58,237,0.15)]'
          : 'bg-white/5 border-white/12 text-white hover:bg-white/10 hover:border-white/20 hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)]'}
        ${className}`}>
      {loading
        ? <span className="w-3.5 h-3.5 border-2 border-white/25 border-t-brand-400 rounded-full animate-spin" />
        : inWatchlist
          ? <BookmarkAdded sx={{ fontSize: 18 }} className="text-brand-400" />
          : <Add sx={{ fontSize: 18 }} />}
      {showLabel && <span className="whitespace-nowrap">{loading ? '...' : inWatchlist ? 'In Watchlist' : 'Watchlist'}</span>}
    </button>
  );
};

export default WatchlistButton;
