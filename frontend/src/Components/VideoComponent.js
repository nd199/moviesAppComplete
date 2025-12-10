import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";

const VideoComponent = ({ className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {/* Loader until iframe loads */}
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            zIndex: 1,
          }}
        >
          <ThreeDots height="60" width="60" color="#fff" />
        </div>
      )}

      <iframe
        id="js_video_iframe"
        src="https://jumpshare.com/embed/X27pvZBu1ykSt5rHtmZA"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        allowFullScreen
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: "12px",
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
        title="Featured Video"
      ></iframe>
    </div>
  );
};

export default VideoComponent;
