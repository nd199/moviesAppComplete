import axios from "axios";
import Cookies from "js-cookie";

// Detect if running locally
const isLocal = () => {
  return window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '';
};

const getBaseURL = () => {
  // If REACT_APP_API_URL is set AND we're not local, use it
  if (process.env.REACT_APP_API_URL && !isLocal()) {
    return `${process.env.REACT_APP_API_URL}/api/v1`;
  }
  // Default to localhost for local development
  return "http://localhost:8080/api/v1";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 30000, // Increased from 10000 to 30000 for debugging
});

api.interceptors.request.use(
  (config) => {
    // Try to get token from js-cookie first (fallback for cookie issues)
    const token = Cookies.get('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // For HTTP-only cookies, we don't need to manually add the token
    // The browser will automatically include cookies with withCredentials: true
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 404) {
      // Handle 404 errors - redirect to home page
      console.warn('API endpoint not found, redirecting to home');
      window.location.href = '/';
    } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      // Handle network errors - these will be caught by the health check system
      console.warn('Network error detected, health check should handle this');
    }
    return Promise.reject(error);
  }
);

export default api;
export const userRequest = () => api;
export const authRequest = () => {
  return axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    timeout: 30000, // Increased timeout
  });
};
export const passResetRequest = () => {
  const baseURL = isLocal() ? "http://localhost:8080/api/password-reset" : `${process.env.REACT_APP_API_URL}/password-reset`;
  return axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 30000, // Increased timeout
  });
};
export const publicRequest = () => api;
export const paymentRequest = () => {
  const baseURL = isLocal() ? "http://localhost:8080/api/v1/payments" : `${process.env.REACT_APP_API_URL}/api/v1/payments`;
  return axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 30000, // Increased timeout
  });
};
export const springRequest = () => {
  const baseURL = isLocal() ? "http://localhost:8080" : process.env.REACT_APP_API_URL;
  return axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 30000, // Increased timeout
  });
};

// ==================== MOVIE API METHODS ====================

export const movieAPI = {
  // Get all movies
  getAllMovies: () => api.get('/movies'),

  // Get movie by ID
  getMovieById: (id) => api.get(`/movies/${id}`),

  // Get movies by category
  getMoviesByCategory: (category) => api.get(`/movies/category/${category}`),

  // Get movies by category ordered by rating
  getMoviesByCategoryByRating: (category) => api.get(`/movies/category/${category}/rating`),

  // Get movies by category ordered by newest
  getMoviesByCategoryByNewest: (category) => api.get(`/movies/category/${category}/newest`),

  // Get all movie categories
  getMovieCategories: () => api.get('/movies/categories'),

  // Sort movies by category ascending
  getMoviesSortedByCategoryAsc: () => api.get('/movies/sort/category/asc'),

  // Sort movies by category descending
  getMoviesSortedByCategoryDesc: () => api.get('/movies/sort/category/desc'),

  // Search movies (if implemented)
  searchMovies: (query) => api.get(`/movies/search?q=${query}`),
};

// ==================== SHOW API METHODS ====================

export const showAPI = {
  // Get all shows
  getAllShows: () => api.get('/shows'),

  // Get show by ID
  getShowById: (id) => api.get(`/shows/${id}`),

  // Get shows by category
  getShowsByCategory: (category) => api.get(`/shows/category/${category}`),

  // Get shows by category ordered by rating
  getShowsByCategoryByRating: (category) => api.get(`/shows/category/${category}/rating`),

  // Get shows by category ordered by newest
  getShowsByCategoryByNewest: (category) => api.get(`/shows/category/${category}/newest`),

  // Get all show categories
  getShowCategories: () => api.get('/shows/categories'),

  // Sort shows by category ascending
  getShowsSortedByCategoryAsc: () => api.get('/shows/sort/category/asc'),

  // Sort shows by category descending
  getShowsSortedByCategoryDesc: () => api.get('/shows/sort/category/desc'),

  // Search shows (if implemented)
  searchShows: (query) => api.get(`/shows/search?q=${query}`),
};

// ==================== AUTHENTICATION API METHODS ====================

export const authAPI = {
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),

  // Register user
  register: (userData) => api.post('/auth/register', userData),

  // Logout user
  logout: () => api.post('/auth/logout'),

  // Get current user profile
  getCurrentUser: () => api.get('/customers/currentUser'),

  // Update user profile
  updateProfile: (userData) => api.put('/customers/profile', userData),

  // Change password
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),

  // Request password reset
  requestPasswordReset: (email) => passResetRequest().post('/request', { email }),

  // Reset password with token
  resetPassword: (token, newPassword) => passResetRequest().post('/reset', { token, newPassword }),
};

// ==================== SUBSCRIPTION API METHODS ====================

