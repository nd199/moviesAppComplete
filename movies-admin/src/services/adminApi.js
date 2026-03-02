import api from './api';

// ================= AUTH ================= //
export const login = async (dispatch, credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (dispatch, userData) => {
  try {
    const response = await api.post('/auth/admins', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (dispatch, email) => {
  try {
    const response = await api.post('/password-reset/request', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (dispatch, passwordData) => {
  try {
    const response = await api.post('/password-reset/reset', passwordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================= USERS ================= //
export const fetchUsers = async (dispatch) => {
  try {
    const response = await api.get('/customers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (dispatch, userId, userData) => {
  try {
    const response = await api.put(`/customers/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (dispatch, userId) => {
  try {
    const response = await api.delete(`/customers/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================= MOVIES ================= //
export const fetchMovies = async (dispatch) => {
  try {
    const response = await api.get('/movies');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createMovie = async (dispatch, movieData) => {
  try {
    const response = await api.post('/movies', movieData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMovie = async (dispatch, movieId, movieData) => {
  try {
    const response = await api.put(`/movies/${movieId}`, movieData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMovie = async (dispatch, movieId) => {
  try {
    const response = await api.delete(`/movies/${movieId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================= SUBSCRIPTIONS ================= //
export const fetchLatestSubscriptions = async (dispatch) => {
  try {
    const response = await api.get('/subscription/latest');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================= ORDERS ================= //
export const fetchOrders = async (dispatch) => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchIncome = async (dispatch) => {
  try {
    const response = await api.get('/payments/api/payment/intent');
    return response.data;
  } catch (error) {
    console.error('API: fetchIncome error:', error);
    throw error;
  }
};

// ================= STATS ================= //
export const fetchUserStats = async (dispatch) => {
  try {
    const response = await api.get('/customers/stats');
    return response.data;
  } catch (error) {
    console.error('API: fetchUserStats error:', error);
    throw error;
  }
};

export const fetchAdmins = async (dispatch) => {
  try {
    const response = await api.get('/admins');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAdminById = async (dispatch, adminId) => {
  try {
    const response = await api.get(`/admins/${adminId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAdmin = async (dispatch, adminData, roles) => {
  try {
    const response = await api.post('/admins', adminData, {
      params: { roles }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdmin = async (dispatch, adminId, adminData) => {
  try {
    const response = await api.put(`/admins/${adminId}`, adminData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAdmin = async (dispatch, adminId) => {
  try {
    const response = await api.delete(`/admins/${adminId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const toggleAdminStatus = async (dispatch, adminId) => {
  try {
    const response = await api.put(`/admins/${adminId}/toggle-status`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAdminStats = async (dispatch) => {
  try {
    const response = await api.get('/admins/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchActiveAdmins = async (dispatch) => {
  try {
    const response = await api.get('/admins/active');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAdminsByDepartment = async (dispatch, department) => {
  try {
    const response = await api.get(`/admins/department/${department}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================= SHOWS ================= //
export const fetchShows = async (dispatch) => {
  try {
    const response = await api.get('/shows');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchShowById = async (dispatch, showId) => {
  try {
    const response = await api.get(`/shows/${showId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createShow = async (dispatch, showData) => {
  try {
    const response = await api.post('/shows', showData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateShow = async (dispatch, showId, showData) => {
  try {
    const response = await api.put(`/shows/${showId}`, showData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteShow = async (dispatch, showId) => {
  try {
    const response = await api.delete(`/shows/${showId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchShowsByCategory = async (dispatch, category) => {
  try {
    const response = await api.get(`/shows/category/${category}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllCategories = async (dispatch) => {
  try {
    const response = await api.get('/shows/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};
