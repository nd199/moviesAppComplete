import React from "react";
import "./VideoFullScreen.css";
import { ExitToAppOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";

const VideoFullScreen = () => {
  return (
    <div className="videoFS">
      <div className="back">
        <Link to={"/"}>
          <ExitToAppOutlined />
          Home
        </Link>
      </div>
      <video
        src="https://videos.pexels.com/video-files/4782220/4782220-hd_1280_720_30fps.mp4"
        autoPlay
        controls
        progress
        className="vfs"
      ></video>
    </div>
  );
};

export default VideoFullScreen;
