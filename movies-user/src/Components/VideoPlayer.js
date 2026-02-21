import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";

const VideoPlayer = ({ className, videoId, isYouTube = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine the correct embed URL based on whether it's a YouTube video
  const embedUrl = isYouTube 
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`
    : `https://jumpshare.com/embed/${videoId}`;

  return (
    <div className={className}>
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
