import React from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import "./Movies.css";
import ComponentNavbar from "../Components/ComponentNavbar";
import ColListItem from "../Components/Col-ListItem";

const Movies = () => {
  return (
    <div className="moviesPage">
      <NavBar />
      <div className="movieContainer">
        <h1>Movies</h1>
        <ComponentNavbar />
        <div className="movieContainerContent">
          <ColListItem />
          <ColListItem />
          <ColListItem />
          <ColListItem />
          <ColListItem />
          <ColListItem />
          <ColListItem />
          <ColListItem />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Movies;
