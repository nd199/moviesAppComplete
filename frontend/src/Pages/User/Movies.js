import { SearchOff } from '@mui/icons-material';
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ColListItem from "../../Components/Col-ListItem";
import FilterNavbar from "../../Components/FilterNavbar";
import Footer from "../../Components/Footer";
import { publicRequest } from "../../AxiosMethods";
import { useScrollReveal } from "../../Utils/useScrollReveal";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchParams] = useSearchParams();
  const gridRef = useScrollReveal({ threshold: 0.05 });

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        setSearching(true);
        const res = await publicRequest().get(`/tmdb/search/movies?query=${encodeURIComponent(searchQuery)}`);
        setMovies(res.data?.results || []);
      } else {
        setSearching(false);
        const sortParam = sortBy === 'rating' ? 'vote_average.desc' : 'popularity.desc';
        let url = `/tmdb/discover/movies?sort_by=${sortParam}&vote_count.gte=100`;
        if (genre) url += `&with_genres=${genre}`;
        if (year) url += `&primary_release_year=${year}`;
        const res = await publicRequest().get(url);
        let results = res.data?.results || [];
        if (rating) {
          results = results.filter(m => parseFloat(m.rating || 0) >= parseFloat(rating));
        }
        setMovies(results);
      }
    } catch {
      setMovies([]);
    }
    setLoading(false);
  }, [searchQuery, sortBy, genre, year, rating]);

  useEffect(() => {
    const t = setTimeout(fetchMovies, searchQuery ? 500 : 0);
    return () => clearTimeout(t);
  }, [fetchMovies, searchQuery]);

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="relative pt-20 pb-8 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-brand-500/5 blur-[120px] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <h1 className="text-4xl sm:text-5xl font-black text-white m-0 mb-2 text-center tracking-tight">Movies</h1>
          <div className="h-[3px] w-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
          <FilterNavbar sortBy={sortBy} setSortBy={setSortBy} searchQuery={searchQuery} setSearchQuery={setSearchQuery} genre={genre} setGenre={setGenre} year={year} setYear={setYear} rating={rating} setRating={setRating} mediaType="movie" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 pb-8">
        <div className="mt-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="relative">
                <div className="absolute inset-0 w-16 h-16 rounded-full animate-glow" />
                <div className="w-12 h-12 border-[3px] border-white/10 border-t-brand-500 rounded-full animate-spin" />
              </div>
              <p className="text-[#8892b0] text-sm m-0">{searching ? 'Searching...' : 'Loading...'}</p>
            </div>
          ) : movies.length > 0 ? (
            <div ref={gridRef} className="reveal stagger-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.map((m, i) => (
                <ColListItem key={m.tmdbId || i} name={m.title || m.name} desc={m.description} year={m.year} img={m.poster} ageRating={m.ageRating} rating={m.rating} runtime={m.runtime} genre={m.genre} trailer={m.trailer} tmdbId={m.tmdbId} mediaType="movie" />
              ))}
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
