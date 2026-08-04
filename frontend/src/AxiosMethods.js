import axios from 'axios';
import { store, persistor } from './redux/store';
import { logout } from './redux/userSlice';
import { getAccessToken, getRefreshToken, setTokens, clearAuth } from './authStore';

const isLocalHost = () =>
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const getBaseUrl = () => {
  if (isLocalHost()) return process.env.REACT_APP_API_URL || 'http://localhost:8081';
  return process.env.REACT_APP_API_URL || 'https://nmoviesapi.duckdns.org';
};

const getApiBaseUrl = () => `${getBaseUrl()}/api/v1`;

let refreshPromise = null;

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuth();
        store.dispatch(logout());
        persistor.purge();
        return Promise.reject(error);
      }

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const response = await axios.post(`${getApiBaseUrl()}/auth/refresh-token`, {
              refreshToken,
            });
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            setTokens(accessToken, newRefreshToken);
            return { accessToken, newRefreshToken };
          } catch (refreshError) {
            console.warn('Token refresh failed, clearing auth');
            clearAuth();
            store.dispatch(logout());
            persistor.purge();
            throw refreshError;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      try {
        const { accessToken } = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const publicApi = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Public API auth error (expected for some endpoints) on', error.config.url);
    }
    return Promise.reject(error);
  }
);

const passResetApi = axios.create({
  baseURL: `${getBaseUrl()}/api/password-reset`,
  timeout: 30000,
  withCredentials: true,
});

const paymentApi = axios.create({
  baseURL: `${getBaseUrl()}/payments`,
  timeout: 30000,
  withCredentials: true,
});

if (isLocalHost()) {
  publicApi.interceptors.request.use((config) => {
    if (config.url && config.url.startsWith('/tmdb/')) {
      config.url = config.url.replace('/tmdb/', '/local/');
    }
    return config;
  });
}

export { api as default, publicApi, passResetApi, paymentApi };

export const userRequest = () => api;
export const publicRequest = () => publicApi;
export const passResetRequest = () => passResetApi;
export const paymentRequest = () => paymentApi;

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

export const watchlistAPI = {
  addToWatchlist: (watchlistData) => api.post('/watchlist', watchlistData),
  getWatchlist: () => api.get('/watchlist'),
  getWatchlistPaginated: (page = 0, size = 20) => api.get('/watchlist/paginated', { params: { page, size } }),
  removeFromWatchlist: (tmdbId, mediaType) => api.delete(`/watchlist/${tmdbId}/${mediaType}`),
  checkInWatchlist: (tmdbId, mediaType) => api.get(`/watchlist/check/${tmdbId}/${mediaType}`),
  getWatchlistCount: () => api.get('/watchlist/count'),
};

export const likesAPI = {
  setReaction: (reactionData) => api.post('/likes', reactionData),
  clearReaction: (tmdbId, mediaType) => api.delete(`/likes/${tmdbId}/${mediaType}`),
  getLikes: () => api.get('/likes'),
  getLikesPaginated: (page = 0, size = 20) => api.get('/likes/paginated', { params: { page, size } }),
  getDislikes: () => api.get('/likes/disliked'),
  getDislikesPaginated: (page = 0, size = 20) => api.get('/likes/disliked/paginated', { params: { page, size } }),
  checkReaction: (tmdbId, mediaType) => api.get(`/likes/check/${tmdbId}/${mediaType}`),
  getLikeCount: () => api.get('/likes/count'),
  getTotalReactions: (tmdbId, mediaType) => api.get(`/likes/total/${tmdbId}/${mediaType}`),
};

export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getAllMovies: () => api.get('/admin/movies'),
  createMovie: (movieData) => api.post('/admin/movies', movieData),
  updateMovie: (movieId, movieData) => api.put(`/admin/movies/${movieId}`, movieData),
  deleteMovie: (movieId) => api.delete(`/admin/movies/${movieId}`),
  getAnalytics: () => api.get('/admin/analytics'),
  getUserStats: () => api.get('/admin/stats/users'),
  getContentStats: () => api.get('/admin/stats/content'),
};
