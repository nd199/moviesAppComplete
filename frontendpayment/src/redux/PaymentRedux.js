import { createSlice } from '@reduxjs/toolkit';

export const PaymentRedux = createSlice({
  name: 'payment',
  initialState: {
    paymentPlan: {},
    userInfoAndSelectedPlan: {},
    finalUser: {},
    isFetching: false,
    error: null,
    errorMessage: null,
  },
  reducers: {
    SavePaymentStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = '';
    },
    SavePaymentSuccess: (state, action) => {
      state.paymentPlan = action.payload;
      state.isFetching = false;
      state.error = false;
      state.errorMessage = '';
    },
    SavePaymentFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload;
    },
    userInfoAndSelectedPlanStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = '';
    },
    userInfoAndSelectedPlanSuccess: (state, action) => {
      state.isFetching = false;
      state.userInfoAndSelectedPlan = action.payload;
      state.error = false;
      state.errorMessage = '';
    },
    userInfoAndSelectedPlanFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload;
    },
    updateFinalUserStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = '';
    },
    updateFinalUserSuccess: (state, action) => {
      state.isFetching = false;
      state.finalUser = action.payload;
      state.error = false;
      state.errorMessage = '';
    },
    updateFinalUserFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload;
    },
    pingStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = '';
    },
    pingSuccess: (state) => {
      state.isFetching = false;
      state.error = false;
      state.errorMessage = '';
    },
    pingFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  SavePaymentStart,
  SavePaymentSuccess,
  SavePaymentFailure,
  userInfoAndSelectedPlanStart,
  userInfoAndSelectedPlanSuccess,
  userInfoAndSelectedPlanFailure,
  updateFinalUserStart,
  updateFinalUserSuccess,
  updateFinalUserFailure,
  pingStart,
  pingSuccess,
  pingFailure,
} = PaymentRedux.actions;

export default PaymentRedux.reducer;
