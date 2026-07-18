import axios from 'axios';
import { store } from './redux/store';
import { logout } from './redux/userSlice';
import { installMockInterceptor } from './mockInterceptor';

// ============================================
// MOCK MODE - will be installed after all instances are created
// ============================================

const isMockMode = process.env.REACT_APP_MOCK_MODE === 'true';

// ============================================
// CONFIGURATION
// ============================================

const getBaseUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:8080';
};

const getApiBaseUrl = () => `${getBaseUrl()}/api/v1`;

// ============================================
// TOKEN MANAGEMENT
// ============================================

const getAccessToken = () => {
  try {
    // Check localStorage first (most reliable)
    const localToken = localStorage.getItem('accessToken');
    if (localToken) return localToken;
    
    // Fallback to Redux store
    const state = store.getState();
    return state?.user?.accessToken || null;
  } catch (e) {
    console.error('Error getting access token:', e);
    return null;
  }
};

const getRefreshToken = () => {
  try {
    return localStorage.getItem('refreshToken');
  } catch (e) {
    console.error('Error getting refresh token:', e);
    return null;
  }
};

const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const setTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

// ============================================
// AUTHENTICATED API INSTANCE
// ============================================

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Request interceptor - add auth token
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

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        store.dispatch(logout());
        return Promise.reject(error);
      }
      
      try {
        const response = await axios.post(`${getApiBaseUrl()}/auth/refresh-token`, {
          refreshToken,
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        setTokens(accessToken, newRefreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// PUBLIC API INSTANCE (No Auth)
// ============================================

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
    // Log public API errors but don't redirect
    if (error.response?.status === 401) {
      console.warn('Public API auth error (expected for some endpoints)');
    }
    return Promise.reject(error);
  }
);

// ============================================
// PASSWORD RESET API INSTANCE
// ============================================

const passResetApi = axios.create({
  baseURL: `${getBaseUrl()}/api/password-reset`,
  timeout: 30000,
  withCredentials: true,
});

// ============================================
// PAYMENT API INSTANCE
// ============================================

const paymentApi = axios.create({
  baseURL: `${getApiBaseUrl()}/payments`,
  timeout: 30000,
  withCredentials: true,
});

// ============================================
// SPRING API INSTANCE
// ============================================

const springApi = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  withCredentials: true,
});

// ============================================
// MOCK MODE - install interceptors on all instances
// ============================================

if (isMockMode) {
  [api, publicApi, passResetApi, paymentApi, springApi].forEach((instance) => {
    installMockInterceptor(instance);
  });
  console.log('[MOCK MODE] All API requests will return sample data. No backend required.');
}

// ============================================
// EXPORTS
// ============================================

export { api as default, publicApi, passResetApi, paymentApi, springApi, clearTokens, setTokens };

// Request helpers
export const userRequest = () => api;
export const publicRequest = () => publicApi;
export const authRequest = () => api;
export const passResetRequest = () => passResetApi;
export const paymentRequest = () => paymentApi;
export const springRequest = () => springApi;

// ============================================
// API METHODS
// ============================================

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/profile/current'),
  updateProfile: (userData) => api.put('/profile/current', userData),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
  requestPasswordReset: (email) => passResetApi.post('/request', { email }),
  resetPassword: (token, newPassword) => passResetApi.post('/reset', { token, newPassword }),
};

// Movie API
export const movieAPI = {
  getAllMovies: () => api.get('/movies'),
  getMovieById: (id) => api.get(`/movies/${id}`),
  getMoviesByCategory: (category) => api.get(`/movies/category/${category}`),
  getMoviesByCategoryByRating: (category) => api.get(`/movies/category/${category}/rating`),
  getMoviesByCategoryByNewest: (category) => api.get(`/movies/category/${category}/newest`),
  getMovieCategories: () => api.get('/movies/categories'),
  getMoviesSortedByCategoryAsc: () => api.get('/movies/sort/category/asc'),
  getMoviesSortedByCategoryDesc: () => api.get('/movies/sort/category/desc'),
  searchMovies: (query) => api.get(`/movies/search?q=${query}`),
};

