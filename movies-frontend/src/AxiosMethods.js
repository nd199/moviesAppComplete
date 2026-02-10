import axios from "axios";
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  withCredentials: true, // Important for httpOnly cookies
});

// Request interceptor - add token from cookies
api.interceptors.request.use(
  (config) => {
    const token = cookies.get('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
      // Clear cookies and redirect to login
      cookies.remove('jwt_token', { path: '/' });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
