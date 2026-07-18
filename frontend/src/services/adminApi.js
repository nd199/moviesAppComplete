import api from '../AxiosMethods';

export const adminLogin = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const contentManagerLogin = async (credentials) => {
  const response = await api.post('/content-manager/login', credentials);
  return response.data;
};

export const setPassword = async (data) => {
  const response = await api.post('/auth/set-password', data);
  return response.data;
};

export const fetchUsers = async () => {
  const response = await api.get('/customers');
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await api.put(`/customers/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/customers/${userId}`);
  return response.data;
};

export const fetchMovies = async () => {
  const response = await api.get('/movies');
  return response.data;
};

export const createMovie = async (movieData) => {
  const response = await api.post('/movies', movieData);
  return response.data;
};

export const updateMovie = async (movieId, movieData) => {
  const response = await api.put(`/movies/${movieId}`, movieData);
  return response.data;
};

export const deleteMovie = async (movieId) => {
  const response = await api.delete(`/movies/${movieId}`);
  return response.data;
};

export const fetchShows = async () => {
  const response = await api.get('/shows');
  return response.data;
};

export const fetchShowById = async (showId) => {
  const response = await api.get(`/shows/${showId}`);
  return response.data;
};

export const createShow = async (showData) => {
  const response = await api.post('/shows', showData);
  return response.data;
};

export const updateShow = async (showId, showData) => {
  const response = await api.put(`/shows/${showId}`, showData);
  return response.data;
};

export const deleteShow = async (showId) => {
  const response = await api.delete(`/shows/${showId}`);
  return response.data;
};

export const fetchAdmins = async () => {
  const response = await api.get('/admins');
  return response.data;
};

export const fetchAdminById = async (adminId) => {
  const response = await api.get(`/admins/${adminId}`);
  return response.data;
};

export const createAdmin = async (adminData, roles) => {
  const response = await api.post('/admins', adminData, { params: { roles } });
  return response.data;
};

export const updateAdmin = async (adminId, adminData) => {
  const response = await api.put(`/admins/${adminId}`, adminData);
  return response.data;
};

export const deleteAdmin = async (adminId) => {
  const response = await api.delete(`/admins/${adminId}`);
  return response.data;
};

export const toggleAdminStatus = async (adminId) => {
  const response = await api.put(`/admins/${adminId}/toggle-status`);
  return response.data;
};

export const fetchContentManagers = async () => {
  const response = await api.get('/content-manager');
  return response.data;
};

export const fetchContentManagerById = async (cmId) => {
  const response = await api.get(`/content-manager/${cmId}`);
  return response.data;
};

export const createContentManager = async (cmData) => {
  const response = await api.post('/content-manager', cmData);
  return response.data;
};

export const updateContentManager = async (cmId, cmData) => {
  const response = await api.put(`/content-manager/${cmId}`, cmData);
  return response.data;
};

export const deleteContentManager = async (cmId) => {
  const response = await api.delete(`/content-manager/${cmId}`);
  return response.data;
};

export const fetchUserStats = async () => {
  const response = await api.get('/customers/stats');
  return response.data;
};

export const fetchLatestSubscriptions = async () => {
  const response = await api.get('/subscription/latest');
  return response.data;
};
