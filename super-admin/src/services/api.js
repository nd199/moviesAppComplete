import axios from "axios";

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
  
  if (import.meta.env.VITE_API_URL && !isLocalHost) {
    console.log('🔍 Debug - Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return `${import.meta.env.VITE_API_URL}`;
  }
  if (!isLocalHost) {
    console.log('🔍 Debug - Using production backend: https://movieticket-api.onrender.com');
    return "https://movieticket-api.onrender.com";
  }
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
      if (window.location.pathname !== '/super-admin/login' && !error.code === 'ERR_NETWORK') {
        window.location.href = '/super-admin/login';
      }
    } else if (error.response?.status === 404) {
      console.warn('API endpoint not found, redirecting to home');
      if (window.location.pathname !== '/super-admin/login') {
        window.location.href = '/super-admin/login';
      }
    } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.warn('Network error detected, health check should handle this');
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  login: (credentials) => api.post('/api/v1/auth/login', credentials),
  logout: () => api.post('/api/v1/auth/logout'),
  checkAuth: () => api.get('/api/v1/customers/currentUser'),
};

export const adminAPI = {
  inviteAdmin: (adminData) => api.post('/system/superadmin/invite', adminData),
};
