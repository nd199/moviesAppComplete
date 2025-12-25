import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const savePayment = createAsyncThunk(
  'payment/savePayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/submitPayment', paymentData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error saving payment');
    }
  }
);

export const fetchUserInfoAndPlan = createAsyncThunk(
  'payment/fetchUserInfoAndPlan',
  async (userEmail, { rejectWithValue }) => {
    try {
      const response = await axios.get('/paymentDetails', { params: { userId: userEmail } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error fetching user info');
    }
  }
);

export const updateFinalUser = createAsyncThunk(
  'payment/updateFinalUser',
  async (finalUser, { rejectWithValue }) => {
    try {
      const response = await axios.post('/updateFinalUser', { finalUser });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error updating final user');
    }
  }
);

export const PaymentRedux = createSlice({
  name: 'payment',
  initialState: {
    paymentPlan: {},
    userInfoAndSelectedPlan: {},
    finalUser: {},
    isFetching: false,
    error: null,
  },
  reducers: {
    ping: (state) => {
      state.isFetching = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(savePayment.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(savePayment.fulfilled, (state, action) => {
        state.paymentPlan = action.payload;
        state.isFetching = false;
      })
      .addCase(savePayment.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(fetchUserInfoAndPlan.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchUserInfoAndPlan.fulfilled, (state, action) => {
        state.userInfoAndSelectedPlan = action.payload;
        state.isFetching = false;
      })
      .addCase(fetchUserInfoAndPlan.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(updateFinalUser.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(updateFinalUser.fulfilled, (state, action) => {
        state.finalUser = action.payload;
        state.isFetching = false;
      })
      .addCase(updateFinalUser.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      });
  },
});

export const { ping } = PaymentRedux.actions;

export default PaymentRedux.reducer;