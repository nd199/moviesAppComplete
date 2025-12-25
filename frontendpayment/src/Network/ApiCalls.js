import axios from "axios";
import {
  fetchUserInfoAndPlan,
  ping,
  savePayment,
  updateFinalUser as updateFinalUserThunk,
} from "../redux/PaymentRedux";

export const saveFinalPayment = async (
  dispatch,
  { finalUser, finalPlan, paymentMethod, transactionId }
) => {
  const finalPayment = {
    finalUser: {
      _id: finalUser._id,
      id: finalUser.id,
      name: finalUser.name,
      email: finalUser.email,
      roles: finalUser.roles,
      phoneNumber: finalUser.phoneNumber,
      movies: finalUser.movies,
      isEmailVerified: finalUser.isEmailVerified,
      address: finalUser.address,
      isLogged: finalUser.isLogged,
      isRegistered: finalUser.isRegistered,
      isSubscribed: finalUser.isSubscribed,
      imageUrl: finalUser.imageUrl,
      createdAt: finalUser.createdAt,
      updatedAt: finalUser.updatedAt,
    },
    finalPlan: {
      id: finalPlan.id,
      name: finalPlan.name,
      price: finalPlan.price,
      interval: finalPlan.interval,
      description: finalPlan.description,
    },
    paymentMethod,
    transactionId,
  };

  try {
    return await dispatch(savePayment(finalPayment)).unwrap();
  } catch (error) {
    const message =
      error?.message || error?.response?.data?.message || "Payment save failed";
    console.error(message);
    throw new Error(message);
  }
};

export const getPaymentDetails = async (dispatch, email) => {
  try {
    return await dispatch(fetchUserInfoAndPlan(email)).unwrap();
  } catch (error) {
    const message =
      error?.message ||
      error?.response?.data?.message ||
      "Failed to fetch payment details";
    console.error(message);
    throw new Error(message);
  }
};

export const updateFinalUser = async (dispatch, finalUser) => {
  try {
    return await dispatch(updateFinalUserThunk(finalUser)).unwrap();
  } catch (error) {
    const message =
      error?.message ||
      error?.response?.data?.message ||
      "Failed to update user";
    console.error(message);
    throw new Error(message);
  }
};

export const pingSpring = async (dispatch, email) => {
  try {
    const res = await axios.post(`https://movieticket-api.onrender.com/ping`, {
      email,
    });
    dispatch(ping(res.data));
    return res.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || "Spring service unavailable";
    console.error(message);
    throw new Error(message);
  }
};
