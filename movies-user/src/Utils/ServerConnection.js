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
        <div className="sco-BH">🚀 Warming Up Backend Service</div>
        <div className="sco-elapsed">
          Initializing... {elapsed}s
        </div>
        <div className="sco-warming-details">
          <p className="sco-warming-main">
            The backend service is starting up on free-tier infrastructure.
          </p>
          <p className="sco-warming-sub">
            This may take up to some seconds to spin up
          </p>
          <p className="sco-note">
            <strong>Note:</strong> Initial warm-up typically takes 20–40 seconds on first access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerConnection;
