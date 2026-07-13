import { useEffect, useState, useMemo } from 'react';
import Lottie from 'react-lottie';
import { CheckOption } from './AnimationData';

const Fallback = ({ retryCount = 0, onRetry }) => {
  const maxRetries = 5;
  const canRetry = retryCount < maxRetries;
  const [statusIndex, setStatusIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);

  const statusMessages = useMemo(() => [
    'Initializing container...', 'Booting Spring context...',
    'Establishing database connection...', 'Finalizing startup sequence...'
  ], []);

  useEffect(() => {
    const t = setInterval(() => setStatusIndex(p => (p + 1) % statusMessages.length), 3000);
    return () => clearInterval(t);
  }, [statusMessages]);

  useEffect(() => {
    if (!autoRetryEnabled || !canRetry) return;
    const t = setInterval(() => {
      setTimeRemaining(p => {
        if (p <= 0) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 15000);
          setTimeout(() => onRetry ? onRetry() : window.location.reload(), delay);
          return 30;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [autoRetryEnabled, canRetry, retryCount, onRetry]);

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
      <div className="max-w-[500px] w-full text-center">
        <div className="w-48 h-48 mx-auto mb-6"><Lottie options={CheckOption} /></div>
        <h1 className="text-2xl font-bold text-white mb-4 m-0">Warming Up Backend Service</h1>
        <p className="text-[#8892b0] mb-2 m-0">The backend service is starting up on free-tier infrastructure.</p>
        <p className="text-brand-500 font-medium mb-2 m-0">{statusMessages[statusIndex]}</p>
        <p className="text-[#5a6380] text-sm mb-4 m-0">Estimated time: 3 min 0 sec</p>

        {canRetry && autoRetryEnabled && <p className="text-amber-400 text-sm mb-2 m-0">Auto-retry in: {timeRemaining}s</p>}
        {retryCount > 0 && <p className="text-[#5a6380] text-sm mb-4 m-0">Retry attempt {retryCount} of {maxRetries}</p>}

        {canRetry ? (
          <div className="flex flex-col items-center gap-4">
            <button onClick={() => { const d = Math.min(1000 * Math.pow(2, retryCount), 15000); setTimeout(() => onRetry ? onRetry() : window.location.reload(), d); }} className="btn-primary">Retry Now</button>
            <label className="flex items-center gap-2 text-sm text-[#8892b0]">
              <input type="checkbox" checked={autoRetryEnabled} onChange={(e) => setAutoRetryEnabled(e.target.checked)} className="accent-brand-500" />
              Auto-retry every 30 seconds
            </label>
            {autoRetryEnabled && <p className="text-[#5a6380] text-sm m-0">Attempting to reconnect automatically in {timeRemaining}s...</p>}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p className="text-[#8892b0] m-0">The service is still initializing. Please wait a moment and try again.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Try Again Later</button>
          </div>
        )}

        <div className="mt-8 text-left glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-2 m-0">While the service initializes, you can:</h3>
          <ul className="text-sm text-[#8892b0] list-disc pl-5 flex flex-col gap-1 m-0">
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
