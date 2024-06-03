import React from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import "./Shows.css";
import ComponentNavbar from "../Components/ComponentNavbar";
import ColListItem from "../Components/Col-ListItem";

const Shows = () => {
  return (
    <div className="showsPage">
      <NavBar />
      <div className="showContainer">
        <h1>Shows</h1>
        <ComponentNavbar />
        <div className="showContainerContent">
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

export default Shows;
