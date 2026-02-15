import {
  authRequest,
  passResetRequest,
  publicRequest,
  userRequest,
  paymentRequest,
  springRequest,
} from '../AxiosMethods';
import {
  fetchMoviesFailure,
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchShowsFailure,
  fetchShowsStart,
  fetchShowsSuccess,
} from '../redux/ProductsRedux';
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
} from '../redux/userSlice';

/* ================= REGISTER ================= */
export const register = async (dispatch, customerInfo) => {
  dispatch(registerStart());
  try {
    const res = await authRequest().post('/auth/customers', customerInfo);
    dispatch(registerSuccess(res.data));
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Failed to Register. Try again.';
    dispatch(registerFailure({ message }));
    throw error;
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPasswordRequest = async (dispatch, email) => {
  dispatch(forgotPasswordStart());
  try {
    const res = await passResetRequest.post('/request', { email });
    dispatch(forgotPasswordSuccess(res.data));
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Account not found with this email';
    dispatch(forgotPasswordFailure({ message }));
    throw error;
  }
};

/* ================= LOGIN ================= */
export const login = async (dispatch, userInfo) => {
  dispatch(loginStart());
  try {
    const res = await authRequest().post('/auth/login', userInfo);
    dispatch(loginSuccess(res.data));
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Invalid email or password';
    dispatch(loginFailure({ message }));
    throw error;
  }
};

/* ================= FETCH MOVIES ================= */
export const fetchMovies = async dispatch => {
  dispatch(fetchMoviesStart());
  try {
    const res = await publicRequest.get('/movies');
    dispatch(fetchMoviesSuccess(res.data));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch movies';
    dispatch(fetchMoviesFailure({ message }));
  }
};

/* ================= FETCH SHOWS ================= */
export const fetchShows = async dispatch => {
  dispatch(fetchShowsStart());
  try {
    const res = await publicRequest.get('/shows');
    dispatch(fetchShowsSuccess(res.data));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch shows';
    dispatch(fetchShowsFailure({ message }));
  }
};

/* ================= VERIFY EMAIL ================= */
export const verifyEmail = async (dispatch, email) => {
  dispatch(verifyEmailStart());
  try {
    const res = await publicRequest.post('/verify/email', email);
    dispatch(verifyEmailSuccess(res.data.message));
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || 'Email verification failed';
    dispatch(verifyEmailFailure({ message }));
    throw error;
  }
};

/* ================= VALIDATE OTP ================= */
export const validateOtp = async (dispatch, validateInfo) => {
  dispatch(validateOtpStart());
  try {
    const res = await publicRequest.post('/validate/Otp', validateInfo);
    dispatch(validateOtpSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Invalid or expired OTP';
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
    const message = error.response?.data?.message || 'Profile update failed';
    dispatch(updateUserFailure({ message }));
    return { success: false, error: message };
  }
};

/* ================= FETCH USERS ================= */
export const fetchUsers = async dispatch => {
  dispatch(fetchUsersStart());
  try {
    const res = await publicRequest.get('/customers/userRequest');
    dispatch(fetchUsersSuccess(res.data));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch users';
    dispatch(fetchUsersFailure({ message }));
  }
};

/* ================= FETCH CURRENT USER ================= */
export const fetchCurrentUserDetails = async dispatch => {
  dispatch(fetchCurrentStart());
  try {
    const res = await userRequest().get(`/customers/currentUser`);
    dispatch(fetchCurrentSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch user';
    dispatch(fetchCurrentFailure({ message }));
  }
};

/* ================= RESET PASSWORD ================= */
export const updatePasswordAndPushToLoginPage = async (dispatch, data) => {
  dispatch(updatePassPushStart());
  try {
    const res = await passResetRequest.post('/reset', data);
    dispatch(updatePassPushSuccess(res.data));
  } catch (error) {
    const message = error.response?.data?.message || 'Password reset failed';
    dispatch(updatePassPushFailure({ message }));
  }
};

/* ================= PAYMENT APIS ================= */
export const savePaymentApi = payload =>
  paymentRequest.post('/payments/submitPayment', payload);

export const getPaymentDetailsApi = email =>
  paymentRequest.get(`/payments/paymentDetails?email=${email}`);

export const updateFinalUserApi = finalUser =>
  paymentRequest.post('/payments/updateFinalUser', { finalUser });

export const pingSpringApi = email => springRequest.post('/', { email });

/* ================= ADMIN APIS ================= */
export const fetchProducts = async dispatch => {
  try {
    const res = await userRequest().get('/products/AllProducts');
    const products = [...res.data.movies, ...res.data.shows];
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

export const deleteProduct = async (id, type) => {
  try {
    await userRequest().delete(`/products/${id}/${type}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
};

export const updateProduct = async (id, type, product) => {
  try {
    const res = await userRequest().put(`/products/${id}/${type}`, product);
    return res.data;
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
};

export const addProduct = async product => {
  try {
    const res = await userRequest().post('/products', product);
    return res.data;
  } catch (error) {
    console.error('Failed to add product:', error);
    throw error;
  }
};

export const updateUser = async (id, customer) => {
  try {
    const res = await userRequest().put(`/customers/${id}`, customer);
    return res.data;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};

export const deleteUser = async id => {
  try {
    await userRequest().delete(`/customers/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
};
