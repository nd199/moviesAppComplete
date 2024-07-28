import React, {useEffect, useState} from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import "./Shows.css";
import ComponentNavbar from "../Components/ComponentNavbar";
import ColListItem from "../Components/Col-ListItem";
import {useDispatch, useSelector} from "react-redux";
import {fetchShows} from "../Network/ApiCalls";

const Shows = () => {
    const dispatch = useDispatch();
    const shows = useSelector((state) => state?.product?.shows);

    const [sortBy, setSortBy] = useState("popularity");
    const [searchQuery, setSearchQuery] = useState("");
    const [genre, setGenre] = useState("");
    const [year, setYear] = useState("");
    const [rating, setRating] = useState("");

    useEffect(() => {
        fetchShows(dispatch);
    }, [dispatch]);

    const filterShows = (shows) => {
        return shows
            .filter(
                (show) =>
                    searchQuery === "" ||
                    show.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .filter((show) => genre === "" || show.genre.includes(genre))
            .filter((show) => year === "" || show.year === parseInt(year))
            .filter((show) => rating === "" || show.rating >= parseFloat(rating))
            .sort((a, b) => {
                if (sortBy === "popularity") {
                    return b.popularity - a.popularity;
                } else if (sortBy === "rating") {
                    return b.rating - a.rating;
                }
                return 0;
            });
    };

    const filteredShows = filterShows(shows);

    return (
        <div className="showsPage">
            <NavBar/>
            <div className="showContainer">
                <h1>Shows</h1>
                <ComponentNavbar
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    genre={genre}
                    setGenre={setGenre}
                    year={year}
                    setYear={setYear}
                    rating={rating}
                    setRating={setRating}
                />
                <div className="showContainerContent">
                    {filteredShows.map((show, id) => (
                        <ColListItem
                            key={id}
                            name={show.name}
                            desc={show.description}
                            year={show.year}
                            img={show.poster}
                            ageRating={show.ageRating}
                            cost={show.cost}
                            rating={show.rating}
                            runtime={show.runtime}
                            genre={show.genre}
                        />
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Shows;
