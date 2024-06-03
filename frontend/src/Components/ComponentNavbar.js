import React from "react";
import "./ComponentNavbar.css";

const ComponentNavbar = () => {
  return (
    <div className="comp-navbar">
      <div className="comp-navbar-left">
        <div className="comp-navbar-left-item">
          <h3>Sort By</h3>
          <select>
            <option>Popularity</option>
            <option>Rating</option>
          </select>
        </div>
        <div className="comp-navbar-left-item search">
          <h3>Search</h3>
          <input type="text" placeholder="Search Movies.." />
        </div>
      </div>
      <div className="comp-navbar-right right">
        <div className="comp-navbar-right-item">
          <h3>Genres</h3>
          <select>
            <option>Action</option>
            <option>Adventure</option>
            <option>Comedy</option>
            <option>Crime</option>
            <option>Documentary</option>
            <option>Drama</option>
            <option>Family</option>
            <option>Fantasy</option>
            <option>History</option>
            <option>Horror</option>
            <option>Music</option>
            <option>Mystery</option>
            <option>Romance</option>
            <option>Science Fiction</option>
            <option>TV Movie</option>
            <option>Thriller</option>
            <option>War</option>
            <option>Western</option>
          </select>
        </div>
        <div className="comp-navbar-right-item">
          <h3>Year</h3>
          <select>
            <option>2022</option>
            <option>2021</option>
            <option>2020</option>
          </select>
        </div>
        <div className="comp-navbar-right-item">
          <h3>Rating</h3>
          <select>
            <option> 1.0 ⭐️ </option>
            <option> 2.0 ⭐️ </option>
            <option> 3.0 ⭐️ </option>
            <option> 4.0 ⭐️ </option>
            <option> 5.0 ⭐️ </option>
            <option> 6.0 ⭐️ </option>
            <option> 7.0 ⭐️ </option>
            <option> 8.0 ⭐️ </option>
            <option> 9.0 ⭐️ </option>
            <option> 10.0 ⭐️ </option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ComponentNavbar;
