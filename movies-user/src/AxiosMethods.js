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
