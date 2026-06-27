/**
 * Auth Store - Token management with in-memory storage
 * This module handles JWT token storage and retrieval independently of Redux
 * Tokens are primarily stored via HTTP-only cookies for security
 */

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Initialize token from memory
let accessToken = null;
let refreshToken = null;

/**
 * Set access token in memory
 * @param {string|null} token - The access token to store
 */
export const setAccessToken = (token) => {
  accessToken = token;
};

/**
 * Get current access token from memory
 * @returns {string|null} The access token
 */
export const getAccessToken = () => accessToken;

/**
 * Get refresh token from memory
 * @returns {string|null} The refresh token
 */
export const getRefreshToken = () => refreshToken;

/**
 * Set refresh token in memory
 * @param {string|null} token - The refresh token to store
 */
export const setRefreshToken = (token) => {
  refreshToken = token;
};

/**
 * Clear all authentication tokens from memory
 * Used on logout or when tokens become invalid
 */
export const clearAuth = () => {
  accessToken = null;
  refreshToken = null;
};

/**
 * Check if user has any authentication tokens
 * @returns {boolean} True if tokens exist
 */
export const hasTokens = () => {
  return !!(accessToken || refreshToken);
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
