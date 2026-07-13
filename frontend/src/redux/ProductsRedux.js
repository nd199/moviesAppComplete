import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  movies: [],
  shows: [],
  tmdbMovies: [],
  tmdbShows: [],
  tmdbTrendingMovies: [],
  tmdbTrendingShows: [],
  tmdbFeatured: [],
  tmdbSearchResults: [],
  fetching: false,
  tmdbFetching: false,
  error: false,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    fetchMoviesStart: state => {
      state.fetching = true;
      state.error = false;
    },
    fetchMoviesSuccess: (state, action) => {
      state.fetching = false;
      state.movies = action.payload;
    },
    fetchMoviesFailure: state => {
      state.fetching = false;
      state.error = true;
    },
    fetchShowsStart: state => {
      state.fetching = true;
      state.error = false;
    },
    fetchShowsSuccess: (state, action) => {
      state.fetching = false;
      state.shows = action.payload;
    },
    fetchShowsFailure: state => {
      state.fetching = false;
      state.error = true;
    },
    // TMDB Actions
    fetchTmdbMoviesStart: state => {
      state.tmdbFetching = true;
      state.error = false;
    },
    fetchTmdbMoviesSuccess: (state, action) => {
      state.tmdbFetching = false;
      state.tmdbMovies = action.payload;
    },
    fetchTmdbMoviesFailure: state => {
      state.tmdbFetching = false;
      state.error = true;
    },
    fetchTmdbShowsStart: state => {
      state.tmdbFetching = true;
      state.error = false;
    },
    fetchTmdbShowsSuccess: (state, action) => {
      state.tmdbFetching = false;
      state.tmdbShows = action.payload;
    },
    fetchTmdbShowsFailure: state => {
      state.tmdbFetching = false;
      state.error = true;
    },
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
    fetchTmdbSearchResultsStart: state => {
      state.tmdbFetching = true;
      state.error = false;
    },
    fetchTmdbSearchResultsSuccess: (state, action) => {
      state.tmdbFetching = false;
      state.tmdbSearchResults = action.payload;
    },
    fetchTmdbSearchResultsFailure: state => {
      state.tmdbFetching = false;
      state.error = true;
    },
    fetchTmdbFeaturedStart: state => {
      state.tmdbFetching = true;
      state.error = false;
    },
    fetchTmdbFeaturedSuccess: (state, action) => {
      state.tmdbFetching = false;
      state.tmdbFeatured = action.payload;
    },
    fetchTmdbFeaturedFailure: state => {
      state.tmdbFetching = false;
      state.error = true;
    },
    clearTmdbSearchResults: state => {
      state.tmdbSearchResults = [];
    },
  },
});

export const {
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  fetchShowsStart,
  fetchShowsSuccess,
  fetchShowsFailure,
  fetchTmdbMoviesStart,
  fetchTmdbMoviesSuccess,
  fetchTmdbMoviesFailure,
  fetchTmdbShowsStart,
  fetchTmdbShowsSuccess,
  fetchTmdbShowsFailure,
  fetchTmdbTrendingMoviesStart,
  fetchTmdbTrendingMoviesSuccess,
  fetchTmdbTrendingMoviesFailure,
  fetchTmdbTrendingShowsStart,
  fetchTmdbTrendingShowsSuccess,
  fetchTmdbTrendingShowsFailure,
  fetchTmdbSearchResultsStart,
  fetchTmdbSearchResultsSuccess,
  fetchTmdbSearchResultsFailure,
  clearTmdbSearchResults,
} = productSlice.actions;

export default productSlice.reducer;
