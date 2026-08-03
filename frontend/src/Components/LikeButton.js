import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { likesAPI } from '../AxiosMethods';

const LikeButton = ({ tmdbId, mediaType, title, size = 'medium', showLabel = true, showCount = false, className = '', onSuccess, onError }) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useSelector(s => s.user?.authStatus);
  const isAuth = auth === 'authenticated';

  useEffect(() => {
    if (!tmdbId || !mediaType) return;
    if (isAuth) {
      likesAPI.checkReaction(tmdbId, mediaType)
        .then(r => setLiked(r.data.liked))
        .catch(() => {});
    }
    if (showCount) {
      likesAPI.getTotalReactions(tmdbId, mediaType)
        .then(r => setCount(r.data.liked))
        .catch(() => {});
    }
  }, [tmdbId, mediaType, isAuth, showCount]);

  const toggle = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuth) { navigate('/login', { state: { from: window.location.pathname } }); return; }
    setLoading(true);
    try {
      if (liked) {
        await likesAPI.clearReaction(tmdbId, mediaType);
        setLiked(false);
        setCount(c => (c === null ? c : Math.max(0, c - 1)));
        onSuccess?.('Removed');
      } else {
        await likesAPI.setReaction({ tmdbId, title: title || '', mediaType, likeStatus: 'LIKE' });
        setLiked(true);
        setCount(c => (c === null ? c : c + 1));
        onSuccess?.('Liked');
      }
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      onError?.(err.message);
    } finally { setLoading(false); }
  };

  const isCompact = className.includes('!w-9') || className.includes('!w-8') || className.includes('col-action') || className.includes('rounded-xl') || className.includes('rounded-lg') || className.includes('rounded');

  const heart = liked
    ? <Favorite sx={{ fontSize: 16 }} className="text-rose-400" />
    : <FavoriteBorder sx={{ fontSize: 16 }} />;

  const heartLarge = liked
    ? <Favorite sx={{ fontSize: 18 }} className="text-rose-400" />
    : <FavoriteBorder sx={{ fontSize: 18 }} />;

  if (isCompact) {
    return (
      <button onClick={toggle} disabled={loading} title={liked ? 'Unlike' : 'Like'}
        className={`flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-50
          ${liked
            ? '!bg-rose-500/25 !border-rose-500/50 !text-rose-300 hover:!bg-rose-500/35'
            : 'bg-white/8 border border-white/15 text-[#8892b0] hover:bg-white/15 hover:text-white hover:border-white/25'}
          ${className}`}>
        {loading
          ? <span className="w-3.5 h-3.5 border-2 border-white/25 border-t-rose-400 rounded-full animate-spin" />
          : heart}
      </button>
    );
  }

  return (
    <button onClick={toggle} disabled={loading} title={liked ? 'Unlike' : 'Like'}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 border
        ${liked
          ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30 hover:border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
          : 'bg-white/5 border-white/12 text-white hover:bg-white/10 hover:border-white/20 hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)]'}
        ${className}`}>
      {loading
        ? <span className="w-3.5 h-3.5 border-2 border-white/25 border-t-rose-400 rounded-full animate-spin" />
        : heartLarge}
      {showLabel && <span className="whitespace-nowrap">{loading ? '...' : liked ? 'Liked' : 'Like'}</span>}
      {showCount && count !== null && <span className="text-xs opacity-70">{count}</span>}
    </button>
  );
};

export default LikeButton;
