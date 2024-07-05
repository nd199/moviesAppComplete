import {createSlice} from "@reduxjs/toolkit";

export const PaymentRedux = createSlice({
    name: "payment",
    initialState: {
        paymentPlan: {},
        fetching: false,
        error: null,
        errorMessage: null,
    },

    reducers: {
        fetchPlanStart: (state, action) => {
            state.fetching = true;
            state.error = false;
        },
        fetchPlanSuccess: (state, action) => {
            state.fetching = false;
            state.paymentPlan = action.payload;
        },
        fetchPlanFailure: (state, action) => {
            state.fetching = false;
            state.error = true;
            state.errorMessage = action.payload;
        }
    }
})