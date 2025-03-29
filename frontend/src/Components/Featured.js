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
    const [more, setMore] = useState(false);

    const toggleAudioHandler = () => {
        setIsMuted(!isMuted);
    };

    const handleLoadedData = () => {
        setIsLoading(false);
    };

    return (
        <div className="featured">
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
                    <div className="info-top">
                        <h1>John Wick 4 (2023)</h1>
                        {more && <button
                            style={{
                                width: "15px",
                                height: "15px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                            onClick={() => setMore(!more)}>X
                        </button>}
                    </div>
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
                    {more && <span className="desc-more">
                              An action-packed thriller that follows the legendary hitman John
                              Wick (Keanu Reeves) as he continues his relentless quest for
                              freedom. With the bounty on his head ever-increasing, Wick faces
                              his most formidable foes yet, traveling from New York to Paris,
                              Osaka, and Berlin. The film features intense combat sequences,
                              stunning choreography, and an exploration of the deep underworld
                              of assassins. Directed by Chad Stahelski, this installment expands
                              the franchise's mythology and delivers exhilarating action and
                              suspense.
                        </span>}
                    {!more && <span className="short-desc" style={{display: "none"}}>
                            An action-packed thriller that follows the legendary hitman John
                            Wick (Keanu Reeves) as he continues his relentless quest for
                            freedom. <button onClick={() => setMore(true)}>More...</button>
                        </span>}
                    <div className="buttons">
                        <button className="watchBtn">
                            <PlayArrowOutlined/>
                            <p className="btns-text">Watch</p>
                        </button>
                        <button className="watchListBtn">
                            <AddToQueueOutlined/>
                            <p className="btns-text"><span className="sm-screen">Add to</span> WatchList</p>
                        </button>
                        <button className="audioBtn"
                                onClick={() => toggleAudioHandler()}>
                            {isMuted ? <VolumeOff/> : <VolumeUp/>}
                            {isMuted ? <p className="btns-text">UnMute</p> :
                                <p className="btns-text">Mute</p>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Featured;
