import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  users: [],
  authStatus: "loading", // loading | authenticated | unauthenticated
  isFetching: false,
  error: false,
  errorMessage: null,
  successMessage: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetErrorMessage: state => {
      state.error = false;
      state.errorMessage = null;
      state.successMessage = null;
    },

    logout: state => {
      state.currentUser = null;
      state.users = [];
      state.authStatus = "unauthenticated";
    },

    setAuthStatus: (state, action) => {
      state.authStatus = action.payload;
    },

    setSubscriptionStatus: (state, action) => {
      if (state.currentUser) {
        state.currentUser.isSubscribed = action.payload;
      }
    },

    registerStart: state => {
      state.isFetching = true;
      state.error = false;
    },
    registerSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = {
        ...action.payload,
        token: 'cookie-auth', // Placeholder for cookie-based auth
      };
    },
    registerFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload?.message;
    },

    loginStart: state => {
      state.isFetching = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.currentUser = {
        ...action.payload,
        token: 'cookie-auth', // Placeholder for cookie-based auth
      };
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload?.message;
    },

    forgotPasswordStart: state => {
      state.isFetching = true;
      state.error = false;
    },
    forgotPasswordSuccess: (state, action) => {
      state.isFetching = false;
      state.successMessage = action.payload;
    },
    forgotPasswordFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload?.message;
    },

    verifyEmailStart: state => {
      state.isFetching = true;
      state.error = false;
    },
    verifyEmailSuccess: (state, action) => {
      state.isFetching = false;
      state.successMessage = action.payload;
    },
    verifyEmailFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload?.message;
    },

    validateOtpStart: state => {
      state.isFetching = true;
      state.error = false;
    },
    validateOtpSuccess: (state, action) => {
      state.isFetching = false;
      state.successMessage = action.payload;
    },
    validateOtpFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload?.message;
    },

    updatePassPushStart: state => {
      state.isFetching = true;
      state.error = false;
    },
    updatePassPushSuccess: (state, action) => {
      state.isFetching = false;
      state.successMessage = action.payload;
    },
    updatePassPushFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload?.message;
    },

    updateUserStart: state => {
      state.isFetching = true;
      state.error = false;
    },
    updateUserSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
    },
    updateUserFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload?.message;
    },

    fetchUsersStart: state => {
      state.isFetching = true;
      state.error = false;
    },
    fetchUsersSuccess: (state, action) => {
      state.isFetching = false;
      state.users = action.payload;
    },
    fetchUsersFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload?.message;
    },

    fetchCurrentStart: state => {
      state.isFetching = true;
      state.error = false;
    },
    fetchCurrentSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.authStatus = "authenticated";
    },
    fetchCurrentFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload?.message;
      
      if (!action.payload?.preserveUser) {
        state.currentUser = null;
        state.authStatus = "unauthenticated";
      }
    },
  },
});

export const {
  resetErrorMessage,
  logout,

  registerStart,
  registerSuccess,
  registerFailure,

  loginStart,
  loginSuccess,
  loginFailure,

  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,

  verifyEmailStart,
  verifyEmailSuccess,
  verifyEmailFailure,

  validateOtpStart,
  validateOtpSuccess,
  validateOtpFailure,

  updatePassPushStart,
  updatePassPushSuccess,
  updatePassPushFailure,

  updateUserStart,
  updateUserSuccess,
  updateUserFailure,

  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,

  fetchCurrentStart,
  fetchCurrentSuccess,
  fetchCurrentFailure,

  setAuthStatus,
  setSubscriptionStatus,
} = userSlice.actions;

export default userSlice.reducer;
