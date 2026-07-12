import { Search, ExpandMore } from '@mui/icons-material';

const FilterNavbar = ({ sortBy, setSortBy, searchQuery, setSearchQuery, genre, setGenre, year, setYear, rating, setRating }) => {
  const genres = ['All', 'Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Fantasy'];
  const hasFilters = genre || year || rating || sortBy !== 'popularity';

  return (
    <div className="flex flex-col gap-3">
      {/* Search — full width */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5568]" sx={{ fontSize: 18 }} />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full glass rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:border-brand-500/40 transition-all"
        />
      </div>

      {/* Filters — 2x2 grid on mobile, row on desktop */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2">
        <Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="popularity">Popular</option>
          <option value="rating">Top Rated</option>
        </Select>
        <Select value={genre} onChange={e => setGenre(e.target.value)}>
          {genres.map(g => <option key={g} value={g === 'All' ? '' : g}>{g}</option>)}
        </Select>
        <Select value={year} onChange={e => setYear(e.target.value)}>
          <option value="">Year</option>
          {[2025,2024,2023,2022,2021].map(y => <option key={y} value={y}>{y}</option>)}
        </Select>
        <Select value={rating} onChange={e => setRating(e.target.value)}>
          <option value="">Rating</option>
          <option value="7.0">7+</option>
          <option value="8.0">8+</option>
          <option value="9.0">9+</option>
        </Select>

        {hasFilters && (
          <button
            onClick={() => { setGenre(''); setYear(''); setRating(''); setSortBy('popularity'); }}
            className="col-span-2 sm:col-span-1 px-3 py-2.5 rounded-xl text-[0.75rem] text-[#8892b0] hover:text-white bg-transparent border border-white/10 hover:border-brand-500/30 cursor-pointer transition-all whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

const Select = ({ value, onChange, children }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full appearance-none glass rounded-xl pl-3 pr-8 py-2.5 text-white text-sm cursor-pointer hover:border-brand-500/30 focus:outline-none focus:border-brand-500/40 transition-all"
    >
      {children}
    </select>
    <ExpandMore className="absolute right-2 top-1/2 -translate-y-1/2 text-[#4a5568] pointer-events-none" sx={{ fontSize: 16 }} />
  </div>
);

export default FilterNavbar;
