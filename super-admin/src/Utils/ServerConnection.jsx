import React, { useState, useEffect } from 'react';
import './ServerConnection.css';

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
    // Import and show Fallback component when timer expires
    import('./FallBackPage.jsx').then(module => {
      const Fallback = module.default;
      // This will be handled by the parent component
    });
  }

  return (
    <div className="sco-container">
      <div className="sco-content">
        <div className="sco-image">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
        <div className="sco-BH">🚀 Warming Up Super Admin Service</div>
        <div className="sco-elapsed">
          Initializing... Time remaining: {formatTime(timeRemaining)}
        </div>

        <div className="sco-warming-details">
          <p className="sco-warming-main">
            The super admin service is starting up on free-tier infrastructure.
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
