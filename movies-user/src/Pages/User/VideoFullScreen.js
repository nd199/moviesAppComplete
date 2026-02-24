import { ExitToAppOutlined } from "@mui/icons-material";
import { Link, useParams, useSearchParams } from "react-router-dom";
import "./VideoFullScreen.css";

const VideoFullScreen = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const trailer = searchParams.get('trailer');
  
  // Check if the id parameter is actually a trailer URL
  const isTrailerUrl = id && (id.includes('youtube.com') || id.includes('http'));
  
  // Convert YouTube URL to embed format if needed
  let videoSrc = isTrailerUrl ? id : (trailer || "https://videos.pexels.com/video-files/4782220/4782220-hd_1280_720_30fps.mp4");
  
  if (isTrailerUrl && id.includes('youtube.com')) {
    // Convert YouTube watch URL to embed URL with autoplay
    const videoId = id.split('v=')[1]?.split('&')[0];
    if (videoId) {
      videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0`;
    }
  }
  
  console.log('VideoFullScreen - Component loaded with ID:', id);
  console.log('VideoFullScreen - Is trailer URL:', isTrailerUrl);
  console.log('VideoFullScreen - Trailer from query:', trailer);
  console.log('VideoFullScreen - Final video source:', videoSrc);
  
  return (
    <div className="videoFS">
      <div className="back">
        <Link to={"/"}>
          <ExitToAppOutlined />
          Home
        </Link>
      </div>
      <div className="video-info">
        <p>Playing {isTrailerUrl ? 'trailer' : `video ID: ${id}`}</p>
      </div>
      <video
        src={videoSrc}
        autoPlay
        controls
        progress
        className="vfs"
      ></video>
    </div>
  );
};

export default VideoFullScreen;
