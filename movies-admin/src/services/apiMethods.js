import axios from "axios";
import { getAccessToken } from '../authStore';

// Detect if running locally
const isLocal = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' || 
         window.location.hostname === '';
};

const getBaseURL = () => {
  // If VITE_API_URL is set AND we're not local, use it
  if (import.meta.env.VITE_API_URL && !isLocal()) {
    return `${import.meta.env.VITE_API_URL}`;
  }
  // Default to localhost for local development
  return "http://localhost:8080";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    // Get token from authStore
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    }
    return Promise.reject(error);
  }
);

export default api;
export const adminRequest = () => api;
export const authRequest = () => {
  return axios.create({
    baseURL: getBaseURL(),
    timeout: 30000,
  });
};
export const publicRequest = () => api;
export const showRequest = () => {
  return axios.create({
    baseURL: `${getBaseURL()}/api/v1/shows`,
    timeout: 30000,
  });
};
export const contentManagerRequest = () => {
  return axios.create({
    baseURL: `${getBaseURL()}/api/v1/content-managers`,
    timeout: 30000,
  });
};
