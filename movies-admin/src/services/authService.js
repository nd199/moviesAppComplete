import api from './api';
import { contentManagerApi } from './contentManagerApi';
import { setAccessToken, setRefreshToken, clearAuth, getRefreshToken } from '../authStore';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { accessToken, refreshToken, user } = response.data;
    
    // Store tokens
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    
    return response.data;
  },

  contentManagerLogin: async (credentials) => {
    const response = await contentManagerApi.login(credentials);
    const { accessToken, refreshToken, user } = response.data;
    
    // Store tokens
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    
    return response.data;
  },

  register: async (adminData) => {
    const response = await api.post('/auth/admins', adminData);
    return response.data;
  },

  getCurrentAdmin: async () => {
    const response = await api.get('/customers/currentUser');
    return response.data;
  },

  getCurrentContentManager: async () => {
    const response = await api.get('/content-manager/current');
    return response.data;
  },

  logout: async () => {
    try {
      const refreshToken = getRefreshToken();
      await api.post('/auth/logout', refreshToken ? { refreshToken } : {});
    } catch (error) {
      console.error('Logout error:', error);
    }
    clearAuth();
  },

  contentManagerLogout: async () => {
    try {
      const refreshToken = getRefreshToken();
      await contentManagerApi.logout();
    } catch (error) {
      console.error('Content manager logout error:', error);
    }
    clearAuth();
  },
};
