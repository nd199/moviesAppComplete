import axios from 'axios';
import { getAccessToken, setAccessToken, getRefreshToken, clearAuth } from '../authStore';

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
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Do not force redirect during invite set-password flow; show the real error on screen.
      if (window.location.pathname.startsWith('/set-password')) {
        return Promise.reject(error);
      }

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearAuth();
        if (window.location.pathname.includes('/contentManager')) {
          window.location.href = '/contentManagerLogin';
        } else {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${getBaseURL()}/auth/refresh-token`, {
          refreshToken
        });

        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);

        // Update refresh token if rotation is enabled
        if (res.data.refreshToken) {
          localStorage.setItem("refreshToken", res.data.refreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        clearAuth();
        if (window.location.pathname.includes('/contentManager')) {
          window.location.href = '/contentManagerLogin';
        } else {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 404) {
      console.warn('API endpoint not found, redirecting to home');
      window.location.href = '/';
    } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.warn('Network error detected, health check should handle this');
    }
    return Promise.reject(error);
  }
);

export default api;