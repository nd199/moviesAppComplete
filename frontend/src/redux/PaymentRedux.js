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
        setPaymentPlan: (state, action) => {
            state.paymentPlan = action.payload;
        },
        pushToPaymentStart: (state) => {
            state.isFetching = true;
            state.error = false;
            state.errorMessage = "";
        },
        pushToPaymentSuccess: (state) => {
            state.isFetching = false;
        },
        pushToPaymentFailure: (state, action) => {
            state.isFetching = false;
            state.error = true;
            state.errorMessage = action.payload;
        },
    },
});

export const {
    setPaymentPlan,
    pushToPaymentStart,
    pushToPaymentSuccess,
    pushToPaymentFailure,
} = PaymentRedux.actions;

export default PaymentRedux.reducer;