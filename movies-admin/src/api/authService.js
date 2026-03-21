import api from './api';
import { setAccessToken, setRefreshToken, clearAuth } from '../authStore';

export const authService = {
  // Login for content managers
  contentManagerLogin: async (credentials) => {
    const response = await api.post('/auth/content-manager-login', credentials);
    const { accessToken, refreshToken, user } = response.data;
    
    // Store tokens
    setAccessToken(accessToken);
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
    
    return response.data;
  },

  // Get current admin
  getCurrentAdmin: async () => {
    const response = await api.get('/customers/currentAdmin');
    return response.data;
  },

  // Get current content manager
  getCurrentContentManager: async () => {
    const response = await api.get('/customers/currentContentManager');
    return response.data;
  },

  // Register new user
  register: async (userData) => {
    const response = await api.post('/customers/register', userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh-token');
    const { accessToken, refreshToken } = response.data;
    
    setAccessToken(accessToken);
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
    
    return response.data;
  },

  // Check authentication status
  checkAuthStatus: async () => {
    try {
      const response = await api.get('/auth/status');
      return response.data;
    } catch (error) {
      return { authenticated: false };
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/customers/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  },

  // Reset password request
  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  }
};

export default authService;
