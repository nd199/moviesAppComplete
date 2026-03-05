import axios from "axios";
import { getAccessToken, setAccessToken, getRefreshToken, clearAuth } from "../authStore";

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
  timeout: 30000,
  withCredentials: true,
});

// Request interceptor - add Authorization header
api.interceptors.request.use(
  (config) => {
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

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearAuth();
        if (window.location.pathname !== '/super-admin/login' && error.code !== 'ERR_NETWORK') {
          window.location.href = '/super-admin/login';
        }
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${getBaseURL()}/api/v1/auth/refresh-token`, {
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
        if (window.location.pathname !== '/super-admin/login') {
          window.location.href = '/super-admin/login';
        }
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 404) {
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
  login: async (credentials) => {
    console.log("🔐 authAPI.login called with credentials:", { email: credentials.email });
    const response = await api.post('/api/v1/auth/login', credentials);
    console.log("📡 Backend response received:", {
      status: response.status,
      hasData: !!response.data,
      hasAccessToken: !!response.data?.accessToken,
      hasRefreshToken: !!response.data?.refreshToken,
      hasUser: !!response.data?.user,
      userType: response.data?.userType
    });

    const { accessToken, refreshToken, user } = response.data;
    console.log("🔑 Extracted tokens:", {
      accessTokenLength: accessToken?.length || 0,
      refreshTokenLength: refreshToken?.length || 0,
      hasUser: !!user
    });

    console.log("💾 Storing tokens...");
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    console.log("✅ Tokens stored. Current state:", {
      accessTokenStored: !!getAccessToken(),
      refreshTokenStored: !!getRefreshToken()
    });

    return response.data;
  },
  logout: async () => {
    try {
      const refreshToken = getRefreshToken();
      await api.post('/api/v1/auth/logout', refreshToken ? { refreshToken } : {});
    } catch (error) {
      console.error('Logout error:', error);
    }
    clearAuth();
  },
  checkAuth: () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      return Promise.reject(new Error('No access token'));
    }
    return Promise.resolve({ success: true });
  },
};

export const adminAPI = {
  inviteAdmin: (adminData) => api.post('/api/v1/system/superadmin/invite', adminData),
};
