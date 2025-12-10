import { AddToQueueOutlined, PlayArrowOutlined } from "@mui/icons-material";
import { useState } from "react";
import "./Featured.css";
import VideoComponent from "./VideoComponent";

const Featured = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [more, setMore] = useState(false);

  const toggleAudioHandler = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="featured">
      <div className="sliderWrapper">
        <div className="video">
          <VideoComponent className="videoFeature" />
        </div>

        <div className="info">
          <div className="info-top">
            <h1>John Wick 4 (2023)</h1>
            {more && (
              <button
                style={{
                  width: "15px",
                  height: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setMore(!more)}
              >
                X
              </button>
            )}
          </div>

          <span className="desc">
            An action-packed thriller that follows the legendary hitman John
            Wick (Keanu Reeves) as he continues his relentless quest for
            freedom. With the bounty on his head ever-increasing, Wick faces his
            most formidable foes yet, traveling from New York to Paris, Osaka,
            and Berlin...
            {more && (
              <span>
                John Wick: Chapter 4 follows the legendary assassin John Wick
                (Keanu Reeves) as he uncovers a path to defeating the High Table
                once and for all. But before he can earn his freedom, Wick must
                face off against a new enemy — the powerful Marquis de Gramont —
                who commands global alliances and forces old friends to turn
                against him. The film takes Wick across breathtaking locations
                from New York, Paris, Osaka, and Berlin, each packed with
                stylized, intense combat sequences. Director Chad Stahelski
                elevates the franchise with larger-than-life choreography,
                stunning cinematography, and a deep emotional core as John
                Wick’s past and pain come full circle. Fueled by vengeance,
                loyalty, and sheer willpower, Wick embarks on his most dangerous
                mission yet — one final fight for peace, freedom, and
                redemption.
              </span>
            )}
            <span>
              {!more && (
                <button
                  onClick={() => setMore(true)}
                  style={{
                    color: "orange",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  More...
                </button>
              )}
            </span>
          </span>

          <div className="buttons">
            <button className="watchBtn">
              <PlayArrowOutlined />
              <p className="btns-text">Watch</p>
            </button>
            <button className="watchListBtn">
              <AddToQueueOutlined />
              <p className="btns-text">
                <span className="sm-screen">Add to</span> WatchList
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
