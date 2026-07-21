const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const getAccessToken = () => accessToken;

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const clearAuth = () => {
  accessToken = null;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const hasTokens = () => {
  return !!(accessToken || localStorage.getItem(REFRESH_TOKEN_KEY));
};

export const setTokens = (newAccessToken, newRefreshToken) => {
  setAccessToken(newAccessToken);
  setRefreshToken(newRefreshToken);
};

const authStore = {
  setAccessToken,
  getAccessToken,
  getRefreshToken,
  setRefreshToken,
  clearAuth,
  hasTokens,
  setTokens,
};

export default authStore;
