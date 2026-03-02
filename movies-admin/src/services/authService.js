import api from './api';
import { contentManagerApi } from './contentManagerApi';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  contentManagerLogin: async (credentials) => {
    const response = await contentManagerApi.login(credentials);
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
    await api.post('/auth/logout');
  },

  contentManagerLogout: async (token) => {
    await contentManagerApi.logout(token);
  },
};
