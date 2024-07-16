import {createSlice} from "@reduxjs/toolkit";

export const PaymentRedux = createSlice({
    name: "payment",
    initialState: {
        paymentPlan: {},
        userInfoAndSelectedPlan: {},
        isFetching: false,
        error: null,
        errorMessage: null,
    },

    reducers: {
        SavePaymentStart: (state) => {
            state.isFetching = true;
            state.error = false;
            state.errorMessage = "";
        },
        SavePaymentSuccess: (state, action) => {
            state.paymentPlan = action.payload;
            state.isFetching = false;
            state.error = false;
            state.errorMessage = "";
        },
        SavePaymentFailure: (state, action) => {
            state.isFetching = false;
            state.error = true;
            state.errorMessage = action.payload;
        },
        userInfoAndSelectedPlanStart: (state) => {
            state.isFetching = true;
            state.error = false;
            state.errorMessage = "";
        },
        userInfoAndSelectedPlanSuccess: (state, action) => {
            state.isFetching = false;
            state.userInfoAndSelectedPlan = action.payload;
            state.error = false;
            state.errorMessage = "";
        },
        userInfoAndSelectedPlanFailure: (state, action) => {
            state.isFetching = false;
            state.error = true;
            state.errorMessage = action.payload;
        }
    },
});

export const {
    SavePaymentStart, SavePaymentSuccess,
    SavePaymentFailure,
    userInfoAndSelectedPlanStart,
    userInfoAndSelectedPlanSuccess,
    userInfoAndSelectedPlanFailure,
} = PaymentRedux.actions;

export default PaymentRedux.reducer;