import React from "react";
import "./FallbackCheck.css";
import Lottie from "react-lottie";
import { CheckOption } from "./AnimationData";

const Fallback = () => {
  return (
    <div className="fallback-container">
      <div className="fallback-content">
        <div className="fallback-image">
          <Lottie options={CheckOption} />
        </div>
        <h1 className="fallback-content-title">⚠️ Service Unavailable</h1>
        <p className="fallback-content-text">It seems the server is down. Please try again later.</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default Fallback;
