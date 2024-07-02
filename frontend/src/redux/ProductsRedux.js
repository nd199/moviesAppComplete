import { createSlice } from "@reduxjs/toolkit";

export const ProductRedux = createSlice({
  name: "product",
  initialState: {
    movies: [],
    shows: [],
    fetching: false,
    error: false,
  },
  reducers: {
    fetchMoviesStart: (state) => {
      state.fetching = true;
      state.error = false;
    },
    fetchMoviesSuccess: (state, action) => {
      state.fetching = false;
      state.movies = action.payload;
    },
    fetchMoviesFailure: (state) => {
      state.fetching = false;
      state.error = true;
    },
    fetchShowsStart: (state) => {
      state.fetching = true;
      state.error = false;
    },
    fetchShowsSuccess: (state, action) => {
      state.fetching = false;
      state.shows = action.payload;
    },
    fetchShowsFailure: (state) => {
      state.fetching = false;
      state.error = true;
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
} = ProductRedux.actions;
export default ProductRedux.reducer;
