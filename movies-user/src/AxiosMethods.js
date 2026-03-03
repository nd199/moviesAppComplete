import axios from "axios";
import Cookies from "js-cookie";

const isLocal = () => {
  return window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '';
};

const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL && !isLocal()) {
    return `${process.env.REACT_APP_API_URL}/api/v1`;
  }
  return "http://localhost:8080/api/v1";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
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
      console.warn('API endpoint not found, redirecting to home');
      window.location.href = '/';
    } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
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
    timeout: 30000,
  });
};
export const passResetRequest = () => {
  const baseURL = isLocal() ? "http://localhost:8080/api/password-reset" : `${process.env.REACT_APP_API_URL}/password-reset`;
  return axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 30000,
  });
};
export const publicRequest = () => api;
export const paymentRequest = () => {
  const baseURL = isLocal() ? "http://localhost:8080/api/v1/payments" : `${process.env.REACT_APP_API_URL}/api/v1/payments`;
  return axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 30000,
  });
};
export const springRequest = () => {
  const baseURL = isLocal() ? "http://localhost:8080" : process.env.REACT_APP_API_URL;
  return axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 30000,
  });
};

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

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),

  register: (userData) => api.post('/auth/register', userData),

  logout: () => api.post('/auth/logout'),

  getCurrentUser: () => api.get('/customers/currentUser'),

  updateProfile: (userData) => api.put('/customers/profile', userData),

  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),

  requestPasswordReset: (email) => passResetRequest().post('/request', { email }),

  resetPassword: (token, newPassword) => passResetRequest().post('/reset', { token, newPassword }),
};

export const subscriptionAPI = {
  getSubscriptionPlans: () => api.get('/subscription/plans'),

  getCurrentSubscription: () => api.get('/subscription/current'),

  createPaymentIntent: (planId) => api.post('/subscription/intent/', { planId }),

  getSubscriptionIntent: (token) => api.get(`/subscription/intent/${token}`),

  cancelSubscription: () => api.delete('/subscription/cancel'),

  getSubscriptionHistory: () => api.get('/subscription/history'),
};

export const paymentAPI = {
  submitPayment: (paymentData) => paymentRequest().post('/submitPayment', paymentData),

  getPaymentHistory: () => api.get('/payments/history'),

  getPaymentById: (id) => api.get(`/payments/${id}`),

  refundPayment: (paymentId) => api.post(`/payments/${paymentId}/refund`),
};

export const streamingAPI = {
  getMovieStreamUrl: (movieId) => api.get(`/streaming/movie/${movieId}`),

  getShowStreamUrl: (showId, season, episode) => api.get(`/streaming/show/${showId}/season/${season}/episode/${episode}`),

  updateWatchProgress: (contentId, progress) => api.post('/streaming/progress', { contentId, progress }),

  getWatchHistory: () => api.get('/streaming/history'),

  addToWatchlist: (contentId, contentType) => api.post('/streaming/watchlist', { contentId, contentType }),

  removeFromWatchlist: (contentId) => api.delete(`/streaming/watchlist/${contentId}`),

  getWatchlist: () => api.get('/streaming/watchlist'),
};

export const userPreferencesAPI = {
  getPreferences: () => api.get('/preferences'),

  updatePreferences: (preferences) => api.put('/preferences', preferences),

  addToFavorites: (contentId, contentType) => api.post('/favorites', { contentId, contentType }),

  removeFromFavorites: (contentId) => api.delete(`/favorites/${contentId}`),

  getFavorites: () => api.get('/favorites'),

  rateContent: (contentId, rating, contentType) => api.post('/ratings', { contentId, rating, contentType }),

  getUserRatings: () => api.get('/ratings'),
};

export const searchAPI = {
  search: (query, filters = {}) => api.get('/search', { params: { q: query, ...filters } }),

  searchMovies: (query) => api.get('/search/movies', { params: { q: query } }),

  searchShows: (query) => api.get('/search/shows', { params: { q: query } }),

  searchByGenre: (genre) => api.get('/search/genre', { params: { genre } }),

  getTrending: () => api.get('/trending'),

  getPopular: () => api.get('/popular'),

  getRecentlyAdded: () => api.get('/recent'),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),

  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),

  markAllAsRead: () => api.put('/notifications/read-all'),

  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),

  getNotificationSettings: () => api.get('/notifications/settings'),

  updateNotificationSettings: (settings) => api.put('/notifications/settings', settings),
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
