import axios from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearAuth } from '../authStore';

const isLocal = () =>
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '';

const getBaseURL = () =>
  import.meta.env.VITE_API_URL && !isLocal()
    ? `${import.meta.env.VITE_API_URL}/api/v1`
    : 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    config.headers = config.headers || {};
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
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
        return Promise.reject(error);
      }
      try {
        const res = await axios.post(`${getBaseURL()}/auth/refresh-token`, {
          refreshToken,
        });
        const newAccessToken = res.data.accessToken;
        if (res.data.refreshToken) {
          localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        setAccessToken(newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        clearAuth();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
