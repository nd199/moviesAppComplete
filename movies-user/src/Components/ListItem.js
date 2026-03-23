import {
  PlayArrow,
  ThumbDownOutlined,
  ThumbUpAltOutlined,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import WatchlistButton from './WatchlistButton';
import './ListItem.css';

const ListItem = ({
  name,
  year,
  rating,
  poster,
  id,
  tmdbId,
  trailer,
  mediaType,
}) => {
  return (
    <div className="li-card-wrapper">
      <div className="li-card">
        <div className="li-card-media">
          <img
            src={
              poster ||
              "https://c4.wallpaperflare.com/wallpaper/123/991/646/avatar-blue-skin-james-cameron-s-movie-avatar-movie-poster-wallpaper-preview.jpg"
            }
            alt={name}
            className="li-card-poster"
          />

          <div className="li-card-overlay" />

          <div className="li-card-content">
            <h4 className="li-card-title">{name}</h4>
            <div className="li-card-meta">
              {year} • {rating} ★
            </div>

            <div className="li-card-actions">
              <Link 
                to={`/video/${name || 'unknown'}`}
                state={{ trailer: trailer }}
                className="li-card-btn"
              >
                <PlayArrow fontSize="small" />
              </Link>
              {tmdbId && mediaType ? (
                <WatchlistButton
                  tmdbId={tmdbId}
                  mediaType={mediaType}
                  title={name}
                  posterPath={poster}
                  size="small"
                  showLabel={false}
                  className="li-card-btn watchlist-btn-card"
                />
              ) : (
                <button className="li-card-btn" disabled>
                  <PlayArrow fontSize="small" />
                </button>
              )}
              <button className="li-card-btn">
                <ThumbUpAltOutlined fontSize="small" />
              </button>
              <button className="li-card-btn">
                <ThumbDownOutlined fontSize="small" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
