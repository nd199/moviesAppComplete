import {paymentRequests} from "./AxiosMethods";
import axios from 'axios';

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

