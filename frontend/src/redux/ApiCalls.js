import axios from "axios";
import {authRequest, publicRequest, userRequest} from "../AxiosMethods";
import {
    fetchMoviesStart,
    fetchMoviesSuccess,
    fetchMoviesFailure,
    fetchShowsStart,
    fetchShowsSuccess,
    fetchShowsFailure,
} from "./ProductsRedux";
import {
    fetchUserByEmailFailure,
    fetchUserByEmailStart,
    fetchUserByEmailSuccess,
    forgotPasswordFailure,
    forgotPasswordStart,
    forgotPasswordSuccess,
    loginFailure,
    loginStart,
    loginSuccess,
    registerFailure,
    registerStart,
    registerSuccess,
    validateOtpFailure,
    validateOtpStart,
    validateOtpSuccess,
    verifyEmailFailure,
    verifyEmailStart,
    verifyEmailSuccess,
} from "./userSlice";

import {
    pushToPaymentStart,
    pushToPaymentSuccess,
    pushToPaymentFailure,
} from "./PaymentRedux";

export const register = async (dispatch, customerInfo) => {
    dispatch(registerStart());
    try {
        const res = await authRequest.post("/customers", customerInfo);
        const {data: customerDTO, headers} = res;
        dispatch(registerSuccess(customerDTO));
        if (registerSuccess) {
            localStorage.setItem(
                "persist:root",
                JSON.stringify({
                    user: JSON.stringify({
                        currentUser: customerDTO,
                    }),
                })
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            dispatch(registerFailure(error.response.data));
            console.log(error.response);
            throw error;
        } else {
            dispatch(registerFailure({error: "Failed to Register Try Again !.."}));
            throw new Error("Failed to Register Try Again !..");
        }
    }
};

export const forgotPassword = async (dispatch, data) => {
    dispatch(forgotPasswordStart());
    try {
        const res = await publicRequest.put("/customers/${customerId}", data);
        dispatch(forgotPasswordSuccess(res.data));
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            dispatch(forgotPasswordFailure(error.response.data));
            throw error;
        } else {
            dispatch(
                forgotPasswordFailure({error: "an unexpected error occurred"})
            );
            throw new Error("An unexpected error occurred");
        }
    }
};

// Login
export const login = async (dispatch, userInfo) => {
    dispatch(loginStart());
    try {
        const res = await authRequest.post("/login", userInfo);
        const {data: customerDTO, headers} = res;
        dispatch(loginSuccess(customerDTO));
        localStorage.setItem(
            "persist:root",
            JSON.stringify({
                user: JSON.stringify({
                    currentUser: customerDTO,
                }),
            })
        );
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            dispatch(loginFailure(error.response.data));
            throw error;
        } else {
            dispatch(loginFailure({error: "An unexpected error occurred"}));
            throw new Error("An unexpected error occurred");
        }
    }
};

// Fetch Products
export const fetchMovies = async (dispatch) => {
    dispatch(fetchMoviesStart());
    try {
        const res = await publicRequest.get("/movies");
        dispatch(fetchMoviesSuccess(res.data));
        console.log(res.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            dispatch(fetchMoviesFailure(error.response.data));
        } else {
            dispatch(fetchMoviesFailure({error: "An unexpected error occurred"}));
        }
    }
};

// Fetch Shows
export const fetchShows = async (dispatch) => {
    dispatch(fetchShowsStart());
    try {
        const res = await publicRequest.get("/shows");
        dispatch(fetchShowsSuccess(res.data));
        console.log(res.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            dispatch(fetchShowsFailure(error.response.data));
        } else {
            dispatch(fetchShowsFailure({error: "An unexpected error occurred"}));
        }
    }
};

export const fetchUserByEmail = async (email, dispatch) => {
    dispatch(fetchUserByEmailStart());
    try {
        const res = await userRequest().get(`/customers/email`, email);
        dispatch(fetchUserByEmailSuccess(res.data));
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            dispatch(fetchUserByEmailFailure(error.response.data.message));
        } else {
            dispatch(fetchUserByEmailFailure("An unexpected error occurred"));
        }
        return null;
    }
};

export const verifyEmail = async (dispatch, email) => {
    dispatch(verifyEmailStart());
    try {
        const res = await publicRequest.post("/verify/email", email);
        dispatch(verifyEmailSuccess(res.data.message));
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            dispatch(verifyEmailFailure(error.response));
            throw error;
        } else {
            dispatch(verifyEmailFailure("An unexpected error occurred"));
        }
        return null;
    }
};

export const validateOtp = async (dispatch, validateInfo) => {
    dispatch(validateOtpStart());
    try {
        const res = await publicRequest.post("/validate/Otp", validateInfo);
        dispatch(validateOtpSuccess(res.data));
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            dispatch(validateOtpFailure(error.response.data));
            throw error;
        } else {
            dispatch(validateOtpFailure("An unexpected error occurred"));
        }
        return null;
    }
};

export const pushToPaymentModule = async (dispatch, userPaymentInfo) => {
    dispatch(pushToPaymentStart());
    try {
        console.log('Sending payment info:', userPaymentInfo); // Log the payload
        const res = await axios.post('http://localhost:3008/payment', userPaymentInfo);
        console.log('Response from server:', res.data); // Log the response
        dispatch(pushToPaymentSuccess(res.data));
    } catch (paymentError) {
        console.error('Error during payment:', paymentError); // Log the full error
        if (axios.isAxiosError(paymentError) && paymentError.response) {
            console.error('Server response error:', paymentError.response.data); // Log the response data if available
            dispatch(pushToPaymentFailure(paymentError.response.data));
        } else {
            console.error('Unexpected error:', paymentError.message); // Log the error message
            dispatch(pushToPaymentFailure("An unexpected error occurred"));
        }
    }
};