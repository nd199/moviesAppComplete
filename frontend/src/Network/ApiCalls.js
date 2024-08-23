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
  fetchCurrentStart,
  fetchCurrentSuccess,
  fetchCurrentFailure,
} from "../redux/userSlice";

import {
  pushToPaymentFailure,
  pushToPaymentStart,
  pushToPaymentSuccess,
} from "../redux/PaymentRedux";

export const register = async (dispatch, customerInfo) => {
  dispatch(registerStart());
  try {
    const res = await authRequest.post("/customers", customerInfo);
    const { data: customerDTO, headers } = res;
    dispatch(registerSuccess(customerDTO));
    if (registerSuccess) {
      localStorage.setItem(
        "persist:root",
        JSON.stringify({
          user: JSON.stringify({
            currentUser: customerDTO,
          }),
        })
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(registerFailure(error.response.data));
      console.log(error.response);
      throw error;
    } else {
      dispatch(registerFailure({ error: "Failed to Register Try Again !.." }));
      throw new Error("Failed to Register Try Again !..");
    }
  }
};

export const forgotPasswordRequest = async (dispatch, email) => {
  dispatch(forgotPasswordStart());
  try {
    const res = await passResetRequest.post("/request", { email });
    dispatch(forgotPasswordSuccess(res.data));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(forgotPasswordFailure(error.response.data));
      throw error;
    } else {
      dispatch(
        forgotPasswordFailure({ error: "an unexpected error occurred" })
      );
      throw new Error("An unexpected error occurred");
    }
  }
};

// Login
export const login = async (dispatch, userInfo) => {
  dispatch(loginStart());
  try {
    const res = await authRequest.post("/login", userInfo);
    const { data: customerDTO, headers } = res;
    dispatch(loginSuccess(customerDTO));
    if(loginSuccess){
    localStorage.setItem(
      "persist:root",
      JSON.stringify({
        user: JSON.stringify({
          currentUser: customerDTO,
        }),
      })
    );}
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(loginFailure(error.response.data));
      throw error;
    } else {
      dispatch(loginFailure({ error: "An unexpected error occurred" }));
      throw new Error("An unexpected error occurred");
    }
  }
};

// Fetch Products
export const fetchMovies = async (dispatch) => {
  dispatch(fetchMoviesStart());
  try {
    const res = await publicRequest.get("/movies");
    dispatch(fetchMoviesSuccess(res.data));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(fetchMoviesFailure(error.response.data));
    } else {
      dispatch(fetchMoviesFailure({ error: "An unexpected error occurred" }));
    }
  }
};

// Fetch Shows
export const fetchShows = async (dispatch) => {
  dispatch(fetchShowsStart());
  try {
    const res = await publicRequest.get("/shows");
    dispatch(fetchShowsSuccess(res.data));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(fetchShowsFailure(error.response.data));
    } else {
      dispatch(fetchShowsFailure({ error: "An unexpected error occurred" }));
    }
  }
};

export const verifyEmail = async (dispatch, email) => {
  dispatch(verifyEmailStart());
  try {
    const res = await publicRequest.post("/verify/email", email);
    dispatch(verifyEmailSuccess(res.data.message));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(verifyEmailFailure(error.response));
      throw error;
    } else {
      dispatch(verifyEmailFailure("An unexpected error occurred"));
    }
    return null;
  }
};

export const validateOtp = async (dispatch, validateInfo) => {
  dispatch(validateOtpStart());
  try {
    const res = await publicRequest.post("/validate/Otp", validateInfo);
    dispatch(validateOtpSuccess(res.data));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(validateOtpFailure(error.response.data));
      throw error;
    } else {
      dispatch(validateOtpFailure("An unexpected error occurred"));
    }
    return null;
  }
};

export const pushToPaymentModule = async (dispatch, userPaymentInfo) => {
  console.log(userPaymentInfo);
  dispatch(pushToPaymentStart());
  try {
    const res = await axios.post(
      "http://localhost:3008/api/auth/payment",
      userPaymentInfo
    );
    dispatch(pushToPaymentSuccess(res.data));
  } catch (paymentError) {
    console.error("Error during payment:", paymentError);
    if (axios.isAxiosError(paymentError) && paymentError.response) {
      dispatch(pushToPaymentFailure(paymentError.response.data));
    } else {
      dispatch(pushToPaymentFailure("An unexpected error occurred"));
    }
  }
};

export const updateProfile = async (dispatch, userUpdateInfo, id) => {
  dispatch(updateUserStart());
  try {
    const res = await publicRequest.put(`/profile/${id}`, userUpdateInfo);
    dispatch(updateUserSuccess(res.data));
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error during update:", error);
    if (axios.isAxiosError(error) && error.response) {
      dispatch(updateUserFailure(error.response.data));
      return { success: false, error: error.response.data };
    } else {
      dispatch(updateUserFailure("An unexpected error occurred"));
      return { success: false, error: "An unexpected error occurred" };
    }
  }
};

export const fetchUsers = async (dispatch) => {
  dispatch(fetchUsersStart());
  try {
    const res = await publicRequest.get("/customers/userRequest");
    dispatch(fetchUsersSuccess(res.data));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(fetchUsersFailure(error.response.data));
    } else {
      dispatch(fetchUsersFailure({ error: "An unexpected error occurred" }));
    }
  }
};

export const fetchCurrentUserDetails = async (dispatch, email) => {
  dispatch(fetchCurrentStart());
  try {
    const res = await publicRequest.get(`/customers/currentUser/${email}`);
    dispatch(fetchCurrentSuccess(res.data));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(fetchCurrentFailure(error.response.data));
    } else {
      dispatch(fetchCurrentFailure({ error: "An unexpected error occurred" }));
    }
  }
};

export const updatePasswordAndPushToLoginPage = async (dispatch, data) => {
  dispatch(updatePassPushStart());
  try {
    const res = await passResetRequest.post("/reset", data);
    dispatch(updatePassPushSuccess(res.data));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(updatePassPushFailure(error.response.data));
    } else {
      dispatch(
        updatePassPushFailure({ error: "An unexpected error occurred" })
      );
    }
  }
};
