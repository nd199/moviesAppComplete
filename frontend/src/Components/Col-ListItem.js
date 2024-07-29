import React, { useState } from "react";
import "./Col-ListItem.css";
import {
  Add,
  PlayArrow,
  ThumbDownOutlined,
  ThumbUpAltOutlined,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const ColListItem = ({
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
    return hours !== 0 ? `${hours}h ${mins}m` : `${mins}m`;
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
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </button>
              </div>
            ) : (
              <img
                src={
                  "https://c4.wallpaperflare.com/wallpaper/123/991/646/avatar-blue-skin-james-cameron-s-movie-avatar-movie-poster-wallpaper-preview.jpg"
                }
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
                    <h3>{name}</h3>
                  </div>
                  <div className="hovered-col-li-actions">
                    <Link to="/vfs" className="hovered-col-li-action">
                      <PlayArrow />
                    </Link>
                    <div className="hovered-col-li-action">
                      <Add />
                    </div>
                    <div className="hovered-col-li-action">
                      <ThumbUpAltOutlined />
                    </div>
                    <div className="hovered-col-li-action">
                      <ThumbDownOutlined />
                    </div>
                  </div>
                </div>
                <div className="hovered-col-li-desc-container">
                  <div className="hovered-col-li-description">
                    <p>{desc}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-li-info">
                <div className="col-li-description">
                  <div className="col-li-desc-top">
                    <div className="col-li-title">
                      <div>
                        <h3 className="li-title-h1">{name}</h3>
                      </div>
                      <div className="age-rating">
                        <p>{ageRating}</p>
                      </div>
                    </div>
                    <div className="col-li-details">
                      <p>{year}</p>
                      <p>{formatRuntime(runtime?.substring(0, 3))}</p>
                      <p>IMDB: {rating}⭐️/10</p>
                    </div>
                  </div>
                  <div className="col-li-desc-bottom">
                    <p>{desc}</p>
                  </div>
                  <div className="col-li-genre">
                    {genre?.split(",").map((genre, id) => (
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

export default ColListItem;
