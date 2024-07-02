import React, { useEffect, useRef, useState } from "react";
import "./List.css";
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import ListItem from "./ListItem";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies, fetchShows } from "../redux/ApiCalls";

const List = ({ title }) => {
  const listRef = useRef();
  const dispatch = useDispatch();
  const [rightClicked, setRightClicked] = useState(false);
  const [slideNum, setSlideNum] = useState(0);
  const movies = useSelector((state) => state?.product?.movies);
  const shows = useSelector((state) => state?.product?.shows);

  useEffect(() => {
    fetchMovies(dispatch);
    fetchShows(dispatch);
  }, [dispatch]);

  const handleClick = (direction) => {
    setRightClicked(true);
    const length = listRef.current.getBoundingClientRect().x - 65;

    if (direction === "left" && slideNum > 0) {
      setSlideNum(slideNum - 1);
      listRef.current.style.transform = `translateX(${300 + length}px)`;
    }
    if (direction === "right" && slideNum < 6) {
      setSlideNum(slideNum + 1);
      listRef.current.style.transform = `translateX(${-300 + length}px)`;
    }
  };

  const getViewAllLink = (title) => {
    if (title === "Movies") {
      return "/movies";
    } else if (title === "Shows") {
      return "/shows";
    }
    return "#";
  };

  return (
    <div className="list-full">
      <div className="list-wrap">
        <span className="listTitle-full">
          <h1 className="lf-title">{title}</h1>
          <h5 style={{ color: "#fff", fontSize: "17px" }}>
            <Link
              to={getViewAllLink(title)}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              View All...
            </Link>
          </h5>
        </span>
        <div className="wrapper-full">
          <div className="left-full">
            <ArrowBackIosNewOutlined
              className="sliderArrow left-icon"
              onClick={() => handleClick("left")}
              style={{ display: !rightClicked && "none" }}
            />
          </div>
          <div className="mv-listContainer-full" ref={listRef}>
            (
            {title === "Movies" &&
              movies.map((movie) => (
                <ListItem
                  key={movie}
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
            &&
            {title === "Shows" &&
              shows.map((show) => (
                <ListItem
                  key={show}
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
            )
          </div>
          <div className="right-full">
            <ArrowForwardIosOutlined
              className="sliderArrow right-icon"
              onClick={() => handleClick("right")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