export const subscriptionAPI = {
  // Get all subscription plans
  getSubscriptionPlans: () => api.get('/subscription/plans'),

  // Get current user's subscription
  getCurrentSubscription: () => api.get('/subscription/current'),

  // Create payment intent for subscription
  createPaymentIntent: (planId) => api.post('/subscription/intent/', { planId }),

  // Get subscription intent by token
  getSubscriptionIntent: (token) => api.get(`/subscription/intent/${token}`),

  // Cancel subscription
  cancelSubscription: () => api.delete('/subscription/cancel'),

  // Get subscription history
  getSubscriptionHistory: () => api.get('/subscription/history'),
};

// ==================== PAYMENT API METHODS ====================

export const paymentAPI = {
  // Submit payment
  submitPayment: (paymentData) => paymentRequest().post('/submitPayment', paymentData),

  // Get payment history
  getPaymentHistory: () => api.get('/payments/history'),

  // Get payment by ID
  getPaymentById: (id) => api.get(`/payments/${id}`),

  // Refund payment (if supported)
  refundPayment: (paymentId) => api.post(`/payments/${paymentId}/refund`),
};

// ==================== STREAMING API METHODS ====================

export const streamingAPI = {
  // Get streaming URL for movie
  getMovieStreamUrl: (movieId) => api.get(`/streaming/movie/${movieId}`),

  // Get streaming URL for show episode
  getShowStreamUrl: (showId, season, episode) => api.get(`/streaming/show/${showId}/season/${season}/episode/${episode}`),

  // Update watch progress
  updateWatchProgress: (contentId, progress) => api.post('/streaming/progress', { contentId, progress }),

  // Get watch history
  getWatchHistory: () => api.get('/streaming/history'),

  // Add to watchlist
  addToWatchlist: (contentId, contentType) => api.post('/streaming/watchlist', { contentId, contentType }),

  // Remove from watchlist
  removeFromWatchlist: (contentId) => api.delete(`/streaming/watchlist/${contentId}`),

  // Get user's watchlist
  getWatchlist: () => api.get('/streaming/watchlist'),
};

// ==================== USER PREFERENCES API METHODS ====================

export const userPreferencesAPI = {
  // Get user preferences
  getPreferences: () => api.get('/preferences'),

  // Update user preferences
  updatePreferences: (preferences) => api.put('/preferences', preferences),

  // Add to favorites
  addToFavorites: (contentId, contentType) => api.post('/favorites', { contentId, contentType }),

  // Remove from favorites
  removeFromFavorites: (contentId) => api.delete(`/favorites/${contentId}`),

  // Get favorites
  getFavorites: () => api.get('/favorites'),

  // Rate content
  rateContent: (contentId, rating, contentType) => api.post('/ratings', { contentId, rating, contentType }),

  // Get user's ratings
  getUserRatings: () => api.get('/ratings'),
};

// ==================== SEARCH API METHODS ====================

export const searchAPI = {
  // Global search
  search: (query, filters = {}) => api.get('/search', { params: { q: query, ...filters } }),

  // Search movies
  searchMovies: (query) => api.get('/search/movies', { params: { q: query } }),

  // Search shows
  searchShows: (query) => api.get('/search/shows', { params: { q: query } }),

  // Search by genre
  searchByGenre: (genre) => api.get('/search/genre', { params: { genre } }),

  // Get trending content
  getTrending: () => api.get('/trending'),

  // Get popular content
  getPopular: () => api.get('/popular'),

  // Get recently added
  getRecentlyAdded: () => api.get('/recent'),
};

// ==================== NOTIFICATION API METHODS ====================

export const notificationAPI = {
  // Get user notifications
  getNotifications: () => api.get('/notifications'),

  // Mark notification as read
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),

  // Mark all notifications as read
  markAllAsRead: () => api.put('/notifications/read-all'),

  // Delete notification
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),

  // Get notification settings
  getNotificationSettings: () => api.get('/notifications/settings'),

  // Update notification settings
  updateNotificationSettings: (settings) => api.put('/notifications/settings', settings),
};

// ==================== ADMIN/CONTENT MANAGER API METHODS ====================

export const adminAPI = {
  // User management (for admins)
  getAllUsers: () => api.get('/admin/users'),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),

  // Content management (for content managers)
  getAllMovies: () => api.get('/admin/movies'),
  createMovie: (movieData) => api.post('/admin/movies', movieData),
  updateMovie: (movieId, movieData) => api.put(`/admin/movies/${movieId}`, movieData),
  deleteMovie: (movieId) => api.delete(`/admin/movies/${movieId}`),

  // Analytics
  getAnalytics: () => api.get('/admin/analytics'),
  getUserStats: () => api.get('/admin/stats/users'),
  getContentStats: () => api.get('/admin/stats/content'),
};
