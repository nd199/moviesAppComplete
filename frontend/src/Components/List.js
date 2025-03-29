import React, {useEffect} from "react";
import "./List.css";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperCore from "swiper";
import {Navigation, Pagination} from "swiper/modules";
import ListItem from "./ListItem";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchMovies, fetchShows} from "../Network/ApiCalls";

SwiperCore.use([Navigation, Pagination]);

const List = ({title}) => {
    const dispatch = useDispatch();
    const movies = useSelector((state) => state?.product?.movies);
    const shows = useSelector((state) => state?.product?.shows);

    useEffect(() => {
        fetchMovies(dispatch);
        fetchShows(dispatch);
    }, [dispatch]);

    const getViewAllLink = (title) => (title === "Movies" ? "/movies" : title === "Shows" ? "/shows" : "#");

    return (
        <div className="list-full">
            <div className="list-wrap">
                <span className="listTitle-full">
                    <h1 className="lf-title">{title}</h1>
                    <h5 style={{color: "#fff", fontSize: "17px"}}>
                        <Link to={getViewAllLink(title)} style={{textDecoration: "none", color: "inherit"}}>
                            VIEW ALL...
                        </Link>
                    </h5>
                </span>

                <Swiper
                    key={movies?.length || shows?.length}
                    modules={[Navigation, Pagination]}
                    spaceBetween={10}
                    slidesPerView={4}
                    navigation
                    pagination={{clickable: true}}
                    breakpoints={{
                        1240: {slidesPerView: 4},
                        1024: {slidesPerView: 3},
                        768: {slidesPerView: 2},
                        480: {slidesPerView: 1},
                        320: {slidesPerView: 1},
                    }}
                >
                    {title === "Movies" &&
                        movies?.map((movie, id) => (
                            <SwiperSlide key={id}>
                                <ListItem
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
                            </SwiperSlide>
                        ))}
                    {title === "Shows" &&
                        shows?.map((show, id) => (
                            <SwiperSlide key={id}>
                                <ListItem
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
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
        </div>
    );
};

export default List;
