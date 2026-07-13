import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getPaymentDetailsApi,
  pingSpringApi,
  savePaymentApi,
  updateFinalUserApi,
} from '../Network/ApiCalls';

export const fetchUserInfoAndPlan = createAsyncThunk(
  'payment/fetchDetails',
  async (email, { rejectWithValue }) => {
    try {
      const res = await getPaymentDetailsApi(email);
      return res.data;
    } catch {
      return rejectWithValue('Failed to fetch payment details');
    }
  },
);

export const savePayment = createAsyncThunk(
  'payment/save',
  async (
    { finalUser, finalPlan, paymentMethod, transactionId },
    { rejectWithValue },
  ) => {
    try {
      const payload = {
        finalPayment: {
          finalUser: {
            email: finalUser.email,
            isSubscribed: true,
          },
          finalPlan: {
            id: finalPlan.id,
          },
          paymentMethod,
          transactionId,
        },
      };

      const res = await savePaymentApi(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Payment failed');
    }
  },
);

export const updateFinalUser = createAsyncThunk(
  'payment/updateUser',
  async (finalUser, { rejectWithValue }) => {
    try {
      const res = await updateFinalUserApi(finalUser);
      return res.data;
    } catch {
      return rejectWithValue('Failed to update user');
    }
  },
);

export const pingSpring = createAsyncThunk('payment/ping', async email => {
  await pingSpringApi(email);
});

const PaymentRedux = createSlice({
  name: 'payment',
  initialState: {
    userInfoAndSelectedPlan: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        a => a.type.startsWith('payment/') && a.type.endsWith('/pending'),
        s => {
          s.loading = true;
          s.error = null;
        },
      )
      .addMatcher(
        a => a.type.startsWith('payment/') && a.type.endsWith('/fulfilled'),
        (s, a) => {
          if (a.type.includes('fetchDetails')) {
            s.userInfoAndSelectedPlan = a.payload;
          }
          s.loading = false;
        },
      )
      .addMatcher(
        a => a.type.startsWith('payment/') && a.type.endsWith('/rejected'),
        (s, a) => {
          s.loading = false;
          s.error = a.payload;
        },
      );
  },
});

export default PaymentRedux.reducer;

export const setPaymentPlan = plan => ({
  type: 'payment/setPlan',
  payload: plan,
});
