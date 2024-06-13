import { createSlice } from "@reduxjs/toolkit";
import { verifyEmail } from "./ApiCalls";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    users: [],
    isFetching: false,
    error: false,
    successMessage: null,
    errorMessage: null,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = null;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload;
    },
    registerStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = null;
    },
    registerSuccess: (state, action) => {
      state.isFetching = false;
      state.users.push(action.payload);
    },
    registerFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload;
    },
    updateUserStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = null;
    },
    updateUserSuccess: (state, action) => {
      state.isFetching = false;
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.currentUser && state.currentUser.id === action.payload.id) {
        state.currentUser = action.payload;
      }
    },
    updateUserFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload;
    },
    deleteUserStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = null;
    },
    deleteUserSuccess: (state, action) => {
      state.isFetching = false;
      state.users = state.users.filter((user) => user.id !== action.payload);
      if (state.currentUser && state.currentUser.id === action.payload) {
        state.currentUser = null;
      }
    },
    deleteUserFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload;
    },
    fetchUsersStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    fetchUsersSuccess: (state, action) => {
      state.isFetching = false;
      state.users = action.payload;
    },
    fetchUsersFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    fetchUserByEmailStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = null;
    },
    fetchUserByEmailSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
    },
    fetchUserByEmailFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload;
    },
    fetchUserByPhoneNumberStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = null;
    },
    fetchUserByPhoneNumberSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
    },
    fetchUserByPhoneNumberFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload;
    },
    forgotPasswordStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    forgotPasswordSuccess: (state, action) => {
      state.isFetching = false;
      state.users = action.payload;
    },
    forgotPasswordFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    },
    verifyEmailStart: (state) => {
      state.isFetching = true;
      state.successMessage = null;
      state.errorMessage = null;
    },
    verifyEmailSuccess: (state, action) => {
      state.isFetching = false;
      state.successMessage = action.payload;
      state.errorMessage = null;
    },
    verifyEmailFailure: (state, action) => {
      state.isFetching = false;
      state.successMessage = null;
      state.errorMessage = action.payload;
    },
    verifyPhoneStart: (state) => {
      state.isFetching = true;
      state.successMessage = null;
      state.errorMessage = null;
    },
    verifyPhoneSuccess: (state, action) => {
      state.isFetching = false;
      state.successMessage = action.payload;
      state.errorMessage = null;
    },
    verifyPhoneFailure: (state, action) => {
      state.isFetching = false;
      state.successMessage = null;
      state.errorMessage = action.payload;
    },
    resetErrorMessage: (state) => {
      state.errorMessage = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  fetchUsersStart,
  fetchUsersFailure,
  fetchUsersSuccess,
  fetchUserByEmailStart,
  fetchUserByEmailFailure,
  fetchUserByEmailSuccess,
  fetchUserByPhoneNumberStart,
  fetchUserByPhoneNumberFailure,
  fetchUserByPhoneNumberSuccess,
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  verifyEmailStart,
  verifyEmailSuccess,
  verifyEmailFailure,
  verifyPhoneStart,
  verifyPhoneSuccess,
  verifyPhoneFailure,
  resetErrorMessage,
} = userSlice.actions;

export default userSlice.reducer;
