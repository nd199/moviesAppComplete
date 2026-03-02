import axios from "axios";

// Detect if running locally
const isLocal = () => {
  return window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '';
};

const getBaseURL = () => {
  const hostname = window.location.hostname;
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
  
  console.log('🔍 Debug - Hostname:', hostname);
  console.log('🔍 Debug - Is Local:', isLocalHost);
  console.log('🔍 Debug - VITE_API_URL:', import.meta.env.VITE_API_URL);
  
  // If VITE_API_URL is set AND we're not local, use it
  if (import.meta.env.VITE_API_URL && !isLocalHost) {
    console.log('🔍 Debug - Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return `${import.meta.env.VITE_API_URL}`;
  }
  // If we're in production but no env var, use production backend
  if (!isLocalHost) {
    console.log('🔍 Debug - Using production backend: https://movieticket-api.onrender.com');
    return "https://movieticket-api.onrender.com";
  }
  // Default to localhost for local development
  console.log('🔍 Debug - Using localhost: http://localhost:8080');
  return "http://localhost:8080";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
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
      if (window.location.pathname !== '/super-admin/login') {
        window.location.href = '/super-admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API methods
export const authAPI = {
  login: (credentials) => api.post('/api/v1/auth/login', credentials),
  logout: () => api.post('/api/v1/auth/logout'),
  // Add other auth methods as needed
};

// Admin API methods
export const adminAPI = {
  inviteAdmin: (adminData) => api.post('/system/superadmin/invite', adminData),
  // Add other admin methods as needed
};
