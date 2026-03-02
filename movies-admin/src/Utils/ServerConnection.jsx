import React, { useState, useEffect } from 'react';
import './ServerConnection.css';
import { Player } from '@lottiefiles/react-lottie-player';
import { ServerConnectingOptions } from './AnimationData';
import Fallback from './FallBackPage.jsx';

const ServerConnection = () => {
  const ESTIMATED_TIME = 150;
  const [timeRemaining, setTimeRemaining] = useState(ESTIMATED_TIME);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setShowFallback(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  if (showFallback) {
    return <Fallback />;
  }

  return (
    <div className="sco-container">
      <div className="sco-content">
        <div className="sco-image">
          <Player
            autoplay
            loop
            src={ServerConnectingOptions.animationData}
            style={{ height: '280px', width: '280px' }}
          />
        </div>
        <div className="sco-BH">🚀 Warming Up Backend Service</div>
        <div className="sco-elapsed">
          Initializing... Time remaining: {formatTime(timeRemaining)}
        </div>

        <div className="sco-warming-details">
          <p className="sco-warming-main">
            The backend service is starting up on free-tier infrastructure.
          </p>
          <p className="sco-warming-sub">
            This may take up to 2 min 30 sec to spin up
          </p>
          <p className="sco-note">
            <strong>Note:</strong> Initial warm-up typically takes 2-3 minutes on first access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerConnection;
