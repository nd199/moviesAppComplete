import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1",
  withCredentials: true, // Important for httpOnly cookies
  timeout: 10000, // Add timeout for better error handling
});

// Request interceptor - add security headers
api.interceptors.request.use(
  (config) => {
    // Get JWT token from cookies
    const token = Cookies.get("jwt_token");
    
    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add other security headers
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    // Token will be set automatically via httpOnly cookie from backend
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export const userRequest = () => api;
export const authRequest = () => axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1",
  withCredentials: true,
  timeout: 10000,
});
export const passResetRequest = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api/password-reset",
  withCredentials: true,
  timeout: 10000,
});
export const publicRequest = () => api;
export const paymentRequest = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1/payments",
  withCredentials: true,
  timeout: 10000,
});
export const springRequest = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  withCredentials: true,
  timeout: 10000,
});
