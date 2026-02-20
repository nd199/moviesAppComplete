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
    const response = await api.get('/api/payment/intent');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================= STATS ================= //
export const fetchUserStats = async (dispatch) => {
  try {
    const response = await api.get('/customers/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};
