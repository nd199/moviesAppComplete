import axios from 'axios';

// Detect if running locally
const isLocal = () => {
  return window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '';
};

const getBaseURL = () => {
  // If VITE_API_URL is set AND we're not local, use it
  if (import.meta.env.VITE_API_URL && !isLocal()) {
    return `${import.meta.env.VITE_API_URL}/api/v1`;
  }
  // Default to localhost for local development
  return "http://localhost:8080/api/v1";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  withCredentials: true, // Important for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // For content managers, cookies are handled automatically by browser
    // No need to manually add Authorization header for cookie-based auth
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if this is a content manager session by checking current path
      if (window.location.pathname.includes('/contentManager')) {
        window.location.href = '/contentManagerLogin';
      } else {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUser');
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
