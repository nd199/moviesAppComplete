import { ArrowBack } from "@mui/icons-material";
import { Link, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchTmdbMovieDetails } from "../../Network/ApiCalls";
import "./VideoFullScreen.css";

const VideoFullScreen = () => {
  const { id } = useParams();
  const location = useLocation();
  const [videoSrc, setVideoSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [movieTitle, setMovieTitle] = useState("");
  
  // Debug logging
  console.log('[VideoFullScreen] id:', id);
  console.log('[VideoFullScreen] location.state:', location.state);
  console.log('[VideoFullScreen] trailerFromState:', location.state?.trailer);

  // Get trailer from location state (passed from ColListItem)
  const trailerFromState = location.state?.trailer;
  
  useEffect(() => {
    const fetchTrailer = async () => {
      setLoading(true);
      
      // If we have a trailer from state, use it
      if (trailerFromState) {
        setVideoSrc(trailerFromState);
        setMovieTitle(id);
        setLoading(false);
        return;
      }
      
      // Otherwise, fetch movie details by name
      if (id) {
        const movieDetails = await fetchTmdbMovieDetails(id);
        
        if (movieDetails?.trailer) {
          setVideoSrc(movieDetails.trailer);
          setMovieTitle(movieDetails.title || movieDetails.name || id);
        } else {
          setVideoSrc("https://videos.pexels.com/video-files/4782220/4782220-hd_1280_720_30fps.mp4");
          setMovieTitle(id);
        }
      }
      
      setLoading(false);
    };
    
    fetchTrailer();
  }, [id, trailerFromState]);
  
  // Convert YouTube URL to embed format if needed
  let finalVideoSrc = videoSrc;
  if (videoSrc && videoSrc.includes('youtube.com')) {
    // Convert YouTube watch URL to embed URL with autoplay
    const videoId = videoSrc.split('v=')[1]?.split('&')[0];
    if (videoId) {
      finalVideoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0`;
    }
  }
  
  if (loading) {
    return (
      <div className="videoFS">
        <div className="video-nav">
          <Link to={"/"} className="video-back-btn">
            <ArrowBack />
            <span>Back to Home</span>
          </Link>
        </div>
        <div className="video-loading">
          <div className="loading-spinner"></div>
          <p>Loading trailer...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="videoFS">
      <div className="video-nav">
        <Link to={"/"} className="video-back-btn">
          <ArrowBack />
          <span>Back to Home</span>
        </Link>
        <div className="video-title">
          <h1>{movieTitle}</h1>
        </div>
      </div>
      
      <div className="video-container">
        {finalVideoSrc.includes('youtube.com/embed') ? (
          <iframe
            src={finalVideoSrc}
            className="video-player"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            frameBorder="0"
            title="Movie Trailer"
          />
        ) : (
          <video
            src={finalVideoSrc}
            autoPlay
            controls
            className="video-player"
            title="Movie Trailer"
          ></video>
        )}
      </div>
      
      <div className="video-overlay">
        <div className="video-gradient"></div>
      </div>
    </div>
  );
};

export default VideoFullScreen;
