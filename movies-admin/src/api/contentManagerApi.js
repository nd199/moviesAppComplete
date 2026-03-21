import api from './api';

export const contentManagerApi = {
  // Get all content managers
  getAllContentManagers: async () => {
    const response = await api.get('/contentManagers');
    return response.data;
  },

  // Get content manager by ID
  getContentManagerById: async (id) => {
    const response = await api.get(`/contentManagers/${id}`);
    return response.data;
  },

  // Create new content manager
  createContentManager: async (cmData) => {
    const response = await api.post('/contentManagers', cmData);
    return response.data;
  },

  // Update content manager
  updateContentManager: async (id, cmData) => {
    const response = await api.put(`/contentManagers/${id}`, cmData);
    return response.data;
  },

  // Delete content manager
  deleteContentManager: async (id) => {
    const response = await api.delete(`/contentManagers/${id}`);
    return response.data;
  },

  // Get content manager analytics
  getContentManagerAnalytics: async (id) => {
    const response = await api.get(`/contentManagers/${id}/analytics`);
    return response.data;
  },

  // Toggle content manager status
  toggleContentManagerStatus: async (id) => {
    const response = await api.patch(`/contentManagers/${id}/toggle-status`);
    return response.data;
  },

  // Get content manager performance metrics
  getContentManagerMetrics: async (id) => {
    const response = await api.get(`/contentManagers/${id}/metrics`);
    return response.data;
  },

  // Get content manager activity log
  getContentManagerActivity: async (id, params = {}) => {
    const response = await api.get(`/contentManagers/${id}/activity`, { params });
    return response.data;
  }
};

export default contentManagerApi;
