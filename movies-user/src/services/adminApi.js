import api from '../AxiosMethods';
import {
  mockAdminUser,
  mockContentManagerUser,
  mockMovies,
  mockShows,
  mockCustomers,
  mockAdmins,
  mockContentManagers,
  mockCustomerStats,
} from '../mockData';

const isMockMode = process.env.REACT_APP_MOCK_MODE === 'true';
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

// ================= AUTH ================= //
export const adminLogin = async (credentials) => {
  if (isMockMode) {
    await delay();
    localStorage.setItem('mock_is_admin', 'true');
    localStorage.removeItem('mock_is_cm');
    return { accessToken: 'mock_admin_token', refreshToken: 'mock_admin_refresh', user: mockAdminUser };
  }
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const contentManagerLogin = async (credentials) => {
  if (isMockMode) {
    await delay();
    localStorage.setItem('mock_is_cm', 'true');
    localStorage.removeItem('mock_is_admin');
    return { accessToken: 'mock_cm_token', refreshToken: 'mock_cm_refresh', user: mockContentManagerUser };
  }
  const response = await api.post('/content-manager/login', credentials);
  return response.data;
};

export const setPassword = async (data) => {
  if (isMockMode) { await delay(); return { message: 'Password set successfully' }; }
  const response = await api.post('/auth/set-password', data);
  return response.data;
};

// ================= USERS ================= //
export const fetchUsers = async () => {
  if (isMockMode) { await delay(); return mockCustomers; }
  const response = await api.get('/customers');
  return response.data;
};

export const updateUser = async (userId, userData) => {
  if (isMockMode) { await delay(); return { message: 'User updated', id: userId }; }
  const response = await api.put(`/customers/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  if (isMockMode) { await delay(); return { message: 'User deleted' }; }
  const response = await api.delete(`/customers/${userId}`);
  return response.data;
};

// ================= MOVIES ================= //
export const fetchMovies = async () => {
  if (isMockMode) { await delay(); return mockMovies; }
  const response = await api.get('/movies');
  return response.data;
};

export const createMovie = async (movieData) => {
  if (isMockMode) { await delay(); return { message: 'Movie created', id: Date.now() }; }
  const response = await api.post('/movies', movieData);
  return response.data;
};

export const updateMovie = async (movieId, movieData) => {
  if (isMockMode) { await delay(); return { message: 'Movie updated', id: movieId }; }
  const response = await api.put(`/movies/${movieId}`, movieData);
  return response.data;
};

export const deleteMovie = async (movieId) => {
  if (isMockMode) { await delay(); return { message: 'Movie deleted' }; }
  const response = await api.delete(`/movies/${movieId}`);
  return response.data;
};

// ================= SHOWS ================= //
export const fetchShows = async () => {
  if (isMockMode) { await delay(); return mockShows; }
  const response = await api.get('/shows');
  return response.data;
};

export const fetchShowById = async (showId) => {
  if (isMockMode) { await delay(); return mockShows.find(s => s.id === showId) || mockShows[0]; }
  const response = await api.get(`/shows/${showId}`);
  return response.data;
};

export const createShow = async (showData) => {
  if (isMockMode) { await delay(); return { message: 'Show created', id: Date.now() }; }
  const response = await api.post('/shows', showData);
  return response.data;
};

export const updateShow = async (showId, showData) => {
  if (isMockMode) { await delay(); return { message: 'Show updated', id: showId }; }
  const response = await api.put(`/shows/${showId}`, showData);
  return response.data;
};

export const deleteShow = async (showId) => {
  if (isMockMode) { await delay(); return { message: 'Show deleted' }; }
  const response = await api.delete(`/shows/${showId}`);
  return response.data;
};

// ================= ADMINS ================= //
export const fetchAdmins = async () => {
  if (isMockMode) { await delay(); return mockAdmins; }
  const response = await api.get('/admins');
  return response.data;
};

export const fetchAdminById = async (adminId) => {
  if (isMockMode) { await delay(); return mockAdmins.find(a => a.id === adminId) || mockAdmins[0]; }
  const response = await api.get(`/admins/${adminId}`);
  return response.data;
};

export const createAdmin = async (adminData, roles) => {
  if (isMockMode) { await delay(); return { message: 'Admin created', id: 102 }; }
  const response = await api.post('/admins', adminData, { params: { roles } });
  return response.data;
};

export const updateAdmin = async (adminId, adminData) => {
  if (isMockMode) { await delay(); return { message: 'Admin updated', id: adminId }; }
  const response = await api.put(`/admins/${adminId}`, adminData);
  return response.data;
};

export const deleteAdmin = async (adminId) => {
  if (isMockMode) { await delay(); return { message: 'Admin deleted' }; }
  const response = await api.delete(`/admins/${adminId}`);
  return response.data;
};

export const toggleAdminStatus = async (adminId) => {
  if (isMockMode) { await delay(); return { message: 'Status toggled', isActive: true }; }
  const response = await api.put(`/admins/${adminId}/toggle-status`);
  return response.data;
};

// ================= CONTENT MANAGERS ================= //
export const fetchContentManagers = async () => {
  if (isMockMode) { await delay(); return mockContentManagers; }
  const response = await api.get('/content-manager');
  return response.data;
};

export const fetchContentManagerById = async (cmId) => {
  if (isMockMode) { await delay(); return mockContentManagers.find(cm => cm.id === cmId) || mockContentManagers[0]; }
  const response = await api.get(`/content-manager/${cmId}`);
  return response.data;
};

export const createContentManager = async (cmData) => {
  if (isMockMode) { await delay(); return { message: 'Content manager created', id: 202 }; }
  const response = await api.post('/content-manager', cmData);
  return response.data;
};

export const updateContentManager = async (cmId, cmData) => {
  if (isMockMode) { await delay(); return { message: 'Content manager updated', id: cmId }; }
  const response = await api.put(`/content-manager/${cmId}`, cmData);
  return response.data;
};

export const deleteContentManager = async (cmId) => {
  if (isMockMode) { await delay(); return { message: 'Content manager deleted' }; }
  const response = await api.delete(`/content-manager/${cmId}`);
  return response.data;
};

// ================= STATS ================= //
export const fetchUserStats = async () => {
  if (isMockMode) { await delay(); return mockCustomerStats; }
  const response = await api.get('/customers/stats');
  return response.data;
};

export const fetchLatestSubscriptions = async () => {
  if (isMockMode) {
    await delay();
    return [
      { id: 1, user: { name: 'John Doe', email: 'john@example.com' }, plan: { name: 'Premium', price: 499 }, status: 'ACTIVE', createdAt: new Date().toISOString() },
      { id: 2, user: { name: 'Jane Smith', email: 'jane@example.com' }, plan: { name: 'Basic', price: 99 }, status: 'PENDING', createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 3, user: { name: 'Bob Johnson', email: 'bob@example.com' }, plan: { name: 'Standard', price: 199 }, status: 'CANCELLED', createdAt: new Date(Date.now() - 172800000).toISOString() },
    ];
  }
  const response = await api.get('/subscription/latest');
  return response.data;
};
