/**
 * Auth Store - Token management with localStorage persistence
 * This module handles JWT token storage and retrieval independently of Redux
 */

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Initialize token from localStorage on load
let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

/**
 * Set access token in both memory and localStorage
 * @param {string|null} token - The access token to store
 */
export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

/**
 * Get current access token from memory
 * @returns {string|null} The access token
 */
export const getAccessToken = () => accessToken;

/**
 * Get refresh token from localStorage
 * @returns {string|null} The refresh token
 */
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

/**
 * Set refresh token in localStorage
 * @param {string|null} token - The refresh token to store
 */
export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

/**
 * Clear all authentication tokens
 * Used on logout or when tokens become invalid
 */
export const clearAuth = () => {
  accessToken = null;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Check if user has any authentication tokens
 * @returns {boolean} True if tokens exist
 */
export const hasTokens = () => {
  return !!(accessToken || localStorage.getItem(REFRESH_TOKEN_KEY));
};

/**
 * Set both access and refresh tokens
 * @param {string} newAccessToken - The new access token
 * @param {string} newRefreshToken - The new refresh token
 */
export const setTokens = (newAccessToken, newRefreshToken) => {
  setAccessToken(newAccessToken);
  setRefreshToken(newRefreshToken);
};

export default {
  setAccessToken,
  getAccessToken,
  getRefreshToken,
  setRefreshToken,
  clearAuth,
  hasTokens,
  setTokens,
};
