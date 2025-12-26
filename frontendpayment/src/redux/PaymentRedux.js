import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getPaymentDetailsApi,
  pingSpringApi,
  savePaymentApi,
  updateFinalUserApi,
} from "../Network/ApiCalls";

export const fetchUserInfoAndPlan = createAsyncThunk(
  "payment/fetchDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await getPaymentDetailsApi(userId);
      return res.data;
    } catch {
      return rejectWithValue("Failed to fetch payment details");
    }
  }
);

export const savePayment = createAsyncThunk(
  "payment/save",
  async (
    { finalUser, finalPlan, paymentMethod, transactionId },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        finalUser: {
          _id: finalUser._id,
          name: finalUser.name,
          email: finalUser.email,
          phoneNumber: finalUser.phoneNumber,
          address: finalUser.address,
          isSubscribed: true,
        },
        finalPlan: {
          id: finalPlan.id,
          name: finalPlan.name,
          price: finalPlan.price,
          interval: finalPlan.interval,
        },
        paymentMethod,
        transactionId,
      };

      const res = await savePaymentApi(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Payment failed");
    }
  }
);

/* UPDATE USER */
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

/* PING SPRING */
export const pingSpring = createAsyncThunk("payment/ping", async (email) => {
  await pingSpringApi(email);
});

const PaymentRedux = createSlice({
  name: "payment",
  initialState: {
    userInfoAndSelectedPlan: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (a) => a.type.startsWith("payment/") && a.type.endsWith("/pending"),
        (s) => {
          s.loading = true;
          s.error = null;
        }
      )
      .addMatcher(
        (a) => a.type.startsWith("payment/") && a.type.endsWith("/fulfilled"),
        (s, a) => {
          if (a.type.includes("fetchDetails")) {
            s.userInfoAndSelectedPlan = a.payload;
          }
          s.loading = false;
        }
      )
      .addMatcher(
        (a) => a.type.startsWith("payment/") && a.type.endsWith("/rejected"),
        (s, a) => {
          s.loading = false;
          s.error = a.payload;
        }
      );
  },
});

export default PaymentRedux.reducer;
