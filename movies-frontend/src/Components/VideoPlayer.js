import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";

const VideoPlayer = ({ className, videoId = "X27pvZBu1ykSt5rHtmZA" }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={className}>
      {!isLoaded && (
        <div className="video-loader">
          <ThreeDots height="60" width="60" color="#ffffff" />
        </div>
      )}

      <iframe
        id={`featured-video-${videoId}`}
        src={`https://jumpshare.com/embed/${videoId}`}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
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
