import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ThumbDown, ThumbDownOffAlt } from '@mui/icons-material';
import { likesAPI } from '../AxiosMethods';

const DislikeButton = ({ tmdbId, mediaType, title, size = 'medium', showLabel = true, showCount = false, className = '', onSuccess, onError }) => {
  const [disliked, setDisliked] = useState(false);
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useSelector(s => s.user?.authStatus);
  const isAuth = auth === 'authenticated';

  useEffect(() => {
    if (!tmdbId || !mediaType) return;
    if (isAuth) {
      likesAPI.checkReaction(tmdbId, mediaType)
        .then(r => setDisliked(r.data.disliked))
        .catch(() => {});
    }
    if (showCount) {
      likesAPI.getTotalReactions(tmdbId, mediaType)
        .then(r => setCount(r.data.disliked))
        .catch(() => {});
    }
  }, [tmdbId, mediaType, isAuth, showCount]);

  const toggle = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuth) { navigate('/login', { state: { from: window.location.pathname } }); return; }
    setLoading(true);
    try {
      if (disliked) {
        await likesAPI.clearReaction(tmdbId, mediaType);
        setDisliked(false);
        setCount(c => (c === null ? c : Math.max(0, c - 1)));
        onSuccess?.('Removed');
      } else {
        await likesAPI.setReaction({ tmdbId, title: title || '', mediaType, likeStatus: 'DISLIKE' });
        setDisliked(true);
        setCount(c => (c === null ? c : c + 1));
        onSuccess?.('Disliked');
      }
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      onError?.(err.message);
    } finally { setLoading(false); }
  };

  const isCompact = className.includes('!w-9') || className.includes('!w-8') || className.includes('col-action') || className.includes('rounded-xl') || className.includes('rounded-lg') || className.includes('rounded');

  const thumb = disliked
    ? <ThumbDown sx={{ fontSize: 16 }} className="text-sky-400" />
    : <ThumbDownOffAlt sx={{ fontSize: 16 }} />;

  const thumbLarge = disliked
    ? <ThumbDown sx={{ fontSize: 18 }} className="text-sky-400" />
    : <ThumbDownOffAlt sx={{ fontSize: 18 }} />;

  if (isCompact) {
    return (
      <button onClick={toggle} disabled={loading} title={disliked ? 'Remove dislike' : 'Dislike'}
        className={`flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-50
          ${disliked
            ? '!bg-sky-500/25 !border-sky-500/50 !text-sky-300 hover:!bg-sky-500/35'
            : 'bg-white/8 border border-white/15 text-[#8892b0] hover:bg-white/15 hover:text-white hover:border-white/25'}
          ${className}`}>
        {loading
          ? <span className="w-3.5 h-3.5 border-2 border-white/25 border-t-sky-400 rounded-full animate-spin" />
          : thumb}
      </button>
    );
  }

  return (
    <button onClick={toggle} disabled={loading}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 border
        ${disliked
          ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 hover:bg-sky-500/30 hover:border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
          : 'bg-white/5 border-white/12 text-white hover:bg-white/10 hover:border-white/20 hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)]'}
        ${className}`}>
      {loading
        ? <span className="w-3.5 h-3.5 border-2 border-white/25 border-t-sky-400 rounded-full animate-spin" />
        : thumbLarge}
      {showLabel && <span className="whitespace-nowrap">{loading ? '...' : disliked ? 'Disliked' : 'Dislike'}</span>}
      {showCount && count !== null && <span className="text-xs opacity-70">{count}</span>}
    </button>
  );
};

export default DislikeButton;
