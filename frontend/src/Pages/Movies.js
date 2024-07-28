import React, {useEffect, useState} from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import "./Movies.css";
import ComponentNavbar from "../Components/ComponentNavbar";
import ColListItem from "../Components/Col-ListItem";
import {useDispatch, useSelector} from "react-redux";
import {fetchMovies} from "../Network/ApiCalls";

const Movies = () => {
    const dispatch = useDispatch();
    const movies = useSelector((state) => state?.product?.movies);

    const [sortBy, setSortBy] = useState("popularity");
    const [searchQuery, setSearchQuery] = useState("");
    const [genre, setGenre] = useState("");
    const [year, setYear] = useState("");
    const [rating, setRating] = useState("");

    useEffect(() => {
        fetchMovies(dispatch);
    }, [dispatch]);

    const filterMovies = (movies) => {
        return movies
            .filter(
                (movie) =>
                    searchQuery === "" ||
                    movie.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .filter((movie) => genre === "" || movie.genre.includes(genre))
            .filter((movie) => year === "" || movie.year === parseInt(year))
            .filter((movie) => rating === "" || movie.rating >= parseFloat(rating))
            .sort((a, b) => {
                if (sortBy === "popularity") {
                    return b.popularity - a.popularity;
                } else if (sortBy === "rating") {
                    return b.rating - a.rating;
                }
                return 0;
            });
    };

    const filteredMovies = filterMovies(movies);

    return (
        <div className="moviesPage">
            <NavBar/>
            <div className="movieContainer">
                <h1>Movies</h1>
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
                <div className="movieContainerContent">
                    {filteredMovies.map((movie, id) => (
                        <ColListItem
                            key={id}
                            name={movie.name}
                            desc={movie.description}
                            year={movie.year}
                            img={movie.poster}
                            ageRating={movie.ageRating}
                            cost={movie.cost}
                            rating={movie.rating}
                            runtime={movie.runtime}
                            genre={movie.genre}
                        />
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Movies;
