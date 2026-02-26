import React, { useEffect, useState, useMemo } from 'react';
import './FallbackCheck.css';
import Lottie from 'react-lottie';
import { CheckOption } from './AnimationData';

const Fallback = ({ retryCount = 0, onRetry }) => {
  const maxRetries = 5;
  const canRetry = retryCount < maxRetries;

  const [elapsed, setElapsed] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = useMemo(() => [
    'Initializing container...',
    'Booting Spring context...',
    'Establishing database connection...',
    'Finalizing startup sequence...'
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const statusTimer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 3000);

    return () => clearInterval(statusTimer);
  }, [statusMessages]);

  return (
    <div className="fallback-container">
      <div className="fallback-content">
        <div className="fallback-image">
          <Lottie options={CheckOption} />
        </div>
        <h1 className="fallback-content-title">🚀 Warming Up Backend Service</h1>
        <p className="fallback-content-text">
          The backend service is starting up on free-tier infrastructure.
        </p>
        <p className="fallback-status-text">
          {statusMessages[statusIndex]}
        </p>
        <p className="fallback-elapsed">
          Elapsed time: {elapsed}s
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

        <div className="fallback-help">
          <h3>While the service initializes, you can:</h3>
          <ul>
            <li>Check your internet connection</li>
            <li>Try refreshing the page</li>
            <li>Contact support if the issue persists</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Fallback;
