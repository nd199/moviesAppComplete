import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null,
  token: null, // Not used with cookie-based auth
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
      state.token = null; // Not used with cookie-based auth
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('adminLoggedIn', 'true');
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('adminLoggedIn');
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('adminLoggedIn');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
