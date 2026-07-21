const isLocalHost = () =>
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '';

export const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (isLocalHost()) return 'http://localhost:8080';
  return 'https://nmoviesapi.duckdns.org';
};

export const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes idle
export const ABSOLUTE_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 hours max
export const WARNING_BEFORE_MS = 2 * 60 * 1000; // warn 2 min before expiry
