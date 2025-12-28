import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ColListItem from "../Components/Col-ListItem";
import ComponentNavbar from "../Components/ComponentNavbar";
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import { fetchMovies } from "../Network/ApiCalls";
import "./Movies.css";

const Movies = () => {
  const dispatch = useDispatch();
  const { movies = [], loading = false } = useSelector(
    (state) => state?.product || {}
  );

  const [sortBy, setSortBy] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    fetchMovies(dispatch);
  }, [dispatch]);

  const filterMovies = useCallback(
    (movies) => {
      if (!movies?.length) return [];

      return movies
        .filter(
          (movie) =>
            !searchQuery ||
            movie.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((movie) => !genre || movie.genre?.includes(genre))
        .filter((movie) => !year || movie.year === parseInt(year))
        .filter((movie) => !rating || movie.rating >= parseFloat(rating))
        .sort((a, b) => {
          if (sortBy === "popularity") {
            return (b.popularity || 0) - (a.popularity || 0);
          } else if (sortBy === "rating") {
            return (b.rating || 0) - (a.rating || 0);
          }
          return 0;
        });
    },
    [searchQuery, genre, year, rating, sortBy]
  );

  const filteredMovies = filterMovies(movies);

  return (
    <div className="moviesPage">
      <NavBar />
      <div className="movieContainer">
        <h1>Movies</h1>
        <ComponentNavbar
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
          {loading ? (
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
