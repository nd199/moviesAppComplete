import React, {useState} from "react";
import "./ListItem.css";
import {Add, PlayArrow, ThumbDownOutlined, ThumbUpAltOutlined, VolumeOff, VolumeUp,} from "@mui/icons-material";
import {Link} from "react-router-dom";

const ListItem = ({
                      name,
                      desc,
                      year,
                      img,
                      ageRating,
                      cost,
                      rating,
                      runtime,
                      genre,
                  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const toggleAudio = () => {
        setIsMuted(!isMuted);
    };

    const formatRuntime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="li-media-container">
            <div
                className="li-listItem"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="top">
                    <div className="top-media">
                        {isHovered ? (
                            <div className="trailer">
                                <video className="li-video" autoPlay loop muted={isMuted}>
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
                                className="li-img"
                            />
                        )}
                    </div>
                </div>
                <div className="bottom">
                    <div className="li-infoBottom">
                        {isHovered ? (
                            <div className="hovered-info">
                                <div className="hovered-info-top">
                                    <div className="hovered-li-title">
                                        <h5>{name}</h5>
                                    </div>
                                    <div className="hovered-li-actions">
                                        <Link to="/vfs" className="hovered-li-action">
                                            <PlayArrow/>
                                        </Link>
                                        <div className="hovered-li-action">
                                            <Add/>
                                        </div>
                                        <div className="hovered-li-action">
                                            <ThumbUpAltOutlined/>
                                        </div>
                                        <div className="hovered-li-action">
                                            <ThumbDownOutlined/>
                                        </div>
                                    </div>
                                </div>
                                <div className="hovered-li-desc-container">
                                    <div className="hovered-li-description">
                                        <p>{desc}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="li-info">
                                <div className="li-description">
                                    <div className="li-desc-top">
                                        <div className="li-title">
                                            <h6>{name}</h6>
                                            <div className="age-rating">
                                                <p>{ageRating}</p>
                                            </div>
                                        </div>
                                        <div className="li-details">
                                            <p>{year}</p>
                                            <p>{formatRuntime(runtime?.substring(0, 3))}</p>
                                            <p>IMDB: {rating}⭐️/10</p>
                                        </div>
                                    </div>
                                    <div className="li-desc-bottom">
                                        <p>{desc}</p>
                                    </div>
                                    <div className="li-genre">
                                        {genre?.split(",").map((genre,id) => (
                                            <p key={id}>{genre}</p>
                                        ))}
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

export default ListItem;
