import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmarks, 
  PlayArrow, 
  DeleteOutlined,
  MovieFilter,
  Tv
} from '@mui/icons-material';
import FilterNavbar from '../../Components/FilterNavbar';
import WatchlistButton from '../../Components/WatchlistButton';
import { watchlistAPI } from '../../AxiosMethods';
import { fetchTmdbMovieDetails, fetchTmdbTvShowDetails } from '../../Network/ApiCalls';
import GlobalLoader from '../../Components/GlobalLoader';
import './Watchlist.css';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [sortBy, setSortBy] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await watchlistAPI.getWatchlist();
      setWatchlist(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch watchlist:', err);
      setError('Failed to load watchlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (tmdbId, mediaType) => {
    try {
      await watchlistAPI.removeFromWatchlist(tmdbId, mediaType);
      setWatchlist(prev => prev.filter(
        item => !(item.tmdbId === tmdbId && item.mediaType === mediaType)
      ));
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
  };

  const getMediaTypeIcon = (mediaType) => {
    return mediaType === 'tv' ? <Tv /> : <MovieFilter />;
  };

  const getPosterUrl = (posterPath) => {
    if (!posterPath) return 'https://via.placeholder.com/300x450/1a1a1a/9ca3af?text=No+Poster';
    return posterPath.startsWith('http') ? posterPath : `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  const handlePlay = async (item, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      let details;
      if (item.mediaType === 'movie') {
        details = await fetchTmdbMovieDetails(item.tmdbId);
      } else if (item.mediaType === 'tv') {
        details = await fetchTmdbTvShowDetails(item.tmdbId);
      }
      
      if (details?.trailer) {
        // Navigate with trailer
        window.location.href = `/video/${item.title}?trailer=${encodeURIComponent(details.trailer)}`;
      } else {
        // Navigate without trailer (will show default video)
        window.location.href = `/video/${item.title}`;
      }
    } catch (error) {
      console.error('Failed to fetch trailer:', error);
      // Navigate without trailer on error
      window.location.href = `/video/${item.title}`;
    }
  };

  const filterWatchlist = (items) => {
    if (!items?.length) return [];

    return items.filter((item) => {
      // Search filter
      if (searchQuery.trim()) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = item.title.toLowerCase().includes(searchLower) ||
                              item.mediaType.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Genre filter (note: watchlist items don't have genre info from backend)
      // This would need backend enhancement to include genre data
      if (genre && genre !== 'All') {
        // For now, we'll skip genre filtering for watchlist
        // as the backend doesn't provide genre information
      }

      // Year filter (note: watchlist items don't have year info from backend)
      // This would need backend enhancement to include year data
      if (year) {
        // For now, we'll skip year filtering for watchlist
        // as the backend doesn't provide year information
      }

      // Rating filter (note: watchlist items don't have rating info from backend)
      // This would need backend enhancement to include rating data
      if (rating) {
        // For now, we'll skip rating filtering for watchlist
        // as the backend doesn't provide rating information
      }

      return true;
    }).sort((a, b) => {
      // Sort by added date (newest first) or by title
      if (sortBy === 'popularity') {
        return new Date(b.addedAt) - new Date(a.addedAt);
      } else if (sortBy === 'rating') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const filteredWatchlist = filterWatchlist(watchlist);

  if (loading) {
    return (
      <>
        <GlobalLoader open={true} message="Loading your watchlist..." />
        <div className="watchlist-page">
          <FilterNavbar
            sortBy={sortBy}
            setSortBy={setSortBy}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            genre={genre}
            setGenre={setGenre}
            year={year}
            setYear={setYear}
            rating={rating}
            setRating={setRating}
          />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="watchlist-page">
        <FilterNavbar
          sortBy={sortBy}
          setSortBy={setSortBy}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          genre={genre}
          setGenre={setGenre}
          year={year}
          setYear={setYear}
          rating={rating}
          setRating={setRating}
        />
        <div className="watchlist-error">
          <p>{error}</p>
          <button onClick={fetchWatchlist} className="watchlist-retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      <FilterNavbar
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        genre={genre}
        setGenre={setGenre}
        year={year}
        setYear={setYear}
        rating={rating}
        setRating={setRating}
      />
      
      <div className="watchlist-container">
        <div className="watchlist-header">
          <Bookmarks className="watchlist-header-icon" />
          <h1>My Watchlist</h1>
          <span className="watchlist-count">{filteredWatchlist.length} items</span>
        </div>

        {filteredWatchlist.length === 0 ? (
          <div className="watchlist-empty">
            <Bookmarks className="watchlist-empty-icon" />
            <h2>{watchlist.length === 0 ? 'Your watchlist is empty' : 'No items match your filters'}</h2>
            <p>{watchlist.length === 0 ? 'Add movies and shows to your watchlist to see them here' : 'Try adjusting your search or filters'}</p>
            <div className="watchlist-empty-actions">
              <Link to="/movies" className="watchlist-empty-btn">Browse Movies</Link>
              <Link to="/shows" className="watchlist-empty-btn">Browse Shows</Link>
            </div>
          </div>
        ) : (
          <div className="watchlist-grid">
            {filteredWatchlist.map((item) => (
              <div key={`${item.tmdbId}-${item.mediaType}`} className="watchlist-card">
                <div className="watchlist-card-media">
                  <img 
                    src={getPosterUrl(item.posterPath)} 
                    alt={item.title}
                    className="watchlist-card-poster"
                  />
                  <div className="watchlist-card-overlay">
                    <button 
                      onClick={(e) => handlePlay(item, e)}
                      className="watchlist-card-play"
                    >
                      <PlayArrow />
                    </button>
                  </div>
                  <div className="watchlist-card-badge">
                    {getMediaTypeIcon(item.mediaType)}
                    <span>{item.mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
                  </div>
                </div>
                <div className="watchlist-card-info">
                  <h3 className="watchlist-card-title">{item.title}</h3>
                  <div className="watchlist-card-actions">
                    <WatchlistButton
                      tmdbId={item.tmdbId}
                      mediaType={item.mediaType}
                      title={item.title}
                      posterPath={item.posterPath}
                      size="small"
                      showLabel={false}
                      className="watchlist-remove-btn"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
