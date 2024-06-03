import React from "react";
import "./Home.css";
import NavBar from "../Components/NavBar";
import Featured from "../Components/Featured";
import List from "../Components/List";
import Footer from "../Components/Footer";

const Home = () => {
    return (
        <div className="home">
            <NavBar/>
            <Featured type={"series"}/>
            <List/>
            <List/>
            <List/>
            <Footer/>
        </div>
    );
};

export default Home;
