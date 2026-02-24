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
import './ListItem.css';

const ListItem = ({ name, desc, year, ageRating, rating, runtime, genre, poster, id, trailer }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Debug: Log trailer data
  console.log('ListItem - Trailer data:', { name, trailer: trailer ? 'TRAILER_FOUND' : 'NO_TRAILER' });

  const toggleAudio = e => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  const formatRuntime = minutes => {
    if (!minutes) return '';
    const min = parseInt(minutes.toString().slice(0, 3), 10);
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (!h) return `${m}m`;
    return `${h}h ${m}m`;
  };

  const genres = genre
    ?.split(',')
    .map(g => g.trim())
    .filter(Boolean);

  return (
    <article
      className={`card ${isHovered ? 'card-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="card-media">
        {isHovered ? (
          <div className="card-video-wrapper">
            {trailer ? (
              <>
                {trailer.includes('youtube.com') ? (
                  <iframe
                    className="card-video"
                    src={trailer.replace('watch?v=', 'embed/').replace('https://www.youtube.com/', 'https://www.youtube.com/embed/') + '?autoplay=1&mute=1&loop=1&playlist=' + trailer.split('v=')[1]}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Trailer"
                  />
                ) : (
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
                )}
              </>
            ) : (
              <img
                src={poster || "https://c4.wallpaperflare.com/wallpaper/123/991/646/avatar-blue-skin-james-cameron-s-movie-avatar-movie-poster-wallpaper-preview.jpg"}
                alt={name}
                className="card-poster"
              />
            )}
            <span className="card-badge">TRAILER</span>

            <button className="card-audio-toggle" onClick={toggleAudio}>
              {isMuted ? (
                <VolumeOff fontSize="small" />
              ) : (
                <VolumeUp fontSize="small" />
              )}
            </button>
          </div>
        ) : (
          <img
            src={poster || "https://c4.wallpaperflare.com/wallpaper/123/991/646/avatar-blue-skin-james-cameron-s-movie-avatar-movie-poster-wallpaper-preview.jpg"}
            alt={name}
            className="card-poster"
          />
        )}
      </div>

      <div className="card-body">
        {isHovered ? (
          <>
            <div className="card-header">
              <h3 className="card-title">{name}</h3>
            </div>

            <div className="card-meta-row">
              <span className="card-chip card-chip-age">{ageRating}</span>
              <span className="card-meta-text">{year}</span>
              {runtime && (
                <span className="card-meta-text">{formatRuntime(runtime)}</span>
              )}
              {rating && (
                <span className="card-meta-text">
                  IMDB {rating}
                  <span className="card-star">★</span>/10
                </span>
              )}
            </div>

            <p className="card-overview" title={desc}>
              {desc}
            </p>
          </>
        ) : (
          <>
            <div className="card-title-row">
              <h3 className="card-title">{name}</h3>
              <span className="card-chip card-chip-age">{ageRating}</span>
            </div>

            <div className="card-meta-row">
              <span className="card-meta-text">{year}</span>
              {runtime && (
                <span className="card-meta-text">{formatRuntime(runtime)}</span>
              )}
              {rating && (
                <span className="card-meta-text">
                  {rating}
                  <span className="card-star">★</span>
                </span>
              )}
            </div>

            <p className="card-overview" title={desc}>
              {desc}
            </p>

            {genres?.length > 0 && (
              <div className="card-genres">
                {genres.map((g, i) => (
                  <span key={i} className="card-genre-chip">
                    {g}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Actions always rendered, visibility controlled by CSS */}
        <div className="card-actions">
          <Link to={`/video/${id}`} className="card-action">
            <PlayArrow fontSize="small" />
          </Link>
          <button className="card-action">
            <Add fontSize="small" />
          </button>
          <button className="card-action">
            <ThumbUpAltOutlined fontSize="small" />
          </button>
          <button className="card-action">
            <ThumbDownOutlined fontSize="small" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ListItem;
