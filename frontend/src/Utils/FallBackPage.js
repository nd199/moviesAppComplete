import { useEffect, useState, useMemo } from 'react';
import { Refresh, WifiOff } from '@mui/icons-material';

const Fallback = ({ retryCount = 0, onRetry }) => {
  const maxRetries = 5;
  const canRetry = retryCount < maxRetries;
  const [statusIndex, setStatusIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);

  const statusMessages = useMemo(() => [
    'Initializing container...',
    'Booting Spring context...',
    'Establishing database connection...',
    'Finalizing startup...'
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
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6 relative">
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-brand-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[440px] w-full text-center relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-6">
          <WifiOff sx={{ fontSize: 28, color: '#7c3aed' }} />
        </div>

        <h1 className="text-2xl font-bold text-white m-0 mb-2">Service Warming Up</h1>
        <p className="text-[#5a6380] text-sm m-0 mb-6">
          The backend is starting on free-tier infrastructure. This takes 2-3 minutes on first access.
        </p>

        <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-5 mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 text-sm font-medium">{statusMessages[statusIndex]}</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-1000"
              style={{ width: `${((30 - timeRemaining) / 30) * 100}%` }} />
          </div>
          <p className="text-[#3b4560] text-xs m-0 mt-2">Auto-retry in {timeRemaining}s</p>
        </div>

        {retryCount > 0 && (
          <p className="text-[#3b4560] text-xs m-0 mb-4">Attempt {retryCount} of {maxRetries}</p>
        )}

        <div className="flex flex-col gap-3">
          {canRetry ? (
            <>
              <button
                onClick={() => {
                  const d = Math.min(1000 * Math.pow(2, retryCount), 15000);
                  setTimeout(() => onRetry ? onRetry() : window.location.reload(), d);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-semibold border-none cursor-pointer hover:shadow-lg hover:shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Refresh sx={{ fontSize: 16 }} /> Retry Now
              </button>
              <label className="flex items-center justify-center gap-2 text-sm text-[#5a6380] cursor-pointer">
                <input type="checkbox" checked={autoRetryEnabled} onChange={(e) => setAutoRetryEnabled(e.target.checked)}
                  className="accent-brand-500 w-4 h-4" />
                Auto-retry every 30s
              </label>
            </>
          ) : (
            <>
              <p className="text-[#5a6380] text-sm m-0 mb-2">Service is still initializing. Please wait and try again.</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-semibold border-none cursor-pointer hover:shadow-lg hover:shadow-brand-500/25 transition-all"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fallback;
