import React from "react";
import "./ComponentNavbar.css";

const ComponentNavbar = ({
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
    return (
        <div className="comp-navbar">
            <div className="comp-navbar-left">
                <div className="comp-navbar-left-item">
                    <h3>Sort By</h3>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="popularity">Popularity</option>
                        <option value="rating">Rating</option>
                    </select>
                </div>
                <div className="comp-navbar-left-item search">
                    <h3>Search</h3>
                    <input
                        type="text"
                        placeholder="Search Movies.."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="comp-navbar-right right">
                <div className="comp-navbar-right-item">
                    <h3>Genres</h3>
                    <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                        <option value="">All</option>
                        <option value="Action">Action</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Crime">Crime</option>
                        <option value="Documentary">Documentary</option>
                        <option value="Drama">Drama</option>
                        <option value="Family">Family</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="History">History</option>
                        <option value="Horror">Horror</option>
                        <option value="Music">Music</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Romance">Romance</option>
                        <option value="Science Fiction">Science Fiction</option>
                        <option value="TV Movie">TV Movie</option>
                        <option value="Thriller">Thriller</option>
                        <option value="War">War</option>
                        <option value="Western">Western</option>
                    </select>
                </div>
                <div className="comp-navbar-right-item">
                    <h3>Year</h3>
                    <select value={year} onChange={(e) => setYear(e.target.value)}>
                        <option value="">All</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                    </select>
                </div>
                <div className="comp-navbar-right-item">
                    <h3>Rating</h3>
                    <select value={rating} onChange={(e) => setRating(e.target.value)}>
                        <option value="">All</option>
                        <option value="1.0">1.0 ⭐️</option>
                        <option value="2.0">2.0 ⭐️</option>
                        <option value="3.0">3.0 ⭐️</option>
                        <option value="4.0">4.0 ⭐️</option>
                        <option value="5.0">5.0 ⭐️</option>
                        <option value="6.0">6.0 ⭐️</option>
                        <option value="7.0">7.0 ⭐️</option>
                        <option value="8.0">8.0 ⭐️</option>
                        <option value="9.0">9.0 ⭐️</option>
                        <option value="10.0">10.0 ⭐️</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ComponentNavbar;
