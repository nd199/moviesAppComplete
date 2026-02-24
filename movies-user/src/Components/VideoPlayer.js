import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";

const VideoPlayer = ({ className, videoId, isYouTube = false, isBackground = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine the correct embed URL based on whether it's a YouTube video
  // For background mode, we add loop and playlist for continuous playback
  // Show controls for featured background video
  const embedUrl = isYouTube 
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3`
    : `https://jumpshare.com/embed/${videoId}`;

  return (
    <div className={`${className} ${isBackground ? 'video-background' : ''}`}>
      {!isLoaded && (
        <div className="video-loader">
          <ThreeDots height="60" width="60" color="#ffffff" />
        </div>
      )}

      <iframe
        id={`featured-video-${videoId}`}
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className="video-iframe"
        title="Featured Video"
      />
    </div>
  );
};

export default VideoPlayer;
