import { paymentRequests, springRequest } from './AxiosMethods';
import axios from 'axios';
import {
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
} from '../redux/PaymentRedux';

export const updateFinalUser = async (dispatch, finalUser) => {
  dispatch(updateFinalUserStart());
  try {
    const res = await paymentRequests.post('/updateFinalUser', { finalUser });
    dispatch(updateFinalUserSuccess(res.data));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(updateFinalUserFailure(error.response.data));
    } else {
      dispatch(updateFinalUserFailure({ error: 'An unexpected error occurred' }));
    }
  }
};

export const pingSpring = async (dispatch, email) => {
  dispatch(pingStart());
  try {
    const res = await springRequest.post('/pingSpring', { email });
    dispatch(pingSuccess(res.data));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(pingFailure(error.response.data));
    } else {
      dispatch(pingFailure({ error: 'An unexpected error occurred' }));
    }
  }
};

export const getPaymentDetails = async (dispatch, userId) => {
  dispatch(userInfoAndSelectedPlanStart());
  try {
    const res = await paymentRequests.get('/paymentDetails', { params: { userId } });
    dispatch(userInfoAndSelectedPlanSuccess(res.data));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(userInfoAndSelectedPlanFailure(error.response.data));
    } else {
      dispatch(userInfoAndSelectedPlanFailure({ error: 'An unexpected error occurred' }));
    }
  }
};

export const saveFinalPayment = async (dispatch, { finalUser, finalPlan, paymentMethod, transactionId }) => {
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
  dispatch(SavePaymentStart());
  try {
    const res = await paymentRequests.post('/submitPayment', { finalPayment });
    dispatch(SavePaymentSuccess(res.data));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(SavePaymentFailure(error.response.data));
    } else {
      dispatch(SavePaymentFailure({ error: 'An unexpected error occurred' }));
    }
  }
};
