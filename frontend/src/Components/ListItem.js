import { PlayArrow, InfoOutlined } from '@mui/icons-material';
import { useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import WatchlistButton from './WatchlistButton';

const ListItem = ({ name, year, rating, poster, tmdbId, trailer, mediaType }) => {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -8;
    const rotateY = (x - 0.5) * 8;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  return (
    <div
      ref={cardRef}
      className="li-root group relative rounded-2xl overflow-hidden cursor-pointer snap-start shrink-0 w-[210px] max-lg:w-[180px] max-sm:w-[150px]"
      style={{ transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl">
        <img
          src={poster || "https://via.placeholder.com/300x450/111827/3b4560?text=No+Image"}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/30 to-transparent" />

        {/* Hover shine sweep */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Edge glow on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 30px rgba(124,58,237,0.2), inset 0 0 60px rgba(6,182,212,0.08)' }} />

        {/* Rating — always visible */}
        {rating && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-surface-950/70 backdrop-blur-sm rounded-lg px-2 py-0.5 border border-white/10 z-10">
            <span className="text-gold-400 text-[0.65rem]">★</span>
            <span className="text-white text-[0.7rem] font-bold">{rating}</span>
          </div>
        )}

        {/* Play button — always visible on mobile, hover on desktop */}
        <Link
          to={`/video/${name || 'unknown'}`}
          state={{ trailer }}
          className="absolute inset-0 flex items-center justify-center no-underline z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 scale-100 sm:scale-75 sm:group-hover:scale-100 transition-all duration-400"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 35px rgba(124,58,237,0.5)' }}>
            <PlayArrow sx={{ fontSize: 24 }} />
          </div>
        </Link>

        {/* Watchlist — always visible on mobile, hover on desktop */}
        {tmdbId && mediaType && (
          <div className="absolute bottom-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 z-10">
            <WatchlistButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              title={name}
              posterPath={poster}
              size="small"
              showLabel={false}
              className="!w-7 !h-7 !min-w-[28px] !p-0 !rounded-lg !bg-surface-950/70 backdrop-blur-sm !border-white/15 hover:!bg-brand-500 hover:!border-brand-500"
            />
          </div>
        )}

        {/* Info — desktop only */}
        <div className="absolute bottom-2 left-2 hidden sm:block opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
          <div className="w-7 h-7 rounded-lg bg-surface-950/70 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/60">
            <InfoOutlined sx={{ fontSize: 14 }} />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="px-1 pt-2 pb-1">
        <h4 className="text-white text-[0.8rem] font-semibold m-0 leading-tight line-clamp-1 group-hover:text-brand-300 transition-colors duration-300">{name}</h4>
        <p className="text-[#4a5568] text-[0.65rem] m-0 mt-0.5">{year}</p>
      </div>
    </div>
  );
};

export default ListItem;
