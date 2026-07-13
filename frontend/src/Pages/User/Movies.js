import { SearchOff } from '@mui/icons-material';
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ColListItem from "../../Components/Col-ListItem";
import FilterNavbar from "../../Components/FilterNavbar";
import Footer from "../../Components/Footer";
import { fetchTmdbTrendingMovies, searchTmdbMovies } from "../../Network/ApiCalls";

const Movies = () => {
  const dispatch = useDispatch();
  const { tmdbTrendingMovies = [], tmdbFetching = false, tmdbSearchResults = [] } = useSelector(s => s?.product || {});
  const [sortBy, setSortBy] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => { fetchTmdbTrendingMovies(dispatch); }, [dispatch]);
  useEffect(() => {
    if (!searchQuery.trim()) { setSearching(false); return; }
    setSearching(true);
    const t = setTimeout(() => searchTmdbMovies(dispatch, searchQuery), 500);
    return () => clearTimeout(t);
  }, [dispatch, searchQuery]);

  const filter = useCallback((movies) => {
    if (!movies?.length) return [];
    return movies.filter(m => {
      if (genre && genre !== 'All') { const g = m.genre || ''; if (!g.toLowerCase().includes(genre.toLowerCase())) return false; }
      if (year) { const y = m.year || (m.release_date && new Date(m.release_date).getFullYear()); if (y !== parseInt(year)) return false; }
      if (rating && parseFloat(m.rating || m.vote_average || 0) < parseFloat(rating)) return false;
      return true;
    }).sort((a, b) => sortBy === "popularity" ? (b.popularity || 0) - (a.popularity || 0) : (parseFloat(b.rating || 0) - parseFloat(a.rating || 0)));
  }, [genre, year, rating, sortBy]);

  const movies = filter(searchQuery ? tmdbSearchResults : tmdbTrendingMovies);
  const loading = tmdbFetching || (searching && !tmdbSearchResults.length);

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-[1400px] mx-auto px-5 pt-20 pb-8">
        <h1 className="text-4xl sm:text-5xl font-black text-white m-0 mb-2 text-center tracking-tight">Movies</h1>
        <div className="h-[3px] w-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
        <FilterNavbar sortBy={sortBy} setSortBy={setSortBy} searchQuery={searchQuery} setSearchQuery={setSearchQuery} genre={genre} setGenre={setGenre} year={year} setYear={setYear} rating={rating} setRating={setRating} />
        <div className="mt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 border-[3px] border-white/10 border-t-brand-500 rounded-full animate-spin" />
              <p className="text-[#8892b0] text-sm m-0">{searching ? 'Searching...' : 'Loading...'}</p>
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.map((m, i) => <ColListItem key={m.id || m.tmdbId || i} name={m.title || m.name} desc={m.description || m.overview} year={m.year} img={m.poster} ageRating={m.ageRating} rating={m.rating || m.vote_average} runtime={m.runtime} genre={m.genre} trailer={m.trailer} tmdbId={m.tmdbId} mediaType="movie" />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <SearchOff className="text-6xl text-surface-700" />
              <h3 className="text-xl font-semibold text-[#8892b0] m-0">{searchQuery ? 'No results' : 'No movies available'}</h3>
              <p className="text-[#5a6380] text-sm m-0">Try different keywords or filters</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Movies;
