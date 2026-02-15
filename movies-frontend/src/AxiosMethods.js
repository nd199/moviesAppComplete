import axios from "axios";
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

// Enhanced cookie configuration
const cookieOptions = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.REACT_APP_COOKIE_SAME_SITE || 'lax',
  httpOnly: false // Set to true if backend handles httpOnly cookies
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1",
  withCredentials: true, // Important for httpOnly cookies
  timeout: 10000, // Add timeout for better error handling
});

// Request interceptor - add token from cookies
api.interceptors.request.use(
  (config) => {
    const token = cookies.get('jwt_token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add security headers
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
      // Clear all auth-related cookies
      cookies.remove('jwt_token', { ...cookieOptions });
      cookies.remove('refresh_token', { ...cookieOptions });
      cookies.remove('user_session', { ...cookieOptions });
      
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
export const authRequest = () => api;
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
