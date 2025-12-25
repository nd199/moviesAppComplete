import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getPaymentDetailsApi,
  pingSpringApi,
  savePaymentApi,
  updateFinalUserApi,
} from "../Network/ApiCalls";

export const savePayment = createAsyncThunk(
  "payment/save",
  async (data, { rejectWithValue }) => {
    try {
      const res = await savePaymentApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Payment failed");
    }
  }
);

export const fetchUserInfoAndPlan = createAsyncThunk(
  "payment/fetchDetails",
  async (email, { rejectWithValue }) => {
    try {
      const res = await getPaymentDetailsApi(email);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch payment details");
    }
  }
);

export const updateFinalUser = createAsyncThunk(
  "payment/updateUser",
  async (finalUser, { rejectWithValue }) => {
    try {
      const res = await updateFinalUserApi(finalUser);
      return res.data;
    } catch {
      return rejectWithValue("Failed to update user");
    }
  }
);

export const pingSpring = createAsyncThunk("payment/ping", async (email) => {
  await pingSpringApi(email);
});

const PaymentRedux = createSlice({
  name: "payment",
  initialState: {
    userInfoAndSelectedPlan: null,
    isFetching: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfoAndPlan.pending, (s) => {
        s.isFetching = true;
      })
      .addCase(fetchUserInfoAndPlan.fulfilled, (s, a) => {
        s.userInfoAndSelectedPlan = a.payload;
        s.isFetching = false;
      })
      .addCase(fetchUserInfoAndPlan.rejected, (s, a) => {
        s.error = a.payload;
        s.isFetching = false;
      })
      .addCase(savePayment.pending, (s) => {
        s.isFetching = true;
      })
      .addCase(savePayment.fulfilled, (s) => {
        s.isFetching = false;
      })
      .addCase(savePayment.rejected, (s, a) => {
        s.error = a.payload;
        s.isFetching = false;
      });
  },
});

export default PaymentRedux.reducer;
