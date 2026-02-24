import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ColListItem from "../../Components/Col-ListItem";
import FilterNavbar from "../../Components/FilterNavbar";
import Footer from "../../Components/Footer";
import NavBar from "../../Components/NavBar";
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
    if (searchQuery.trim()) {
      setIsSearching(true);
      searchTmdbMovies(dispatch, searchQuery);
    } else {
      fetchTmdbTrendingMovies(dispatch);
      setIsSearching(false);
    }
  }, [dispatch, searchQuery]);

  const filterMovies = useCallback(
    (movies) => {
      if (!movies?.length) return [];

      return movies
        .filter((movie) => !genre || genre === 'All' || 
          (movie.genre && 
            (movie.genre.toLowerCase().includes(genre.toLowerCase()) || 
            movie.genre.split(',').some(g => g.trim().toLowerCase().includes(genre.toLowerCase()))
          )))
        .filter((movie) => !year || movie.year === parseInt(year))
        .filter((movie) => !rating || movie.rating >= parseFloat(rating))
        .sort((a, b) => {
          if (sortBy === "popularity") {
            return (b.voteCount || 0) - (a.voteCount || 0);
          } else if (sortBy === "rating") {
            return (b.rating || 0) - (a.rating || 0);
          }
          return 0;
        });
    },
    [genre, year, rating, sortBy]
  );

  const moviesToDisplay = searchQuery ? tmdbSearchResults : tmdbTrendingMovies;
  const filteredMovies = filterMovies(moviesToDisplay);

  return (
    <div className="moviesPage">
      <NavBar />
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
          {tmdbFetching ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text-primary">
                Loading your movies collection...
              </p>
              <p className="loading-text-secondary">
                Fetching latest ratings and trailers
              </p>
            </div>
          ) : filteredMovies.length > 0 ? (
            filteredMovies.map((movie, id) => (
              <ColListItem
                key={`${movie.id || id}-${movie.name}`}
                name={movie.name}
                desc={movie.description}
                year={movie.year}
                img={movie.poster}
                ageRating={movie.ageRating}
                cost={movie.cost}
                rating={movie.rating}
                runtime={movie.runtime}
                genre={movie.genre}
                trailer={movie.trailer}
                className="card"
              />
            ))
          ) : (
            <div className="empty-state">
              <h3>No movies match your filters</h3>
              <p>
                Try clearing some filters or search for something new. We've got
                thousands of movies waiting!
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