// Show API
export const showAPI = {
  getAllShows: () => api.get('/shows'),
  getShowById: (id) => api.get(`/shows/${id}`),
  getShowsByCategory: (category) => api.get(`/shows/category/${category}`),
  getShowsByCategoryByRating: (category) => api.get(`/shows/category/${category}/rating`),
  getShowsByCategoryByNewest: (category) => api.get(`/shows/category/${category}/newest`),
  getShowCategories: () => api.get('/shows/categories'),
  getShowsSortedByCategoryAsc: () => api.get('/shows/sort/category/asc'),
  getShowsSortedByCategoryDesc: () => api.get('/shows/sort/category/desc'),
  searchShows: (query) => api.get(`/shows/search?q=${query}`),
};

// Subscription API
export const subscriptionAPI = {
  getSubscriptionPlans: () => api.get('/subscription/plans'),
  getCurrentSubscription: () => api.get('/subscription/current'),
  createPaymentIntent: (planId) => api.post('/subscription/intent/', { planId }),
  getSubscriptionIntent: (token) => api.get(`/subscription/intent/${token}`),
  cancelSubscription: () => api.delete('/subscription/cancel'),
  getSubscriptionHistory: () => api.get('/subscription/history'),
};

// Payment API
export const paymentAPI = {
  submitPayment: (paymentData) => paymentApi.post('/submitPayment', paymentData),
  getPaymentHistory: () => api.get('/payments/history'),
  getPaymentById: (id) => api.get(`/payments/${id}`),
  refundPayment: (paymentId) => api.post(`/payments/${paymentId}/refund`),
};

// Streaming API
export const streamingAPI = {
  getMovieStreamUrl: (movieId) => api.get(`/streaming/movie/${movieId}`),
  getShowStreamUrl: (showId, season, episode) => 
    api.get(`/streaming/show/${showId}/season/${season}/episode/${episode}`),
  updateWatchProgress: (contentId, progress) => 
    api.post('/streaming/progress', { contentId, progress }),
  getWatchHistory: () => api.get('/streaming/history'),
  addToWatchlist: (contentId, contentType) => 
    api.post('/streaming/watchlist', { contentId, contentType }),
  removeFromWatchlist: (contentId) => 
    api.delete(`/streaming/watchlist/${contentId}`),
  getWatchlist: () => api.get('/streaming/watchlist'),
};

// User Preferences API
export const userPreferencesAPI = {
  getPreferences: () => api.get('/preferences'),
  updatePreferences: (preferences) => api.put('/preferences', preferences),
  addToFavorites: (contentId, contentType) => 
    api.post('/favorites', { contentId, contentType }),
  removeFromFavorites: (contentId) => api.delete(`/favorites/${contentId}`),
  getFavorites: () => api.get('/favorites'),
  rateContent: (contentId, rating, contentType) => 
    api.post('/ratings', { contentId, rating, contentType }),
  getUserRatings: () => api.get('/ratings'),
};

// Search API
export const searchAPI = {
  search: (query, filters = {}) => 
    api.get('/search', { params: { q: query, ...filters } }),
  searchMovies: (query) => api.get('/search/movies', { params: { q: query } }),
  searchShows: (query) => api.get('/search/shows', { params: { q: query } }),
  searchByGenre: (genre) => api.get('/search/genre', { params: { genre } }),
  getTrending: () => api.get('/trending'),
  getPopular: () => api.get('/popular'),
  getRecentlyAdded: () => api.get('/recent'),
};

// Notification API
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
  getNotificationSettings: () => api.get('/notifications/settings'),
  updateNotificationSettings: (settings) => api.put('/notifications/settings', settings),
};

// Watchlist API
export const watchlistAPI = {
  addToWatchlist: (watchlistData) => api.post('/watchlist', watchlistData),
  getWatchlist: () => api.get('/watchlist'),
  getWatchlistPaginated: (page = 0, size = 20) => api.get('/watchlist/paginated', { params: { page, size } }),
  removeFromWatchlist: (tmdbId, mediaType) => api.delete(`/watchlist/${tmdbId}/${mediaType}`),
  checkInWatchlist: (tmdbId, mediaType) => api.get(`/watchlist/check/${tmdbId}/${mediaType}`),
  getWatchlistCount: () => api.get('/watchlist/count'),
};

// Admin API
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
