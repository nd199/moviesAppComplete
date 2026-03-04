import api from './api';

export const contentManagerApi = {
  // Authentication
  login: async (credentials) => {
    const response = await api.post('/content-manager/login', credentials);
    const { accessToken, refreshToken, user } = response.data;
    
    // Store tokens
    const { setAccessToken, setRefreshToken } = await import('../authStore');
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    
    return response.data;
  },

  register: async (contentManagerData) => {
    const response = await api.post('/content-manager/register', contentManagerData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/content-manager/logout');
    return response.data;
  },

  // Content Manager CRUD
  getContentManagerById: async (id) => {
    const response = await api.get(`/content-manager/${id}`);
    return response.data;
  },

  getContentManagerByEmail: async (email) => {
    const response = await api.get(`/content-manager/email/${email}`);
    return response.data;
  },

  getAllContentManagers: async () => {
    const response = await api.get('/content-manager');
    return response.data;
  },

  updateContentManager: async (id, updateData) => {
    const response = await api.put(`/content-manager/${id}`, updateData);
    return response.data;
  },

  deleteContentManager: async (id) => {
    const response = await api.delete(`/content-manager/${id}`);
    return response.data;
  },

  toggleContentManagerStatus: async (id) => {
    const response = await api.post(`/content-manager/${id}/toggle-status`);
    return response.data;
  },

  // Movie Management
  addMovie: async (contentManagerId, movieData) => {
    const response = await api.post(`/content-manager/${contentManagerId}/movies`, movieData);
    return response.data;
  },

  updateMovie: async (contentManagerId, movieId, movieData) => {
    const response = await api.put(`/content-manager/${contentManagerId}/movies/${movieId}`, movieData);
    return response.data;
  },

  deleteMovie: async (contentManagerId, movieId) => {
    const response = await api.delete(`/content-manager/${contentManagerId}/movies/${movieId}`);
    return response.data;
  },

  getMoviesByContentManager: async (contentManagerId) => {
    const response = await api.get(`/content-manager/${contentManagerId}/movies`);
    return response.data;
  },

  // Show Management
  addShow: async (contentManagerId, showData) => {
    const response = await api.post(`/content-manager/${contentManagerId}/shows`, showData);
    return response.data;
  },

  updateShow: async (contentManagerId, showId, showData) => {
    const response = await api.put(`/content-manager/${contentManagerId}/shows/${showId}`, showData);
    return response.data;
  },

  deleteShow: async (contentManagerId, showId) => {
    const response = await api.delete(`/content-manager/${contentManagerId}/shows/${showId}`);
    return response.data;
  },

  getShowsByContentManager: async (contentManagerId) => {
    const response = await api.get(`/content-manager/${contentManagerId}/shows`);
    return response.data;
  },

  // Analytics
  getContentManagerAnalytics: async (contentManagerId) => {
    const response = await api.get(`/content-manager/${contentManagerId}/analytics`);
    return response.data;
  },

  getActiveContentManagers: async () => {
    const response = await api.get('/content-manager/active');
    return response.data;
  }
};
