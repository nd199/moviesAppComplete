import { userRequest, publicRequest, passResetRequest, paymentRequest } from '../AxiosMethods';
import { setAccessToken, setRefreshToken, clearAuth } from '../authStore';
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
    const res = await userRequest().post('/auth/customers', customerInfo);
    dispatch(registerSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || 'Failed to Register. Try again.';
    dispatch(registerFailure({ message }));
    throw error;
  }
};

export const login = async (dispatch, userInfo) => {
  dispatch(loginStart());
  try {
    const res = await userRequest().post('/auth/login', userInfo);
    const { accessToken, refreshToken } = res.data;

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    dispatch(loginSuccess(res.data));

    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || 'Invalid credentials';
    dispatch(loginFailure({ message }));
    throw error;
  }
};

export const logout = async (dispatch) => {
  try {
    await userRequest().post('/auth/logout');
  } catch (error) {
  } finally {
    clearAuth();
    dispatch(setAuthStatus("unauthenticated"));
  }
};

export const forgotPasswordRequest = async (dispatch, email) => {
  dispatch(forgotPasswordStart());
  try {
    const res = await passResetRequest.post('/request', { email });
    dispatch(forgotPasswordSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || 'Account not found with this email';
    dispatch(forgotPasswordFailure({ message }));
    throw error;
  }
};

export const verifyEmail = async (dispatch, email, checkUserExists = true) => {
  dispatch(verifyEmailStart());
  try {
    const res = await userRequest().post('/verify/email', { email, checkUserExists });
    dispatch(verifyEmailSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || 'Failed to verify email';
    dispatch(verifyEmailFailure({ message }));
    throw error;
  }
};

export const verifySubscriptionEmail = async (dispatch, email) => {
  dispatch(verifyEmailStart());
  try {
    const res = await userRequest().post('/verify/email/subscription', { email });
    dispatch(verifyEmailSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || 'Failed to verify email for subscription';
    dispatch(verifyEmailFailure({ message }));
    throw error;
  }
};

export const validateOtp = async (dispatch, otp, email) => {
  dispatch(validateOtpStart());
  try {
    const res = await userRequest().post('/validate/otp', { 
      customerEmail: email, 
      enteredOTP: otp 
    });
    dispatch(validateOtpSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || 'Invalid OTP';
    dispatch(validateOtpFailure({ message }));
    throw error;
  }
};

export const validateSubscriptionOtp = async (dispatch, otp, email) => {
  dispatch(validateOtpStart());
  try {
    const res = await userRequest().post('/validate/otp/subscription', { 
      customerEmail: email, 
      enteredOTP: otp 
    });
    dispatch(validateOtpSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data || error.response?.data?.error || 'Invalid OTP';
    dispatch(validateOtpFailure({ message }));
    throw error;
  }
};

export const updatePasswordAndPushToLoginPage = async (dispatch, data) => {
  dispatch(updatePassPushStart());
  try {
    const res = await passResetRequest.post('/reset', data);
    dispatch(updatePassPushSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Password reset failed';
    dispatch(updatePassPushFailure({ message }));
    throw error;
  }
};

export const fetchCurrentUserDetails = async (dispatch) => {
  dispatch(fetchCurrentStart());
  try {
    const res = await userRequest().get('/profile/current');
    dispatch(fetchCurrentSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch user';
    dispatch(fetchCurrentFailure({ message }));
    dispatch(setAuthStatus('unauthenticated'));
    throw error;
  }
};

export const updateProfile = async (dispatch, userData) => {
  dispatch(updateUserStart());
  try {
    const res = await userRequest().put('/profile/current', userData);
    dispatch(updateUserSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update profile';
    dispatch(updateUserFailure({ message }));
    throw error;
  }
};

export const changePassword = async (dispatch, passwordData) => {
  try {
    const res = await userRequest().post('/auth/change-password', passwordData);
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

export const deleteUser = async (id) => {
  try {
    await userRequest().delete(`/customers/${id}`);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const res = await userRequest().get('/admin/users');
    return res.data || [];
  } catch (error) {
    return [];
  }
};

export const fetchMovies = async () => {
  try {
    const res = await userRequest().get('/movies');
    return res.data || [];
  } catch (error) {
    return [];
  }
};

export const fetchShows = async () => {
  try {
    const res = await userRequest().get('/shows');
    return res.data || [];
  } catch (error) {
    return [];
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

export const addProduct = async (product) => {
  try {
    const res = await userRequest().post('/products', product);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTmdbTrendingMovies = async (dispatch) => {
  dispatch(fetchTmdbTrendingMoviesStart());
  try {
    const res = await publicRequest().get('/tmdb/trending/movies');
    const results = res.data?.results || [];
    dispatch(fetchTmdbTrendingMoviesSuccess(results));
    return results;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch trending movies';
    dispatch(fetchTmdbTrendingMoviesFailure({ message }));
    return [];
  }
};

export const fetchTmdbTrendingShows = async (dispatch) => {
  dispatch(fetchTmdbTrendingShowsStart());
  try {
    const res = await publicRequest().get('/tmdb/trending/shows');
    const results = res.data?.results || [];
    dispatch(fetchTmdbTrendingShowsSuccess(results));
    return results;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch trending shows';
    dispatch(fetchTmdbTrendingShowsFailure({ message }));
    return [];
  }
};

export const fetchTmdbPopularMovies = async () => {
  try {
    const res = await publicRequest().get('/tmdb/discover/movies?sort_by=popularity.desc&vote_count.gte=1000');
    return res.data?.results || [];
  } catch (error) {
    return [];
  }
};

export const fetchTmdbTopRatedMovies = async () => {
  try {
    const res = await publicRequest().get('/tmdb/top-rated/movies');
    return res.data?.results || [];
  } catch (error) {
    return [];
  }
};

export const fetchTmdbNowPlayingMovies = async () => {
  try {
    const res = await publicRequest().get('/tmdb/now-playing/movies');
    return res.data?.results || [];
  } catch (error) {
    return [];
  }
};

export const fetchTmdbUpcomingMovies = async () => {
  try {
    const res = await publicRequest().get('/tmdb/upcoming/movies');
    return res.data?.results || [];
  } catch (error) {
    return [];
  }
};

export const fetchTmdbPopularShows = async () => {
  try {
    const res = await publicRequest().get('/tmdb/popular/shows');
    return res.data?.results || [];
  } catch (error) {
    return [];
  }
};

export const fetchTmdbTopRatedShows = async () => {
  try {
    const res = await publicRequest().get('/tmdb/top-rated/shows');
    return res.data?.results || [];
  } catch (error) {
    return [];
  }
};

export const fetchTmdbSouthIndianMovies = async () => {
  try {
    const res = await publicRequest().get('/tmdb/south-indian/movies');
    return res.data?.results || [];
  } catch (error) {
    return [];
  }
};

export const searchTmdbMovies = async (dispatch, query, page = 1) => {
  dispatch(fetchTmdbSearchResultsStart());
  try {
    const res = await publicRequest().get(`/tmdb/search/movies?query=${encodeURIComponent(query)}&page=${page}`);
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
    const res = await publicRequest().get(`/tmdb/search/shows?query=${encodeURIComponent(query)}&page=${page}`);
    const results = res.data?.results || [];
    dispatch(fetchTmdbSearchResultsSuccess(results));
    return results;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to search shows';
    dispatch(fetchTmdbSearchResultsFailure({ message }));
    return [];
  }
};

export const fetchMovieCast = async (tmdbId) => {
  try {
    const res = await publicRequest().get(`/tmdb/movie/${tmdbId}/cast`);
    return res.data?.cast || [];
  } catch { return []; }
};

export const fetchTvShowCast = async (tmdbId) => {
  try {
    const res = await publicRequest().get(`/tmdb/tv/${tmdbId}/cast`);
    return res.data?.cast || [];
  } catch { return []; }
};

export const fetchSimilarMovies = async (tmdbId) => {
  try {
    const res = await publicRequest().get(`/tmdb/movie/${tmdbId}/similar`);
    return res.data?.results || [];
  } catch { return []; }
};

export const fetchSimilarTvShows = async (tmdbId) => {
  try {
    const res = await publicRequest().get(`/tmdb/tv/${tmdbId}/similar`);
    return res.data?.results || [];
  } catch { return []; }
};

export const fetchRecommendedMovies = async (tmdbId) => {
  try {
    const res = await publicRequest().get(`/tmdb/movie/${tmdbId}/recommended`);
    return res.data?.results || [];
  } catch { return []; }
};

export const fetchRecommendedTvShows = async (tmdbId) => {
  try {
    const res = await publicRequest().get(`/tmdb/tv/${tmdbId}/recommended`);
    return res.data?.results || [];
  } catch { return []; }
};

export const fetchMovieGenres = async () => {
  try {
    const res = await publicRequest().get('/tmdb/genres/movies');
    return res.data?.genres || [];
  } catch { return []; }
};

export const fetchTvGenres = async () => {
  try {
    const res = await publicRequest().get('/tmdb/genres/tv');
    return res.data?.genres || [];
  } catch { return []; }
};

export const syncTmdbMovie = async (tmdbId) => {
  try {
    const res = await userRequest().post(`/tmdb/sync/movie/${tmdbId}`);
    return { success: true, data: res.data };
  } catch (error) {
    throw error;
  }
};

export const syncTmdbTvShow = async (tmdbId) => {
  try {
    const res = await userRequest().post(`/tmdb/sync/tv/${tmdbId}`);
    return { success: true, data: res.data };
  } catch (error) {
    throw error;
  }
};

export const fetchTmdbMovieDetails = async (tmdbId) => {
  try {
    const res = await publicRequest().get(`/tmdb/movie/${tmdbId}`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const fetchTmdbTvShowDetails = async (tmdbId) => {
  try {
    const res = await publicRequest().get(`/tmdb/tv/${tmdbId}`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const savePaymentApi = (payload) => paymentRequest().post('/submitPayment', payload);

export const getPaymentDetailsApi = (email) => paymentRequest().get(`/paymentDetails?email=${email}`);

export const updateFinalUserApi = (finalUser) => paymentRequest().post('/updateFinalUser', { finalUser });

export const markUserAsSubscribed = async () => {
  try {
    const res = await userRequest().post('/payments/subscribe-success');
    return res.data?.data || res.data;
  } catch (error) {
    throw error;
  }
};

export const pingSpringApi = async (email) => {
  try {
    await userRequest().post('/payments/ping', { email });
  } catch (error) {
  }
};

export const getSubscriptionPlans = async () => {
  try {
    const res = await userRequest().get('/subscription/plans');
    return res.data || [];
  } catch (error) {
    return [];
  }
};

export const getCurrentSubscription = async () => {
  try {
    const res = await userRequest().get('/subscription/current');
    return res.data;
  } catch (error) {
    return null;
  }
};

export const createSubscriptionIntent = async (planId) => {
  try {
    const res = await userRequest().post('/subscription/intent/', { planId });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getMovieStreamUrl = async (movieId) => {
  try {
    const res = await userRequest().get(`/streaming/movie/${movieId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getShowStreamUrl = async (showId, season, episode) => {
  try {
    const res = await userRequest().get(`/streaming/show/${showId}/season/${season}/episode/${episode}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getWatchHistory = async () => {
  try {
    const res = await userRequest().get('/streaming/history');
    return res.data || [];
  } catch (error) {
    return [];
  }
};

export const addToWatchlist = async (contentId, contentType) => {
  try {
    const res = await userRequest().post('/streaming/watchlist', { contentId, contentType });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getWatchlist = async () => {
  try {
    const res = await userRequest().get('/streaming/watchlist');
    return res.data || [];
  } catch (error) {
    return [];
  }
};

export const removeFromWatchlist = async (contentId) => {
  try {
    await userRequest().delete(`/streaming/watchlist/${contentId}`);
    return { success: true };
  } catch (error) {
    throw error;
  }
};
