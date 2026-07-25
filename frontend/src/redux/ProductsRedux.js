import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tmdbTrendingMovies: [],
  tmdbTrendingShows: [],
  tmdbFetching: false,
  error: false,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    fetchTmdbTrendingMoviesStart: state => {
      state.tmdbFetching = true;
      state.error = false;
    },
    fetchTmdbTrendingMoviesSuccess: (state, action) => {
      state.tmdbFetching = false;
      state.tmdbTrendingMovies = action.payload;
    },
    fetchTmdbTrendingMoviesFailure: state => {
      state.tmdbFetching = false;
      state.error = true;
    },
    fetchTmdbTrendingShowsStart: state => {
      state.tmdbFetching = true;
      state.error = false;
    },
    fetchTmdbTrendingShowsSuccess: (state, action) => {
      state.tmdbFetching = false;
      state.tmdbTrendingShows = action.payload;
    },
    fetchTmdbTrendingShowsFailure: state => {
      state.tmdbFetching = false;
      state.error = true;
    },
  },
});

export const {
  fetchTmdbTrendingMoviesStart,
  fetchTmdbTrendingMoviesSuccess,
  fetchTmdbTrendingMoviesFailure,
  fetchTmdbTrendingShowsStart,
  fetchTmdbTrendingShowsSuccess,
  fetchTmdbTrendingShowsFailure,
} = productSlice.actions;

export default productSlice.reducer;
