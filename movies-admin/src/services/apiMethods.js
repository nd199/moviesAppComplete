import axios from "axios";
import Cookies from "js-cookie";

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
  withCredentials: true,
  timeout: 30000,
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
    }
    return Promise.reject(error);
  }
);

export default api;
export const adminRequest = () => api;
export const authRequest = () => {
  return axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    timeout: 30000,
  });
};
export const publicRequest = () => api;
export const showRequest = () => {
  return axios.create({
    baseURL: `${getBaseURL()}/api/v1/shows`,
    withCredentials: true,
    timeout: 30000,
  });
};
export const contentManagerRequest = () => {
  return axios.create({
    baseURL: `${getBaseURL()}/api/v1/content-managers`,
    withCredentials: true,
    timeout: 30000,
  });
};
