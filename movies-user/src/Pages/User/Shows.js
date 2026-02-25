import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ColListItem from "../../Components/Col-ListItem";
import FilterNavbar from "../../Components/FilterNavbar";
import Footer from "../../Components/Footer";
import NavBar from "../../Components/NavBar";
import { fetchTmdbTrendingShows, searchTmdbShows } from "../../Network/ApiCalls";
import "./Shows.css";

const Shows = () => {
  const dispatch = useDispatch();
  const { tmdbTrendingShows = [], tmdbFetching = false, tmdbSearchResults = [] } = useSelector(
    (state) => state?.product || {}
  );

  const [sortBy, setSortBy] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Initial load
    fetchTmdbTrendingShows(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const debounceTimer = setTimeout(() => {
        searchTmdbShows(dispatch, searchQuery);
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setIsSearching(false);
    }
  }, [dispatch, searchQuery]);

  const filterShows = useCallback(
    (shows) => {
      if (!shows?.length) return [];

      return shows
        .filter((show) => {
          // Genre filtering
          if (genre && genre !== 'All') {
            const showGenres = show.genre || '';
            const genreMatch = showGenres.toLowerCase().includes(genre.toLowerCase()) || 
                              showGenres.split(',').some(g => g.trim().toLowerCase().includes(genre.toLowerCase()));
            if (!genreMatch) return false;
          }
          
          // Year filtering - for TV shows, use first_air_date
          if (year) {
            const showYear = show.year || (show.first_air_date && new Date(show.first_air_date).getFullYear());
            if (showYear !== parseInt(year)) return false;
          }
          
          // Rating filtering
          if (rating) {
            const showRating = parseFloat(show.rating || show.vote_average || 0);
            if (showRating < parseFloat(rating)) return false;
          }
          
          return true;
        })
        .sort((a, b) => {
          if (sortBy === "popularity") {
            return (b.voteCount || b.popularity || 0) - (a.voteCount || a.popularity || 0);
          } else if (sortBy === "rating") {
            return (parseFloat(b.rating || b.vote_average || 0) - parseFloat(a.rating || a.vote_average || 0));
          }
          return 0;
        });
    },
    [genre, year, rating, sortBy]
  );

  const showsToDisplay = searchQuery ? tmdbSearchResults : tmdbTrendingShows;
  const filteredShows = filterShows(showsToDisplay);
  const isLoading = tmdbFetching || (isSearching && tmdbSearchResults.length === 0);

  return (
    <div className="showsPage">
      <NavBar />
      <div className="showContainer">
        <h1>TV Shows</h1>
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
        <div className="showContainerContent">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text-primary">
                {isSearching ? 'Searching TV shows...' : 'Loading your TV shows collection...'}
              </p>
              <p className="loading-text-secondary">
                {isSearching ? 'Finding the best series for you' : 'Fetching latest episodes & ratings'}
              </p>
            </div>
          ) : filteredShows.length > 0 ? (
            filteredShows.map((show, id) => (
              <ColListItem
                key={`${show.id || show.tmdbId || id}-${show.name || show.title}`}
                name={show.name || show.title}
                desc={show.description || show.overview}
                year={show.year}
                img={show.poster}
                ageRating={show.ageRating}
                rating={show.rating || show.vote_average}
                runtime={show.runtime}
                genre={show.genre}
                trailer={show.trailer}
                className="card"
              />
            ))
          ) : (
            <div className="empty-state">
              <h3>{searchQuery ? 'No TV shows found' : 'No shows match your filters'}</h3>
              <p>
                {searchQuery 
                  ? 'Try searching with different keywords or check the spelling.'
                  : 'Try clearing some filters or adjusting your criteria. We\'ve got thousands of series waiting!'
                }
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Shows;
