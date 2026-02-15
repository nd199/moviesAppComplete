import { ExitToAppOutlined } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import "./VideoFullScreen.css";

const VideoFullScreen = () => {
  const { id } = useParams();
  
  return (
    <div className="videoFS">
      <div className="back">
        <Link to={"/"}>
          <ExitToAppOutlined />
          Home
        </Link>
      </div>
      <div className="video-info">
        <p>Playing video ID: {id}</p>
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
