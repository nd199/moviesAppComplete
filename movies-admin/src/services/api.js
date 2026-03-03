import axios from 'axios';

const isLocal = () => {
  return window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '';
};

const getBaseURL = () => {
  const raw = import.meta.env.VITE_API_URL;
  if (raw && !isLocal()) {
    const trimmed = String(raw).replace(/\/+$/, '');
    return trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`;
  }
  return 'http://localhost:8080/api/v1';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
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
      // Do not force redirect during invite set-password flow; show the real error on screen.
      if (window.location.pathname.startsWith('/set-password')) {
        return Promise.reject(error);
      }
      if (window.location.pathname.includes('/contentManager')) {
        window.location.href = '/contentManagerLogin';
      } else {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('jwt_token');
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
