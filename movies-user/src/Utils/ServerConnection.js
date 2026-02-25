import React, { useEffect, useState } from 'react';
import './ServerConnection.css';
import Lottie from 'react-lottie';
import { ServerConnectingOptions } from './AnimationData';

const ServerConnection = () => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sco-container">
      <div className="sco-content">
        <div className="sco-image">
          <Lottie options={ServerConnectingOptions} />
        </div>
        <div className="sco-BH">Checking Backend Health...</div>
        <div className="sco-elapsed">
          Warming up... {elapsed}s
        </div>
        <p className="sco-text">
          <strong>Note:</strong> This application is hosted on free-tier infrastructure. The backend may require an initial warm-up (20–40 seconds) on first access.
        </p>
      </div>
    </div>
  );
};

export default ServerConnection;
