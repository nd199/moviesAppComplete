import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
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

  logout: async () => {
    await api.post('/auth/logout');
  },
};
