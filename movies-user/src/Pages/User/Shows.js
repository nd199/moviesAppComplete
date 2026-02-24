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
    if (searchQuery.trim()) {
      setIsSearching(true);
      searchTmdbShows(dispatch, searchQuery);
    } else {
      fetchTmdbTrendingShows(dispatch);
      setIsSearching(false);
    }
  }, [dispatch, searchQuery]);

  const filterShows = useCallback(
    (shows) => {
      if (!shows?.length) return [];

      return shows
        .filter((show) => !genre || genre === 'All' || 
          (show.genre && 
            (show.genre.toLowerCase().includes(genre.toLowerCase()) || 
            show.genre.split(',').some(g => g.trim().toLowerCase().includes(genre.toLowerCase()))
          )))
        .filter((show) => !year || show.year === parseInt(year))
        .filter((show) => !rating || show.rating >= parseFloat(rating))
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

  const showsToDisplay = searchQuery ? tmdbSearchResults : tmdbTrendingShows;
  const filteredShows = filterShows(showsToDisplay);

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
          {tmdbFetching ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text-primary">Loading TV shows...</p>
              <p className="loading-text-secondary">
                Fetching latest episodes & ratings
              </p>
            </div>
          ) : filteredShows.length > 0 ? (
            filteredShows.map((show, id) => (
              <ColListItem
                key={`${show.id || id}-${show.name}`}
                name={show.name}
                desc={show.description}
                year={show.year}
                img={show.poster}
                ageRating={show.ageRating}
                rating={show.rating}
                runtime={show.runtime}
                genre={show.genre}
                trailer={show.trailer}
                className="card"
              />
            ))
          ) : (
            <div className="empty-state">
              <h3>No shows found</h3>
              <p>
                Try adjusting your filters or search for your favorite series.
                We've got thousands of episodes waiting!
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
