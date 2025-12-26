import axios from "axios";
import { authRequest, passResetRequest, publicRequest } from "../AxiosMethods";
import {
  fetchMoviesFailure,
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchShowsFailure,
  fetchShowsStart,
  fetchShowsSuccess,
} from "../redux/ProductsRedux";
import {
  fetchCurrentFailure,
  fetchCurrentStart,
  fetchCurrentSuccess,
  fetchUsersFailure,
  fetchUsersStart,
  fetchUsersSuccess,
  forgotPasswordFailure,
  forgotPasswordStart,
  forgotPasswordSuccess,
  loginFailure,
  loginStart,
  loginSuccess,
  registerFailure,
  registerStart,
  registerSuccess,
  updatePassPushFailure,
  updatePassPushStart,
  updatePassPushSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  validateOtpFailure,
  validateOtpStart,
  validateOtpSuccess,
  verifyEmailFailure,
  verifyEmailStart,
  verifyEmailSuccess,
} from "../redux/userSlice";

import {
  pushToPaymentFailure,
  pushToPaymentStart,
  pushToPaymentSuccess,
} from "../redux/PaymentRedux";

/* ================= REGISTER ================= */
export const register = async (dispatch, customerInfo) => {
  dispatch(registerStart());
  try {
    const res = await authRequest.post("/customers", customerInfo);
    dispatch(registerSuccess(res.data));
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to Register. Try again.";
    dispatch(registerFailure({ message }));
    throw error;
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPasswordRequest = async (dispatch, email) => {
  dispatch(forgotPasswordStart());
  try {
    const res = await passResetRequest.post("/request", { email });
    dispatch(forgotPasswordSuccess(res.data));
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Account not found with this email";
    dispatch(forgotPasswordFailure({ message }));
    throw error;
  }
};

/* ================= LOGIN ================= */
export const login = async (dispatch, userInfo) => {
  dispatch(loginStart());
  try {
    const res = await authRequest.post("/login", userInfo);
    dispatch(loginSuccess(res.data));
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Invalid email or password";
    dispatch(loginFailure({ message }));
    throw error;
  }
};

/* ================= FETCH MOVIES ================= */
export const fetchMovies = async (dispatch) => {
  dispatch(fetchMoviesStart());
  try {
    const res = await publicRequest.get("/movies");
    dispatch(fetchMoviesSuccess(res.data));
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch movies";
    dispatch(fetchMoviesFailure({ message }));
  }
};

/* ================= FETCH SHOWS ================= */
export const fetchShows = async (dispatch) => {
  dispatch(fetchShowsStart());
  try {
    const res = await publicRequest.get("/shows");
    dispatch(fetchShowsSuccess(res.data));
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch shows";
    dispatch(fetchShowsFailure({ message }));
  }
};

/* ================= VERIFY EMAIL ================= */
export const verifyEmail = async (dispatch, email) => {
  dispatch(verifyEmailStart());
  try {
    const res = await publicRequest.post("/verify/email", email);
    dispatch(verifyEmailSuccess(res.data.message));
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Email verification failed";
    dispatch(verifyEmailFailure({ message }));
    throw error;
  }
};

/* ================= VALIDATE OTP ================= */
export const validateOtp = async (dispatch, validateInfo) => {
  dispatch(validateOtpStart());
  try {
    const res = await publicRequest.post("/validate/Otp", validateInfo);
    dispatch(validateOtpSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Invalid or expired OTP";
    dispatch(validateOtpFailure({ message }));
    throw error;
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (dispatch, userUpdateInfo, id) => {
  dispatch(updateUserStart());
  try {
    const res = await publicRequest.put(`/profile/${id}`, userUpdateInfo);
    dispatch(updateUserSuccess(res.data));
    return { success: true, data: res.data };
  } catch (error) {
    const message = error.response?.data?.message || "Profile update failed";
    dispatch(updateUserFailure({ message }));
    return { success: false, error: message };
  }
};

/* ================= FETCH USERS ================= */
export const fetchUsers = async (dispatch) => {
  dispatch(fetchUsersStart());
  try {
    const res = await publicRequest.get("/customers/userRequest");
    dispatch(fetchUsersSuccess(res.data));
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch users";
    dispatch(fetchUsersFailure({ message }));
  }
};

/* ================= FETCH CURRENT USER ================= */
export const fetchCurrentUserDetails = async (dispatch, email) => {
  dispatch(fetchCurrentStart());
  try {
    const res = await publicRequest.get(`/customers/currentUser/${email}`);
    dispatch(fetchCurrentSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch user";
    dispatch(fetchCurrentFailure({ message }));
  }
};

/* ================= RESET PASSWORD ================= */
export const updatePasswordAndPushToLoginPage = async (dispatch, data) => {
  dispatch(updatePassPushStart());
  try {
    const res = await passResetRequest.post("/reset", data);
    dispatch(updatePassPushSuccess(res.data));
  } catch (error) {
    const message = error.response?.data?.message || "Password reset failed";
    dispatch(updatePassPushFailure({ message }));
  }
};
