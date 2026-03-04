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
    
    // Token is handled via HTTP-only cookies, no need to store in JS cookies
    console.log('Register: Authentication cookies set by server');
    
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
    
    // Handle new response structure
    const userData = res.data?.user || res.data; // Fallback to old structure
    
    console.log('Login: Authentication cookies set by server');
    
    dispatch(loginSuccess(userData));
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

export const fetchMovies = async dispatch => {
  dispatch(fetchMoviesStart());
  try {
    const res = await publicRequest().get('/products/AllProducts');
    const movies = res.data?.movies || [];
    dispatch(fetchMoviesSuccess(movies));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch movies';
    dispatch(fetchMoviesFailure({ message }));
  }
};

export const fetchShows = async dispatch => {
  dispatch(fetchShowsStart());
  try {
    const res = await publicRequest().get('/products/AllProducts');
    const shows = res.data?.shows || [];
    dispatch(fetchShowsSuccess(shows));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch shows';
    dispatch(fetchShowsFailure({ message }));
  }
};

export const verifyEmail = async (dispatch, email) => {
  console.log("🔍 DEBUG: Sending to backend email:", email);
  console.log("🔍 DEBUG: Email type:", typeof email);
  
  dispatch(verifyEmailStart());
  try {
    const payload = {
      email: email.trim().toLowerCase()
    };
    console.log("🔍 DEBUG: Final payload being sent:", payload);
    
    const res = await publicRequest().post('/verify/email', payload);
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
    const res = await publicRequest().post('/validate/otp', validateInfo);
    dispatch(validateOtpSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Invalid or expired OTP';
    dispatch(validateOtpFailure({ message }));
    throw error;
  }
};

export const updateProfile = async (dispatch, userUpdateInfo, id) => {
  dispatch(updateUserStart());
  try {
    // Use authenticated userRequest instead of publicRequest for profile updates
    const res = await userRequest().put(`/profile/current`, userUpdateInfo);
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
    // Use authenticated userRequest for profile updates by ID
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
    const res = await userRequest().get(`/profile/current`, {
      withCredentials: true
    });
    dispatch(fetchCurrentSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch user profile';
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Auth error - setting user as unauthenticated');
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

export const fetchUsers = async dispatch => {
  dispatch(fetchUsersStart());
  try {
    const res = await publicRequest().get('/customers/userRequest');
    dispatch(fetchUsersSuccess(res.data));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch users';
    dispatch(fetchUsersFailure({ message }));
  }
};

export const fetchCurrentUserDetails = async dispatch => {
  dispatch(fetchCurrentStart());
  try {
    // API endpoint: /customers/currentUser - verified correct spelling
    const res = await userRequest().get(`/customers/currentUser`, {
      withCredentials: true
    });
    dispatch(fetchCurrentSuccess(res.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch user';
    
    // Always set unauthenticated on any error
    dispatch(fetchCurrentFailure({ message }));
    dispatch(setAuthStatus('unauthenticated'));
    
    // Don't throw error for 401/403 - just return null
    if (error.response?.status === 401 || error.response?.status === 403) {
      return null;
    }
    
    // Throw for other errors so they can be handled elsewhere
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
  paymentRequest.post('/payments/submitPayment', payload);

export const getPaymentDetailsApi = email =>
  paymentRequest.get(`/payments/paymentDetails?email=${email}`);

export const updateFinalUserApi = finalUser =>
  paymentRequest.post('/payments/updateFinalUser', { finalUser });

export const markUserSubscribedApi = async (email) => {
  try {
    const res = await paymentRequest.post('/payments/subscribe-success', null, {
      params: { email }
    });
    return res.data;
  } catch (error) {
    console.error('Failed to mark user as subscribed:', error);
    throw error;
  }
};

export const pingSpringApi = email => springRequest.post('/', { email });

export const fetchProducts = async dispatch => {
  try {
    const res = await userRequest().get('/products/AllProducts');
    const products = [...res.data.movies, ...res.data.shows];
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    console.warn('Returning empty products array due to auth error');
    return [];
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

// TMDB API Calls
export const fetchTmdbTrendingMovies = async dispatch => {
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

export const fetchTmdbTrendingShows = async dispatch => {
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

export const syncTmdbMovie = async (tmdbId) => {
  try {
    const res = await userRequest().post(`/tmdb/sync/movie/${tmdbId}`);
    return { success: true, data: res.data };
  } catch (error) {
    console.error('Failed to sync movie:', error);
    throw error;
  }
};

export const fetchTmdbMovieDetails = async (movieName) => {
  try {
    // First search for the movie by name to get TMDB ID
    const searchRes = await publicRequest().get(`/tmdb/search/movies?query=${encodeURIComponent(movieName)}&page=1`);
    const results = searchRes.data?.results || [];
    
    if (results.length === 0) {
      return null;
    }
    
    // Get the first result's TMDB ID
    const tmdbId = results[0].tmdbId;
    
    // Fetch detailed movie information including trailer
    const detailsRes = await publicRequest().get(`/tmdb/movie/${tmdbId}`);
    return detailsRes.data;
  } catch (error) {
    console.error('Failed to fetch movie details:', error);
    return null;
  }
};

export const fetchTmdbPopularMovies = async dispatch => {
  try {
    const res = await publicRequest().get('/tmdb/discover/movies?sort_by=popularity.desc&vote_count.gte=1000');
    const results = res.data?.results || [];
    console.log('Popular movies API response:', res.data);
    return results;
  } catch (error) {
    console.error('Failed to fetch popular movies:', error);
    return [];
  }
};

export const fetchTmdbTopRatedMovies = async dispatch => {
  try {
    const res = await publicRequest().get('/tmdb/top-rated/movies');
    const results = res.data?.results || [];
    console.log('Top rated movies API response:', res.data);
    return results;
  } catch (error) {
    console.error('Failed to fetch top rated movies:', error);
    return [];
  }
};

export const fetchTmdbNowPlayingMovies = async dispatch => {
  try {
    const res = await publicRequest().get('/tmdb/now-playing/movies');
    const results = res.data?.results || [];
    console.log('Now playing movies API response:', res.data);
    return results;
  } catch (error) {
    console.error('Failed to fetch now playing movies:', error);
    return [];
  }
};

export const fetchTmdbUpcomingMovies = async dispatch => {
  try {
    const res = await publicRequest().get('/tmdb/upcoming/movies');
    const results = res.data?.results || [];
    console.log('Upcoming movies API response:', res.data);
    return results;
  } catch (error) {
    console.error('Failed to fetch upcoming movies:', error);
    return [];
  }
};

export const fetchTmdbPopularShows = async dispatch => {
  try {
    const res = await publicRequest().get('/tmdb/popular/shows');
    const results = res.data?.results || [];
    console.log('Popular shows API response:', res.data);
    return results;
  } catch (error) {
    console.error('Failed to fetch popular shows:', error);
    return [];
  }
};

export const fetchTmdbTopRatedShows = async dispatch => {
  try {
    const res = await publicRequest().get('/tmdb/top-rated/shows');
    const results = res.data?.results || [];
    console.log('Top rated shows API response:', res.data);
    return results;
  } catch (error) {
    console.error('Failed to fetch top rated shows:', error);
    return [];
  }
};

export const fetchTmdbSouthIndianMovies = async dispatch => {
  try {
    const res = await publicRequest().get('/tmdb/south-indian/movies');
    const results = res.data?.results || [];
    console.log('South Indian movies API response:', res.data);
    return results;
  } catch (error) {
    console.error('Failed to fetch South Indian movies:', error);
    return [];
  }
};

export const syncTmdbTvShow = async (tmdbId) => {
  try {
    const res = await userRequest().post(`/tmdb/sync/tv/${tmdbId}`);
    return { success: true, data: res.data };
  } catch (error) {
    console.error('Failed to sync TV show:', error);
    throw error;
  }
};
