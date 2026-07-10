import {
  PlayArrow,
  ThumbDownOutlined,
  ThumbUpAltOutlined,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Col-ListItem.css';
import WatchlistButton from './WatchlistButton';

const ColListItem = ({
  name,
  desc,
  year,
  img,
  ageRating,
  rating,
  runtime,
  genre,
  trailer,
  className = '',
  tmdbId,
  mediaType = 'movie',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  const formatRuntime = minutes => {
    if (!minutes) return '';
    const mins = parseInt(minutes);
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return hours ? `${hours}h ${remMins}m` : `${remMins}m`;
  };

  const genres = genre
    ? genre
        .split(',')
        .map(g => g.trim())
        .slice(0, 2)
    : [];

  const showActions = isHovered || isTouchDevice;

  return (
    <Link
      to="/play"
      className={`col-card ${className} ${isHovered ? 'col-card-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        // Prevent navigation if clicking on action buttons
        if (e.target.closest('.col-card-action')) {
          e.preventDefault();
        }
      }}>
      <div className="col-card-media">
        <img
          src={
            img ||
            'https://via.placeholder.com/320x180/1a1a1a/9ca3af?text=No+Image'
          }
          alt={name}
          className="col-card-poster"
          loading="lazy"
        />
        <span className="col-card-badge">{ageRating}</span>
        <span className="col-card-audio-toggle" aria-label="Toggle audio">
          🔊
        </span>
      </div>

      <div className="col-card-body">
        <div className="col-card-title-row">
          <h3 className="col-card-title">{name}</h3>
        </div>

        <div className="col-card-meta-row">
          <span className="col-card-meta-text">{year}</span>
          {runtime && (
            <>
              <span className="col-card-meta-text">•</span>
              <span className="col-card-meta-text">{formatRuntime(runtime)}</span>
            </>
          )}
          <span className="col-card-meta-text">•</span>
          <span className="col-card-meta-text">
            <span className="col-card-star">★</span> {rating}
          </span>
        </div>

        <div className="col-card-overview">{desc?.substring(0, 80)}...</div>

        <div className="col-card-genres">
          {genres.map((g, i) => (
            <span key={i} className="col-card-genre-chip">
              {g}
            </span>
          ))}
        </div>

        {showActions && (
          <div className="col-card-actions">
            <Link 
              to={`/video/${name || 'unknown'}`}
              state={{ trailer: trailer }}
              className="col-card-action"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <PlayArrow />
            </Link>
            <WatchlistButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              title={name}
              posterPath={img}
              size="small"
              showLabel={false}
              className="col-card-action"
            />
            <div className="col-card-action" onClick={(e) => e.stopPropagation()}>
              <ThumbUpAltOutlined />
            </div>
            <div className="col-card-action" onClick={(e) => e.stopPropagation()}>
              <ThumbDownOutlined />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ColListItem;
