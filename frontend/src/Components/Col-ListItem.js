import React, {useState} from "react";
import "./Col-ListItem.css";
import {Add, PlayArrow, ThumbDownOutlined, ThumbUpAltOutlined, VolumeOff, VolumeUp,} from "@mui/icons-material";
import {Link} from "react-router-dom";

const ColListItem = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const toggleAudio = () => {
        setIsMuted(!isMuted);
    };

    return (
        <div className="col-li-media-container">
            <div
                className="col-li-listItem"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="col-top">
                    <div className="col-top-media">
                        {isHovered ? (
                            <div className="trailer">
                                <video className="col-li-video" autoPlay loop muted={isMuted}>
                                    <source
                                        src="https://www.w3schools.com/html/mov_bbb.mp4"
                                        type="video/mp4"
                                    />
                                </video>
                                <p className="trailer-p">Trailer</p>
                                <button className="audio-toggle-button" onClick={toggleAudio}>
                                    {isMuted ? <VolumeOff/> : <VolumeUp/>}
                                </button>
                            </div>
                        ) : (
                            <img
                                src="https://c4.wallpaperflare.com/wallpaper/123/991/646/avatar-blue-skin-james-cameron-s-movie-avatar-movie-poster-wallpaper-preview.jpg"
                                alt="Avatar Movie Poster"
                                className="col-li-img"
                            />
                        )}
                    </div>
                </div>
                <div className="col-bottom">
                    <div className="col-li-infoBottom">
                        {isHovered ? (
                            <div className="hovered-col-info">
                                <div className="hovered-col-info-top">
                                    <div className="hovered-col-li-title">
                                        <h3>Avatar</h3>
                                    </div>
                                    <div className="hovered-col-li-actions">
                                        <Link to="/vfs" className="hovered-col-li-action">
                                            <PlayArrow/>
                                        </Link>
                                        <div className="hovered-col-li-action">
                                            <Add/>
                                        </div>
                                        <div className="hovered-col-li-action">
                                            <ThumbUpAltOutlined/>
                                        </div>
                                        <div className="hovered-col-li-action">
                                            <ThumbDownOutlined/>
                                        </div>
                                    </div>
                                </div>
                                <div className="hovered-col-li-desc-container">
                                    <div className="hovered-col-li-description">
                                        <p>
                                            Avatar is a 2009 American epic science fiction film
                                            directed, written, produced, and co-edited by James
                                            Cameron, and starring Sam Worthington and Zoe Saldana. Set
                                            in 2154, the plot follows Jake Sully, a paraplegic war
                                            veteran who replaces his deceased twin brother to
                                            participate in a mission to secure unobtanium, a mineral
                                            that gives unlimited sustainable energy.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="col-li-info">
                                <div className="col-li-description">
                                    <div className="col-li-desc-top">
                                        <div className="col-li-title">
                                            <h3>Avatar</h3>
                                            <div className="age-rating">
                                                <p>U/A 13+</p>
                                            </div>
                                        </div>
                                        <div className="col-li-details">
                                            <p>2009</p>
                                            <p>2h 42m</p>
                                            <p>IMDB: 8.0⭐️/10</p>
                                        </div>
                                    </div>
                                    <div className="col-li-desc-bottom">
                                        <p>
                                            Avatar is a 2009 American epic science fiction film
                                            directed, written, produced, and co-edited by James
                                            Cameron.
                                        </p>
                                    </div>
                                    <div className="col-li-genre">
                                        <p>Action</p>
                                        <p>Adventure</p>
                                        <p>Sci-Fi</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColListItem;
