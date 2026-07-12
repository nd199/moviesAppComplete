import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";

const VideoPlayer = ({ className, videoId, isYouTube = false }) => {
  const [loaded, setLoaded] = useState(false);
  const src = isYouTube ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&rel=0&modestbranding=1` : `https://jumpshare.com/embed/${videoId}`;

  return (
    <div className={`${className} relative`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-950 z-10">
          <ThreeDots height="48" width="48" color="#7c3aed" />
        </div>
      )}
      <iframe src={src} frameBorder="0" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen loading="lazy" onLoad={() => setLoaded(true)} className="absolute inset-0 w-full h-full border-none" title="Video" />
    </div>
  );
};

export default VideoPlayer;
