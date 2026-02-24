import {
  Add,
  PlayArrow,
  ThumbDownOutlined,
  ThumbUpAltOutlined,
  VolumeOff,
  VolumeUp,
} from '@mui/icons-material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Col-ListItem.css';

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
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const toggleAudio = e => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

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
      className={`card ${className} ${isHovered ? 'card-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="card-media">
        {isHovered ? (
          <div className="card-video-wrapper">
            {trailer ? (
              <video
                className="card-video"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="metadata">
                <source
                  src={trailer}
                  type="video/mp4"
                />
              </video>
            ) : (
              <img
                src={img || 'https://via.placeholder.com/320x180/1a1a1a/9ca3af?text=No+Trailer'}
                alt={name}
                className="card-poster"
                loading="lazy"
              />
            )}
            <div className="card-badge">TRAILER</div>
            <button className="card-audio-toggle" onClick={toggleAudio}>
              {isMuted ? <VolumeOff /> : <VolumeUp />}
            </button>
          </div>
        ) : (
          <img
            src={
              img ||
              'https://via.placeholder.com/320x180/1a1a1a/9ca3af?text=No+Image'
            }
            alt={name}
            className="card-poster"
            loading="lazy"
          />
        )}
      </div>

      <div className="card-body">
        <div className="card-title-row">
          <h3 className="card-title">{name}</h3>
          <span className="card-chip card-chip-age">{ageRating}</span>
        </div>

        <div className="card-meta-row">
          <span className="card-meta-text">{year}</span>
          <span className="card-meta-text">{formatRuntime(runtime)}</span>
          <span className="card-meta-text">
            <span className="card-star">★</span> {rating}
          </span>
        </div>

        <div className="card-overview">{desc?.substring(0, 100)}...</div>

        <div className="card-genres">
          {genres.map((g, i) => (
            <span key={i} className="card-genre-chip">
              {g}
            </span>
          ))}
        </div>

        {isHovered && (
          <div className="card-actions">
            <div className="card-action">
              <PlayArrow />
            </div>
            <div className="card-action">
              <Add />
            </div>
            <div className="card-action">
              <ThumbUpAltOutlined />
            </div>
            <div className="card-action">
              <ThumbDownOutlined />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ColListItem;
