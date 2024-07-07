import {createSlice} from "@reduxjs/toolkit";

export const PaymentRedux = createSlice({
    name: "payment",
    initialState: {
        paymentPlan: {},
        isFetching: false,
        error: null,
        errorMessage: null,
    },

    reducers: {
        getPaymentStart: (state) => {
            state.isFetching = true;
            state.error = false;
            state.errorMessage = "";
        },
        getPaymentSuccess: (state) => {
            state.isFetching = false;
        },
        getPaymentFailure: (state, action) => {
            state.isFetching = false;
            state.error = true;
            state.errorMessage = action.payload;
        },
    },
});

export const {
    getPaymentStart,
    getPaymentSuccess,
    getPaymentFailure,
} = PaymentRedux.actions;

export default PaymentRedux.reducer;