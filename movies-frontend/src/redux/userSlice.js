import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  users: [],
  isFetching: false,
  error: false,
  errorMessage: null,
  successMessage: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /* ================= COMMON ================= */
    resetErrorMessage: state => {
      state.error = false;
      state.errorMessage = null;
      state.successMessage = null;
    },

    logout: state => {
      state.currentUser = null;
      state.users = [];
    },

    /* ================= REGISTER ================= */
    registerStart: state => {
      state.isFetching = true;
      state.error = false;
    },
    registerSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = {
        ...action.payload,
      };
    },
    registerFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload?.message;
    },

    /* ================= LOGIN ================= */
    loginStart: state => {
      state.isFetching = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.currentUser = {
        ...action.payload.customerDTO,
        token: action.payload.token,
      };
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload?.message;
    },

    /* ================= FORGOT PASSWORD ================= */
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

    /* ================= VERIFY EMAIL ================= */
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

    /* ================= VALIDATE OTP ================= */
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

    /* ================= UPDATE PASSWORD ================= */
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

    /* ================= UPDATE PROFILE ================= */
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

    /* ================= FETCH USERS ================= */
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

    /* ================= FETCH CURRENT USER ================= */
    fetchCurrentStart: state => {
      state.isFetching = true;
      state.error = false;
    },
    fetchCurrentSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
    },
    fetchCurrentFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload?.message;
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
} = userSlice.actions;

export default userSlice.reducer;
