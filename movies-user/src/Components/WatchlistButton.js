import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Add, BookmarkAdded } from '@mui/icons-material';
import { watchlistAPI } from '../AxiosMethods';
import './WatchlistButton.css';

const WatchlistButton = ({
  tmdbId,
  mediaType,
  title,
  posterPath,
  size = 'medium',
  showLabel = true,
  className = '',
  onSuccess,
  onError,
}) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const authStatus = useSelector(state => state.user?.authStatus);
  const isAuthenticated = authStatus === 'authenticated';

  // Check if item is already in watchlist on mount
  useEffect(() => {
    const checkWatchlist = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await watchlistAPI.checkInWatchlist(tmdbId, mediaType);
        setInWatchlist(response.data.inWatchlist);
      } catch (err) {
        console.log('Watchlist check failed:', err.message);
      }
    };

    if (tmdbId && mediaType && isAuthenticated) {
      checkWatchlist();
    }
  }, [tmdbId, mediaType, isAuthenticated]);

  const handleToggleWatchlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      if (inWatchlist) {
        await watchlistAPI.removeFromWatchlist(tmdbId, mediaType);
        setInWatchlist(false);
        if (onSuccess) onSuccess('Removed from watchlist');
      } else {
        const watchlistData = {
          tmdbId,
          title: title || '',
          posterPath: posterPath || '',
          mediaType,
        };
        await watchlistAPI.addToWatchlist(watchlistData);
        setInWatchlist(true);
        if (onSuccess) onSuccess('Added to watchlist');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update watchlist';
      setError(errorMessage);
      
      // Handle 401 - redirect to login
      if (err.response?.status === 401) {
        navigate('/login', { state: { from: window.location.pathname } });
      }
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    if (loading) {
      return <span className="watchlist-spinner" />;
    }
    if (inWatchlist) {
      return <BookmarkAdded />;
    }
    return <Add />;
  };

  const getLabel = () => {
    if (loading) {
      return inWatchlist ? 'Removing...' : 'Adding...';
    }
    if (!isAuthenticated) {
      return 'Add to Watchlist';
    }
    return inWatchlist ? 'In Watchlist' : 'Watchlist';
  };

  return (
    <button
      className={`watchlist-btn watchlist-btn-${size} ${className} ${inWatchlist ? 'watchlist-btn-active' : ''} ${loading ? 'watchlist-btn-loading' : ''}`}
      onClick={handleToggleWatchlist}
      disabled={loading}
      title={error || (inWatchlist ? 'Remove from watchlist' : 'Add to watchlist')}
    >
      <span className="watchlist-icon">{getIcon()}</span>
      {showLabel && <span className="watchlist-label">{getLabel()}</span>}
    </button>
  );
};

export default WatchlistButton;
