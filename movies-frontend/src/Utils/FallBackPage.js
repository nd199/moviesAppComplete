import React from 'react';
import './FallbackCheck.css';
import Lottie from 'react-lottie';
import { CheckOption } from './AnimationData';

const Fallback = ({ retryCount = 0, onRetry }) => {
  const maxRetries = 5;
  const canRetry = retryCount < maxRetries;

  return (
    <div className="fallback-container">
      <div className="fallback-content">
        <div className="fallback-image">
          <Lottie options={CheckOption} />
        </div>
        <h1 className="fallback-content-title">⚠️ Service Unavailable</h1>
        <p className="fallback-content-text">
          Our backend services are currently unavailable. We're working to restore service as quickly as possible.
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
              onClick={onRetry || (() => window.location.reload())}>
              Retry Now
            </button>
            <p className="fallback-auto-retry">
              Auto-retrying in 10 seconds...
            </p>
          </div>
        ) : (
          <div className="fallback-max-retries">
            <p className="fallback-max-text">
              Maximum retry attempts reached. Please check back later.
            </p>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}>
              Try Again Later
            </button>
          </div>
        )}
        
        <div className="fallback-help">
          <h3>While you wait, you can:</h3>
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
