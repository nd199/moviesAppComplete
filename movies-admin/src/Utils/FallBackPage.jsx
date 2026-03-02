import React from 'react';
import './FallbackCheck.css';
import { Player } from '@lottiefiles/react-lottie-player';
import { CheckOption } from './AnimationData';

const Fallback = ({ retryCount = 0, onRetry }) => {
  const maxRetries = 5;
  const canRetry = retryCount < maxRetries;

  return (
    <div className="fallback-container">
      <div className="fallback-content">
        <div className="fallback-content-inner">
          <div className="fallback-main">
            <div className="fallback-image">
              <Player
                autoplay
                loop
                src={CheckOption.animationData}
                style={{ height: '280px', width: '280px' }}
              />
            </div>
            <h1 className="fallback-content-title">🚀 Backend Service Unavailable</h1>
            <p className="fallback-content-text">
              The backend service is currently down or experiencing issues.
            </p>

            {retryCount > 0 && (
              <p className="fallback-retry-info">
                Retry attempt {retryCount} of {maxRetries}
              </p>
            )}

            {canRetry ? (
              <div className="fallback-actions">
                <button
                  className="retry-button"
                  onClick={() => {
                    const delay = Math.min(1000 * Math.pow(2, retryCount), 15000);
                    setTimeout(() => {
                      if (onRetry) {
                        onRetry();
                      } else {
                        window.location.reload();
                      }
                    }, delay);
                  }}>
                  Retry Now
                </button>
                <p className="fallback-auto-retry">
                  Attempting to reconnect automatically...
                </p>
              </div>
            ) : (
              <div className="fallback-max-retries">
                <p className="fallback-max-text">
                  The service is still initializing. Please wait a moment and try again.
                </p>
                <button
                  className="retry-button"
                  onClick={() => window.location.reload()}>
                  Try Again Later
                </button>
              </div>
            )}
          </div>

          <div className="fallback-help">
            <h3>While the service is unavailable, you can:</h3>
            <ul>
              <li>Check your internet connection</li>
              <li>Try refreshing the page</li>
              <li>Contact support if the issue persists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fallback;
