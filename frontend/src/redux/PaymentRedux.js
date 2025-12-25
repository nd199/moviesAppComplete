import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  paymentPlan: {},
  isFetching: false,
  error: false,
  errorMessage: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentPlan: (state, action) => {
      state.paymentPlan = action.payload;
    },
    pushToPaymentStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = null;
    },
    pushToPaymentSuccess: (state) => {
      state.isFetching = false;
      state.error = false;
      state.errorMessage = null;
    },
    pushToPaymentFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload;
    },
    resetPaymentError: (state) => {
      state.error = false;
      state.errorMessage = null;
    },
  },
});

export const {
  setPaymentPlan,
  pushToPaymentStart,
  pushToPaymentSuccess,
  pushToPaymentFailure,
  resetPaymentError,
} = paymentSlice.actions;

export default paymentSlice.reducer;
