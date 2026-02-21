import { CircularProgress, Backdrop } from "@mui/material";
import "./GlobalLoader.css";

const GlobalLoader = ({ open = true, message = "Loading..." }) => {
  return (
    <Backdrop
      className="global-backdrop"
      open={open}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "rgba(2, 6, 23, 0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="global-loader-container">
        <div className="loader-ring">
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: "#f97316",
              animation: "pulse 1.5s ease-in-out infinite",
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
          />
        </div>
        <p className="loader-message">{message}</p>
      </div>
    </Backdrop>
  );
};

// Skeleton Loader Component for Movie Lists
export const MovieListSkeleton = ({ count = 5 }) => {
  return (
    <div className="skeleton-container">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-link"></div>
      </div>
      <div className="skeleton-grid">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-info">
              <div className="skeleton-title-text"></div>
              <div className="skeleton-meta"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton for Featured Section
export const FeaturedSkeleton = () => {
  return (
    <div className="featured-skeleton">
      <div className="featured-skeleton-grid">
        <div className="featured-skeleton-video">
          <div className="skeleton-image"></div>
        </div>
        <div className="featured-skeleton-info">
          <div className="skeleton-tag"></div>
          <div className="skeleton-title-large"></div>
          <div className="skeleton-meta-row">
            <div className="skeleton-meta-item"></div>
            <div className="skeleton-meta-item"></div>
            <div className="skeleton-meta-item"></div>
          </div>
          <div className="skeleton-desc"></div>
          <div className="skeleton-desc-short"></div>
          <div className="skeleton-buttons">
            <div className="skeleton-button"></div>
            <div className="skeleton-button-outline"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
