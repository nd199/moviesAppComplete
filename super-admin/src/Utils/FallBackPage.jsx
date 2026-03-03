import React, { useState, useEffect } from 'react';
import './FallbackCheck.css';

const Fallback = ({ retryCount = 0, onRetry }) => {
  const maxRetries = 5;
  const canRetry = retryCount < maxRetries;

  const [timeRemaining, setTimeRemaining] = useState(30);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);

  useEffect(() => {
    if (!autoRetryEnabled || !canRetry) return;

    const countdownTimer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up, trigger retry
          const delay = Math.min(1000 * Math.pow(2, retryCount), 15000);
          setTimeout(() => {
            if (onRetry) {
              onRetry();
            } else {
              window.location.reload();
            }
          }, delay);
          return 30; // Reset for next retry cycle
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [autoRetryEnabled, canRetry, retryCount, onRetry]);

  return (
    <div className="fallback-container">
      <div className="fallback-content">
        <div className="fallback-content-inner">
          <div className="fallback-main">
            <div className="fallback-image">
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            </div>
            <h1 className="fallback-content-title">🚀 Super Admin Service Unavailable</h1>
            <p className="fallback-content-text">
              The super admin service is currently down or experiencing issues.
            </p>

            {canRetry && autoRetryEnabled && (
              <p className="fallback-countdown">
                Auto-retry in: {timeRemaining}s
              </p>
            )}

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
                <div className="fallback-auto-retry-controls">
                  <label className="fallback-auto-retry-toggle">
                    <input
                      type="checkbox"
                      checked={autoRetryEnabled}
                      onChange={(e) => setAutoRetryEnabled(e.target.checked)}
                    />
                    Auto-retry every 30 seconds
                  </label>
                  {autoRetryEnabled && (
                    <p className="fallback-auto-retry">
                      Attempting to reconnect automatically in {timeRemaining}s...
                    </p>
                  )}
                </div>
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
