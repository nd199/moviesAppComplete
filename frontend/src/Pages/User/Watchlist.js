import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmarks, PlayArrow, MovieFilter, Tv } from '@mui/icons-material';
import FilterNavbar from '../../Components/FilterNavbar';
import WatchlistButton from '../../Components/WatchlistButton';
import { watchlistAPI } from '../../AxiosMethods';
import { fetchTmdbMovieDetails, fetchTmdbTvShowDetails } from '../../Network/ApiCalls';
import GlobalLoader from '../../Components/GlobalLoader';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    watchlistAPI.getWatchlist().then(r => { setWatchlist(r.data || []); setLoading(false); })
      .catch(() => { setError('Failed to load watchlist.'); setLoading(false); });
  }, []);

  const getPoster = (p) => p?.startsWith('http') ? p : p ? `https://image.tmdb.org/t/p/w500${p}` : 'https://via.placeholder.com/300x450/111/333?text=No+Poster';

  const filtered = watchlist.filter(item => {
    if (searchQuery.trim() && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => sortBy === 'popularity' ? new Date(b.addedAt) - new Date(a.addedAt) : a.title.localeCompare(b.title));

  if (loading) return <><GlobalLoader open message="Loading watchlist..." /><div className="min-h-screen bg-surface-950 pt-20"><FilterNavbar sortBy={sortBy} setSortBy={setSortBy} searchQuery={searchQuery} setSearchQuery={setSearchQuery} genre={genre} setGenre={setGenre} year={year} setYear={setYear} rating={rating} setRating={setRating} /></div></>;

  if (error) return (
    <div className="min-h-screen bg-surface-950 pt-20">
      <FilterNavbar sortBy={sortBy} setSortBy={setSortBy} searchQuery={searchQuery} setSearchQuery={setSearchQuery} genre={genre} setGenre={setGenre} year={year} setYear={setYear} rating={rating} setRating={setRating} />
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-red-400">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-950 pt-20">
      <FilterNavbar sortBy={sortBy} setSortBy={setSortBy} searchQuery={searchQuery} setSearchQuery={setSearchQuery} genre={genre} setGenre={setGenre} year={year} setYear={setYear} rating={rating} setRating={setRating} />
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
          <Bookmarks className="text-brand-500" />
          <h1 className="text-2xl font-bold text-white m-0">My Watchlist</h1>
          <span className="glass text-[#8892b0] px-2.5 py-1 rounded-xl text-xs font-medium">{filtered.length} items</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Bookmarks className="text-6xl text-surface-700" />
            <h2 className="text-xl font-semibold text-[#8892b0] m-0">{watchlist.length === 0 ? 'Watchlist is empty' : 'No matches'}</h2>
            <p className="text-[#5a6380] text-sm m-0">{watchlist.length === 0 ? 'Add movies and shows to see them here' : 'Try adjusting filters'}</p>
            <div className="flex gap-3 mt-2">
              <Link to="/movies" className="btn-primary rounded-xl">Movies</Link>
              <Link to="/shows" className="btn-secondary rounded-xl">Shows</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map(item => (
              <div key={`${item.tmdbId}-${item.mediaType}`} className="group glass rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img src={getPoster(item.posterPath)} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 sm:bg-black/0 sm:group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                    <button onClick={async (e) => { e.preventDefault(); const d = item.mediaType === 'movie' ? await fetchTmdbMovieDetails(item.tmdbId) : await fetchTmdbTvShowDetails(item.tmdbId); window.location.href = d?.trailer ? `/video/${item.title}?trailer=${encodeURIComponent(d.trailer)}` : `/video/${item.title}`; }}
                      className="w-11 h-11 rounded-full btn-primary flex items-center justify-center border-none cursor-pointer !p-0">
                      <PlayArrow sx={{ fontSize: 22 }} />
                    </button>
                  </div>
                  <div className="absolute top-2 right-2 glass text-white px-2 py-0.5 rounded-xl text-[0.6rem] font-medium flex items-center gap-1">
                    {item.mediaType === 'tv' ? <Tv sx={{ fontSize: 12 }} /> : <MovieFilter sx={{ fontSize: 12 }} />}
                    {item.mediaType === 'tv' ? 'TV' : 'Movie'}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-white m-0 mb-2 truncate">{item.title}</h3>
                  <WatchlistButton tmdbId={item.tmdbId} mediaType={item.mediaType} title={item.title} posterPath={item.posterPath} size="small" showLabel={false}
                    className="!w-full !rounded-xl !bg-white/5 !border-white/10 hover:!bg-red-500/15 hover:!border-red-500/30 hover:!text-red-400" />
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
