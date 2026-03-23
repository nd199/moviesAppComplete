import { Movie, SearchOff } from '@mui/icons-material';
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ColListItem from "../../Components/Col-ListItem";
import FilterNavbar from "../../Components/FilterNavbar";
import Footer from "../../Components/Footer";
import { fetchTmdbTrendingMovies, searchTmdbMovies } from "../../Network/ApiCalls";
import "./Movies.css";

const Movies = () => {
  const dispatch = useDispatch();
  const { tmdbTrendingMovies = [], tmdbFetching = false, tmdbSearchResults = [] } = useSelector(
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
    fetchTmdbTrendingMovies(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const debounceTimer = setTimeout(() => {
        searchTmdbMovies(dispatch, searchQuery);
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setIsSearching(false);
    }
  }, [dispatch, searchQuery]);

  const filterMovies = useCallback(
    (movies) => {
      if (!movies?.length) return [];

      return movies
        .filter((movie) => {
          // Genre filtering
          if (genre && genre !== 'All') {
            const movieGenres = movie.genre || '';
            const genreMatch = movieGenres.toLowerCase().includes(genre.toLowerCase()) || 
                              movieGenres.split(',').some(g => g.trim().toLowerCase().includes(genre.toLowerCase()));
            if (!genreMatch) return false;
          }
          
          // Year filtering
          if (year) {
            const movieYear = movie.year || (movie.release_date && new Date(movie.release_date).getFullYear());
            if (movieYear !== parseInt(year)) return false;
          }
          
          // Rating filtering
          if (rating) {
            const movieRating = parseFloat(movie.rating || movie.vote_average || 0);
            if (movieRating < parseFloat(rating)) return false;
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

  const moviesToDisplay = searchQuery ? tmdbSearchResults : tmdbTrendingMovies;
  const filteredMovies = filterMovies(moviesToDisplay);
  const isLoading = tmdbFetching || (isSearching && tmdbSearchResults.length === 0);

  return (
    <div className="moviesPage">
      <div className="movieContainer">
        <h1>Movies</h1>
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
        <div className="movieContainerContent">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text-primary">
                {isSearching ? 'Searching movies...' : 'Loading your movies collection...'}
              </p>
              <p className="loading-text-secondary">
                {isSearching ? 'Finding the best matches for you' : 'Fetching latest ratings and trailers'}
              </p>
            </div>
          ) : filteredMovies.length > 0 ? (
            filteredMovies.map((movie, id) => (
              <ColListItem
                key={`${movie.id || movie.tmdbId || id}-${movie.title || movie.name}`}
                name={movie.title || movie.name}
                desc={movie.description || movie.overview}
                year={movie.year}
                img={movie.poster}
                ageRating={movie.ageRating}
                cost={movie.cost}
                rating={movie.rating || movie.vote_average}
                runtime={movie.runtime}
                genre={movie.genre}
                trailer={movie.trailer}
                className="card"
                tmdbId={movie.tmdbId}
                mediaType="movie"
              />
            ))
          ) : (
            <div className="empty-state">
              <SearchOff className="empty-state-icon" />
              <h3>{searchQuery ? 'No movies found' : 'No movies match your filters'}</h3>
              <p>
                {searchQuery 
                  ? 'Try searching with different keywords or check the spelling.'
                  : 'Try clearing some filters or adjusting your criteria. We\'ve got thousands of movies waiting!'
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

export default Movies;
