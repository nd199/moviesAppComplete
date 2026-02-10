import { useState } from "react";
import "./FilterNavbar.css";

const FilterNavbar = ({
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
  genre,
  setGenre,
  year,
  setYear,
  rating,
  setRating,
}) => {
  const [activeFilter, setActiveFilter] = useState(null);

  const genres = [
    "All",
    "Action",
    "Adventure",
    "Comedy",
    "Crime",
    "Drama",
    "Horror",
    "Romance",
    "Thriller",
    "Sci-Fi",
    "Fantasy",
  ];

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <div className="filter-item">
          <label>Sort</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            onFocus={() => setActiveFilter("sort")}
            onBlur={() => setActiveFilter(null)}
          >
            <option value="popularity">Popularity ↓</option>
            <option value="rating">Rating ↓</option>
          </select>
        </div>

        <div className="filter-item search-field">
          <label>Search</label>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search movies & shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-item">
          <label>Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            onFocus={() => setActiveFilter("genre")}
            onBlur={() => setActiveFilter(null)}
          >
            {genres.map((g) => (
              <option key={g} value={g === "All Genres" ? "" : g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            onFocus={() => setActiveFilter("year")}
            onBlur={() => setActiveFilter(null)}
          >
            <option value="">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>
        </div>

        <div className="filter-item">
          <label>Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            onFocus={() => setActiveFilter("rating")}
            onBlur={() => setActiveFilter(null)}
          >
            <option value="">All Ratings</option>
            <option value="7.0">7.0+ ⭐</option>
            <option value="8.0">8.0+ ⭐</option>
            <option value="9.0">9.0+ ⭐</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterNavbar;
