import api from './api';
import { setAccessToken, setRefreshToken, clearAuth } from '../authStore';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  const { accessToken, refreshToken, user } = response.data;
  
  // Store tokens
  setAccessToken(accessToken);
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
  
  return response.data;
};

export const getCurrentAdmin = async () => {
  const response = await api.get('/customers/currentAdmin');
  return response.data;
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuth();
  }
};

// Admin management
export const getAdmins = async () => {
  const response = await api.get('/admins');
  return response.data;
};

export const getAdminById = async (id) => {
  const response = await api.get(`/admins/${id}`);
  return response.data;
};

export const createAdmin = async (adminData) => {
  const response = await api.post('/admins', adminData);
  return response.data;
};

export const updateAdmin = async (id, adminData) => {
  const response = await api.put(`/admins/${id}`, adminData);
  return response.data;
};

export const deleteAdmin = async (id) => {
  const response = await api.delete(`/admins/${id}`);
  return response.data;
};

// User management
export const getUsers = async () => {
  const response = await api.get('/customers');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/customers/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/customers', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/customers/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/customers/${id}`);
  return response.data;
};

// Movies
export const getMovies = async () => {
  const response = await api.get('/movies');
  return response.data;
};

export const getMovieById = async (id) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

export const createMovie = async (movieData) => {
  const response = await api.post('/movies', movieData);
  return response.data;
};

export const updateMovie = async (id, movieData) => {
  const response = await api.put(`/movies/${id}`, movieData);
  return response.data;
};

export const deleteMovie = async (id) => {
  const response = await api.delete(`/movies/${id}`);
  return response.data;
};

// Shows
export const getShows = async () => {
  const response = await api.get('/shows');
  return response.data;
};

export const getShowById = async (id) => {
  const response = await api.get(`/shows/${id}`);
  return response.data;
};

export const createShow = async (showData) => {
  const response = await api.post('/shows', showData);
  return response.data;
};

export const updateShow = async (id, showData) => {
  const response = await api.put(`/shows/${id}`, showData);
  return response.data;
};

export const deleteShow = async (id) => {
  const response = await api.delete(`/shows/${id}`);
  return response.data;
};

// Content Managers
export const getContentManagers = async () => {
  const response = await api.get('/contentManagers');
  return response.data;
};

export const getContentManagerById = async (id) => {
  const response = await api.get(`/contentManagers/${id}`);
  return response.data;
};

export const createContentManager = async (cmData) => {
  const response = await api.post('/contentManagers', cmData);
  return response.data;
};

export const updateContentManager = async (id, cmData) => {
  const response = await api.put(`/contentManagers/${id}`, cmData);
  return response.data;
};

export const deleteContentManager = async (id) => {
  const response = await api.delete(`/contentManagers/${id}`);
  return response.data;
};

// Statistics
export const getAdminStats = async () => {
  const response = await api.get('/admins/stats');
  return response.data;
};

export const getUserStats = async () => {
  const response = await api.get('/customers/stats');
  return response.data;
};

// Additional exports for compatibility
export const fetchIncome = async () => {
  // Mock implementation or API call
  return { income: 125000, growth: 15.3 };
};

export const fetchLatestSubscriptions = async () => {
  // Mock implementation or API call
  return [
    { id: 1, user: 'John Doe', plan: 'Premium', date: '2024-03-07' },
    { id: 2, user: 'Jane Smith', plan: 'Basic', date: '2024-03-06' }
  ];
};

export const toggleAdminStatus = async (id) => {
  const response = await api.patch(`/admins/${id}/toggle-status`);
  return response.data;
};

// Alias exports for compatibility
export const fetchAdmins = getAdmins;
export const fetchAdminById = getAdminById;
export const fetchUsers = getUsers;
export const fetchMovies = getMovies;
export const fetchShows = getShows;
export const fetchShowById = getShowById;
