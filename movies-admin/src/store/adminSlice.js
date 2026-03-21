import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null,
  isAuthenticated: 'loading',
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.admin = action.payload.admin;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.admin = null;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthStatus: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  setAuthStatus,
} = adminSlice.actions;

export default adminSlice.reducer;
