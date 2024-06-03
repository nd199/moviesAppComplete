import React, {useRef, useState} from "react";
import "./List.css";
import {ArrowBackIosNewOutlined, ArrowForwardIosOutlined,} from "@mui/icons-material";
import ListItem from "./ListItem";

const List = () => {
    const listRef = useRef();
    const [rightClicked, setRightClicked] = useState(false);
    const [slideNum, setSlideNum] = useState(0);

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

    return (
        <div className="list-full">
            <div className="list-wrap">
        <span className="listTitle-full">
          <h1 className="lf-title">Continue Watching</h1>
          <h5 style={{color: "#fff", fontSize: "17px"}}>View All...</h5>
        </span>
                <div className="wrapper-full">
                    <div className="left-full">
                        <ArrowBackIosNewOutlined
                            className="sliderArrow left-icon"
                            onClick={() => handleClick("left")}
                            style={{display: !rightClicked && "none"}}
                        />
                    </div>
                    <div className="mv-listContainer-full" ref={listRef}>
                        <ListItem/>
                        <ListItem/>
                        <ListItem/>
                        <ListItem/>
                        <ListItem/>
                        <ListItem/>
                        <ListItem/>
                        <ListItem/>
                        <ListItem/>
                        <ListItem/>
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
