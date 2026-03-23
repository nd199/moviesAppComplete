import {
  PlayArrow,
  ThumbDownOutlined,
  ThumbUpAltOutlined,
} from '@mui/icons-material';
import { useState } from 'react';
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

  return (
    <Link
      to="/play"
      className={`col-card ${className} ${isHovered ? 'col-card-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
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
      </div>

      <div className="col-card-body">
        <div className="col-card-title-row">
          <h3 className="col-card-title">{name}</h3>
          <span className="col-card-chip col-card-chip-age">{ageRating}</span>
        </div>

        <div className="col-card-meta-row">
          <span className="col-card-meta-text">{year}</span>
          <span className="col-card-meta-text">{formatRuntime(runtime)}</span>
          <span className="col-card-meta-text">
            <span className="col-card-star">★</span> {rating}
          </span>
        </div>

        <div className="col-card-overview">{desc?.substring(0, 100)}...</div>

        <div className="col-card-genres">
          {genres.map((g, i) => (
            <span key={i} className="col-card-genre-chip">
              {g}
            </span>
          ))}
        </div>

        {isHovered && (
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
            <div className="col-card-action">
              <ThumbUpAltOutlined />
            </div>
            <div className="col-card-action">
              <ThumbDownOutlined />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ColListItem;
