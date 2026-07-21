let accessToken = null;
let refreshToken = null;
let csrfToken = null;
let sessionStartTime = null;
let lastActivityTime = null;

export const setAccessToken = (token) => { accessToken = token; };
export const getAccessToken = () => accessToken;

export const setRefreshToken = (token) => {
  refreshToken = token;
  sessionStartTime = Date.now();
  lastActivityTime = Date.now();
};
export const getRefreshToken = () => refreshToken;

export const clearAuth = () => {
  accessToken = null;
  refreshToken = null;
  csrfToken = null;
  sessionStartTime = null;
  lastActivityTime = null;
};

export const generateCsrfToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  csrfToken = Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  return csrfToken;
};
export const getCsrfToken = () => csrfToken;

export const getSessionStartTime = () => sessionStartTime;
export const updateActivity = () => { lastActivityTime = Date.now(); };
export const getLastActivityTime = () => lastActivityTime;
