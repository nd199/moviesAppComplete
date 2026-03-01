import React from 'react';
import './ServerConnection.css';
import { Player } from '@lottiefiles/react-lottie-player';
import { ServerConnectingOptions } from './AnimationData';

const ServerConnection = () => {
  const ESTIMATED_TIME = 170; // 2 minutes 50 seconds - estimated wait time for users

  return (
    <div className="sco-container">
      <div className="sco-content">
        <div className="sco-image">
          <Player
            autoplay
            loop
            src={ServerConnectingOptions.animationData}
            style={{ height: '300px', width: '300px' }}
          />
        </div>
        <div className="sco-BH">🚀 Warming Up Backend Service</div>
        <div className="sco-elapsed">
          Initializing... Estimated time: ~2 min 50 sec
        </div>
        <div className="sco-warming-details">
          <p className="sco-warming-main">
            The backend service is starting up on free-tier infrastructure.
          </p>
          <p className="sco-warming-sub">
            This may take up to 2 min 50 sec to spin up
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
