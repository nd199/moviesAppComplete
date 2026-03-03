import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null,
  token: null,
  isAuthenticated: !!localStorage.getItem('adminLoggedIn'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.admin = action.payload.admin;
      state.token = action.payload.token || null;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('adminLoggedIn', 'true');
      if (action.payload.token) {
        localStorage.setItem('jwt_token', action.payload.token);
      }
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('jwt_token');
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('jwt_token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
