import { Search, Tune, Close } from '@mui/icons-material';
import { useState } from 'react';

const FilterNavbar = ({ sortBy, setSortBy, searchQuery, setSearchQuery, genre, setGenre, year, setYear, rating, setRating }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const genres = ['All', 'Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Fantasy'];
  const hasFilters = genre || year || rating || sortBy !== 'popularity';
  const activeFilterCount = [genre, year !== '' ? year : null, rating].filter(Boolean).length + (sortBy !== 'popularity' ? 1 : 0);

  return (
    <div className="flex flex-col gap-3">
      {/* Search row — search + filter toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5568]" sx={{ fontSize: 18 }} />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-white/[0.06] border border-white/10 pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:border-brand-500/40 transition-all"
          />
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer shrink-0 ${
            filtersOpen || hasFilters
              ? 'bg-brand-500/15 border-brand-500/30 text-brand-300'
              : 'bg-white/[0.06] border-white/10 text-[#8892b0] hover:text-white hover:border-white/20'
          }`}
        >
          <Tune sx={{ fontSize: 16 }} />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-[0.65rem] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters dropdown */}
      {filtersOpen && (
        <div className="flex flex-wrap items-center gap-2 animate-fade-in">
          <Select value={sortBy} onChange={e => setSortBy(e.target.value)} label="Sort">
            <option value="popularity">Popular</option>
            <option value="rating">Top Rated</option>
          </Select>
          <Select value={genre} onChange={e => setGenre(e.target.value)} label="Genre">
            {genres.map(g => <option key={g} value={g === 'All' ? '' : g}>{g}</option>)}
          </Select>
          <Select value={year} onChange={e => setYear(e.target.value)} label="Year">
            <option value="">Year</option>
            {[2025,2024,2023,2022,2021].map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
          <Select value={rating} onChange={e => setRating(e.target.value)} label="Rating">
            <option value="">Rating</option>
            <option value="7.0">7+</option>
            <option value="8.0">8+</option>
            <option value="9.0">9+</option>
          </Select>

          {hasFilters && (
            <button
              onClick={() => { setGenre(''); setYear(''); setRating(''); setSortBy('popularity'); }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[0.75rem] text-[#8892b0] hover:text-white bg-transparent border border-white/10 hover:border-red-500/30 hover:text-red-400 cursor-pointer transition-all"
            >
              <Close sx={{ fontSize: 14 }} /> Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const Select = ({ value, onChange, children, label }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="appearance-none rounded-xl bg-white/[0.06] border border-white/10 pl-3 pr-8 py-2.5 text-white text-sm cursor-pointer hover:border-white/20 focus:outline-none focus:border-brand-500/40 transition-all"
    >
      {children}
    </select>
    <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#4a5568]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  </div>
);

export default FilterNavbar;
