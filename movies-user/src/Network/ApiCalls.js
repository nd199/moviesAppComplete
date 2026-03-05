import {
  authRequest,
  passResetRequest,
  userRequest,
  paymentRequest,
} from '../AxiosMethods';
import {
  fetchTmdbTrendingMoviesStart,
  fetchTmdbTrendingMoviesSuccess,
  fetchTmdbTrendingMoviesFailure,
  fetchTmdbTrendingShowsStart,
  fetchTmdbTrendingShowsSuccess,
  fetchTmdbTrendingShowsFailure,
  fetchTmdbSearchResultsStart,
  fetchTmdbSearchResultsSuccess,
  fetchTmdbSearchResultsFailure,
} from '../redux/ProductsRedux';
import {
  fetchCurrentFailure,
  fetchCurrentStart,
  fetchCurrentSuccess,
  forgotPasswordFailure,
  forgotPasswordStart,
  forgotPasswordSuccess,
  loginFailure,
  loginStart,
  loginSuccess,
  registerFailure,
  registerStart,
  registerSuccess,
  setAuthStatus,
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

export const register = async (dispatch, customerInfo) => {
  dispatch(registerStart());
  try {
    const res = await authRequest().post('/auth/customers', customerInfo);
    dispatch(registerSuccess(res.data));
    dispatch(setAuthStatus("authenticated"));
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Failed to Register. Try again.';
    dispatch(registerFailure({ message }));
    throw error;
  }
};

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

export const login = async (dispatch, userInfo) => {
  dispatch(loginStart());
  try {
    const res = await authRequest().post('/auth/login', userInfo);
    const { user } = res.data;
    dispatch(loginSuccess(user));
    dispatch(setAuthStatus("authenticated"));
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Invalid email or password';
    dispatch(loginFailure({ message }));
    throw error;
  }
};


export const verifyEmail = async (dispatch, email) => {
  dispatch(verifyEmailStart());
  try {
    const payload = {
      email: email.trim().toLowerCase()
    };
    
    const res = await userRequest().post('/verify/email', payload);
    dispatch(verifyEmailSuccess(res.data));
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || 'Email verification failed';
    dispatch(verifyEmailFailure({ message }));
    throw error;
  }
};

export const validateOtp = async (dispatch, validateInfo) => {
  dispatch(validateOtpStart());
  try {
    const res = await userRequest().post('/validate/otp', validateInfo);
    dispatch(validateOtpSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Invalid or expired OTP';
    dispatch(validateOtpFailure({ message }));
    throw error;
  }
};

export const updateProfile = async (dispatch, userUpdateInfo) => {
  dispatch(updateUserStart());
  try {
    const res = await userRequest().put('/profile/current', userUpdateInfo);
    dispatch(updateUserSuccess(res.data));
    return { success: true, data: res.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Profile update failed';
    dispatch(updateUserFailure({ message }));
    return { success: false, error: message };
  }
};

export const updateProfileById = async (dispatch, userUpdateInfo, id) => {
  dispatch(updateUserStart());
  try {
    const res = await userRequest().put(`/profile/${id}`, userUpdateInfo);
    dispatch(updateUserSuccess(res.data));
    return { success: true, data: res.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Profile update failed';
    dispatch(updateUserFailure({ message }));
    return { success: false, error: message };
  }
};

export const getCurrentUserProfile = async dispatch => {
  dispatch(fetchCurrentStart());
  try {
    const res = await userRequest().get('/profile/current');
    dispatch(fetchCurrentSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch user profile';
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      dispatch(fetchCurrentFailure({ message }));
      return;
    }
    
    dispatch(fetchCurrentFailure({ message }));
  }
};

export const changePassword = async (dispatch, passwordData) => {
  try {
    const res = await userRequest().put('/profile/current/password', passwordData);
    return { success: true, data: res.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Password change failed';
    return { success: false, error: message };
  }
};


export const fetchCurrentUserDetails = async dispatch => {
  dispatch(fetchCurrentStart());
  try {
    const res = await userRequest().get('/customers/currentUser');
    dispatch(fetchCurrentSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch user';
    dispatch(fetchCurrentFailure({ message }));
    dispatch(setAuthStatus('unauthenticated'));
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      return null;
    }
    
    throw error;
  }
};

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

export const savePaymentApi = payload =>
  paymentRequest().post('/submitPayment', payload);

export const getPaymentDetailsApi = email =>
  paymentRequest().get(`/paymentDetails?email=${email}`);

export const updateFinalUserApi = finalUser =>
  paymentRequest().post('/updateFinalUser', { finalUser });

export const markUserAsSubscribed = async () => {
  try {
    const res = await userRequest().post('/subscribe-success');
    return res.data;
  } catch (error) {
    throw error;
  }
};


export const fetchProducts = async () => {
  try {
    const res = await userRequest().get('/products/AllProducts');
    return [...res.data.movies, ...res.data.shows];
  } catch (error) {
    return [];
  }
};

export const deleteProduct = async (id, type) => {
  try {
    await userRequest().delete(`/products/${id}/${type}`);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, type, product) => {
  try {
    const res = await userRequest().put(`/products/${id}/${type}`, product);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addProduct = async product => {
  try {
    const res = await userRequest().post('/products', product);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, customer) => {
  try {
    const res = await userRequest().put(`/customers/${id}`, customer);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async id => {
  try {
    await userRequest().delete(`/customers/${id}`);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// TMDB API Calls
export const fetchTmdbTrendingMovies = async dispatch => {
  dispatch(fetchTmdbTrendingMoviesStart());
  try {
    const res = await userRequest().get('/tmdb/trending/movies');
    const results = res.data?.results || [];
    dispatch(fetchTmdbTrendingMoviesSuccess(results));
    return results;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch trending movies';
    dispatch(fetchTmdbTrendingMoviesFailure({ message }));
    return [];
  }
};

export const fetchTmdbTrendingShows = async dispatch => {
  dispatch(fetchTmdbTrendingShowsStart());
  try {
    const res = await userRequest().get('/tmdb/trending/shows');
    const results = res.data?.results || [];
    dispatch(fetchTmdbTrendingShowsSuccess(results));
    return results;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch trending shows';
    dispatch(fetchTmdbTrendingShowsFailure({ message }));
    return [];
  }
};

export const searchTmdbMovies = async (dispatch, query, page = 1) => {
  dispatch(fetchTmdbSearchResultsStart());
  try {
    const res = await userRequest().get(`/tmdb/search/movies?query=${encodeURIComponent(query)}&page=${page}`);
    const results = res.data?.results || [];
    dispatch(fetchTmdbSearchResultsSuccess(results));
    return results;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to search movies';
    dispatch(fetchTmdbSearchResultsFailure({ message }));
    return [];
  }
};

export const searchTmdbShows = async (dispatch, query, page = 1) => {
  dispatch(fetchTmdbSearchResultsStart());
  try {
    const res = await userRequest().get(`/tmdb/search/shows?query=${encodeURIComponent(query)}&page=${page}`);
    const results = res.data?.results || [];
    dispatch(fetchTmdbSearchResultsSuccess(results));
    return results;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to search shows';
    dispatch(fetchTmdbSearchResultsFailure({ message }));
    return [];
  }
};

export const syncTmdbMovie = async tmdbId => {
  try {
    const res = await userRequest().post(`/tmdb/sync/movie/${tmdbId}`);
    return { success: true, data: res.data };
  } catch (error) {
    throw error;
  }
};

export const fetchTmdbMovieDetails = async movieName => {
  try {
    const searchRes = await userRequest().get(`/tmdb/search/movies?query=${encodeURIComponent(movieName)}&page=1`);
    const results = searchRes.data?.results || [];
    
    if (results.length === 0) {
      return null;
    }
    
    const tmdbId = results[0].tmdbId;
    const detailsRes = await userRequest().get(`/tmdb/movie/${tmdbId}`);
    return detailsRes.data;
  } catch (error) {
    return null;
  }
};

export const fetchTmdbPopularMovies = async () => {
  try {
    const res = await userRequest().get('/tmdb/discover/movies?sort_by=popularity.desc&vote_count.gte=1000');
    return res.data?.results || [];
  } catch (error) {
    return [];
  }
};

export const fetchTmdbTopRatedMovies = async () => {
  try {
    const res = await userRequest().get('/tmdb/top-rated/movies');
    return res.data?.results || [];
  } catch (error) {
    return [];
  }
};

export const fetchTmdbNowPlayingMovies = async () => {
  try {
    const res = await userRequest().get('/tmdb/now-playing/movies');
    return res.data?.results || [];
  } catch (error) {
    return [];
  }
};

export const fetchTmdbUpcomingMovies = async () => {
  try {
    const res = await userRequest().get('/tmdb/upcoming/movies');
    return res.data?.results || [];
  } catch (error) {
    return [];
  }
};

export const fetchTmdbPopularShows = async () => {
  try {
    const res = await userRequest().get('/tmdb/popular/shows');
    return res.data?.results || [];
  } catch (error) {
    return [];
  }
};

export const fetchTmdbTopRatedShows = async () => {
  try {
    const res = await userRequest().get('/tmdb/top-rated/shows');
    return res.data?.results || [];
  } catch (error) {
    return [];
  }
};

export const fetchTmdbSouthIndianMovies = async () => {
  try {
    const res = await userRequest().get('/tmdb/south-indian/movies');
    return res.data?.results || [];
  } catch (error) {
    return [];
  }
};

export const syncTmdbTvShow = async tmdbId => {
  try {
    const res = await userRequest().post(`/tmdb/sync/tv/${tmdbId}`);
    return { success: true, data: res.data };
  } catch (error) {
    throw error;
  }
};
