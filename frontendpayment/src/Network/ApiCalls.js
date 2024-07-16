import {paymentRequests} from "./AxiosMethods";
import axios from 'axios';
import {SavePaymentStart, SavePaymentSuccess} from "../redux/PaymentRedux";

const {
    userInfoAndSelectedPlanStart,
    userInfoAndSelectedPlanSuccess,
    userInfoAndSelectedPlanFailure
} = require("../redux/PaymentRedux");


export const getPaymentDetails = async (dispatch, userId) => {
    dispatch(userInfoAndSelectedPlanStart());
    try {
        const res = await paymentRequests.get("/paymentDetails", {params: {userId}});
        dispatch(userInfoAndSelectedPlanSuccess(res.data));
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            dispatch(userInfoAndSelectedPlanFailure(error.response.data));
        } else {
            dispatch(userInfoAndSelectedPlanFailure({error: "An unexpected error occurred"}));
        }
    }
}

export const saveFinalPayment = async (dispatch, {finalUser, finalPlan, paymentMethod, transactionId}) => {
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
            imageUrl: finalUser.imageUrl,
            createdAt: finalUser.createdAt,
            updatedAt: finalUser.updatedAt
        },
        finalPlan: {
            id: finalPlan.id,
            name: finalPlan.name,
            price: finalPlan.price,
            interval: finalPlan.interval,
            description: finalPlan.description
        },
        paymentMethod,
        transactionId
    };

    dispatch(SavePaymentStart());
    try {
        const res = await paymentRequests.post("/submitPayment", {finalPayment});
        dispatch(SavePaymentSuccess(res.data));
        console.log(res.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            dispatch(userInfoAndSelectedPlanFailure(error.response.data));
        } else {
            dispatch(userInfoAndSelectedPlanFailure({error: "An unexpected error occurred"}));
        }
    }
};

