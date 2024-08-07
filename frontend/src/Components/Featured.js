import React, {useState} from "react";
import "./Featured.css";
import VideoComponent from "./VideoComponent";
import {AddToQueueOutlined, PlayArrowOutlined, VolumeOff, VolumeUp,} from "@mui/icons-material";
import {ThreeDots} from "react-loader-spinner";

const filepath =
    "gs://moviesite-5ed22.appspot.com/4K HDR _ Trailer - John Wick 4 _ Dolby 5.1 (1080p).mp4";

const Featured = () => {
    const [isMuted, setIsMuted] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const toggleAudioHandler = () => {
        setIsMuted(!isMuted);
    };

    const handleLoadedData = () => {
        setIsLoading(false);
    };

    return (
        <div className="featured">
            <div className="slider-container">
                <div className="sliderWrapper">
                    <div className="video">
                        {isLoading && (
                            <div className="loader">
                                <ThreeDots color="#fff" height={80} width={80}/>
                            </div>
                        )}
                        <VideoComponent
                            className="videoFeature"
                            filePath={filepath}
                            isMuted={isMuted}
                            onLoadedData={handleLoadedData}
                        />
                    </div>
                    <div className="info">
                        <h1>John Wick 4 (2023)</h1>
                        <span className="desc">
              An action-packed thriller that follows the legendary hitman John
              Wick (Keanu Reeves) as he continues his relentless quest for
              freedom. With the bounty on his head ever-increasing, Wick faces
              his most formidable foes yet, traveling from New York to Paris,
              Osaka, and Berlin. The film features intense combat sequences,
              stunning choreography, and an exploration of the deep underworld
              of assassins. Directed by Chad Stahelski, this installment expands
              the franchise's mythology and delivers exhilarating action and
              suspense.
            </span>
                        <div className="buttons">
                            <button className="watchBtn">
                                <PlayArrowOutlined/>
                                Watch
                            </button>
                            <button className="watchListBtn">
                                <AddToQueueOutlined/>
                                Add to WatchList
                            </button>
                            <button className="audioBtn" onClick={() => toggleAudioHandler()}>
                                {isMuted ? <VolumeOff/> : <VolumeUp/>}
                                {isMuted ? "UnMute" : "Mute"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Featured;
