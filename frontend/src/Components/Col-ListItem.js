import { PlayArrow, BookmarkAdd } from '@mui/icons-material';
import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import WatchlistButton from './WatchlistButton';

const ColListItem = ({
  name, desc, year, img, ageRating, rating, runtime, genre, trailer,
  tmdbId, mediaType = 'movie',
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const cardRef = useRef(null);

  const displayRating = rating != null ? Number(rating).toFixed(1) : null;

  const formatRuntime = (min) => {
    if (!min) return '';
    const m = parseInt(min);
    const h = Math.floor(m / 60);
    return h ? `${h}h ${m % 60}m` : `${m}m`;
  };

  const genres = genre ? genre.split(',').map(g => g.trim()).slice(0, 3) : [];

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -6;
    const rotateY = (x - 0.5) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  return (
    <div
      ref={cardRef}
      className="cl-root group relative rounded-2xl overflow-hidden gradient-border bg-surface-800"
      style={{ transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >

      {/* Image */}
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        <img
          src={img || 'https://via.placeholder.com/400x600/111827/3b4560?text=No+Image'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />

        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-surface-800 via-surface-700 to-surface-800 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
        )}

        {/* Hover edge glow */}
        <div className="absolute inset-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
          style={{ boxShadow: 'inset 0 0 40px rgba(124,58,237,0.2), inset 0 0 80px rgba(6,182,212,0.06)' }} />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
          {ageRating && (
            <span className="bg-brand-500/90 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2 py-1 rounded-lg backdrop-blur-sm">
              {ageRating}
            </span>
          )}
          {displayRating && (
            <span className="flex items-center gap-1 bg-surface-950/70 backdrop-blur-sm text-white text-[0.7rem] font-semibold px-2 py-1 rounded-lg border border-white/10 ml-auto">
              <span className="text-gold-400">★</span> {displayRating}
            </span>
          )}
        </div>

        {/* Play — always visible on mobile */}
        <Link
          to={`/video/${name || 'unknown'}`}
          state={{ trailer }}
          className="absolute inset-0 flex items-center justify-center bg-surface-950/0 sm:bg-surface-950/0 sm:group-hover:bg-surface-950/50 transition-all duration-400 no-underline z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 scale-100 sm:scale-75 sm:group-hover:scale-100 transition-all duration-400 glow-brand"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <PlayArrow sx={{ fontSize: 24 }} />
          </div>
        </Link>

        {runtime && (
          <span className="absolute bottom-3 right-3 bg-surface-950/70 backdrop-blur-sm text-white text-[0.65rem] font-medium px-2 py-1 rounded-lg border border-white/10 z-10">
            {formatRuntime(runtime)}
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-800 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 -mt-6 relative">
        <h3 className="text-sm font-bold text-white m-0 mb-1 leading-snug line-clamp-1 group-hover:text-brand-300 transition-colors duration-300">
          {name}
        </h3>

        <div className="flex items-center gap-2 text-[0.7rem] text-[#5a6380] mb-2">
          <span>{year}</span>
          <span className="w-1 h-1 rounded-full bg-brand-500/50" />
          <span>{mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
        </div>

        <p className="text-[0.75rem] leading-relaxed text-[#8892b0] m-0 line-clamp-2 mb-3">
          {desc || 'No description available.'}
        </p>

        {genres.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {genres.map((g, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-[0.6rem] font-medium bg-accent-500/10 text-accent-300 border border-accent-500/20">
                {g}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
          <Link
            to={`/video/${name || 'unknown'}`}
            state={{ trailer }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl btn-primary text-[0.7rem] !py-2 !px-4 no-underline"
            onClick={(e) => e.stopPropagation()}
          >
            <PlayArrow sx={{ fontSize: 16 }} /> Watch
          </Link>

          {tmdbId && mediaType ? (
            <WatchlistButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              title={name}
              posterPath={img}
              size="small"
              showLabel={false}
              className="!rounded-xl !bg-white/5 !border-white/10 hover:!bg-brand-500/15 hover:!border-brand-500/30"
            />
          ) : (
            <button className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-[#5a6380] cursor-default">
              <BookmarkAdd sx={{ fontSize: 16 }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColListItem;
