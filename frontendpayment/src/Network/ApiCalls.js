import { paymentRequest, springRequest } from "./AxiosMethods";

export const savePaymentApi = (payload) =>
  paymentRequest.post("/payments", payload);

export const getPaymentDetailsApi = (tokenId) =>
  paymentRequest.get(`/api/payment/intent?token=${tokenId}`);

export const updateFinalUserApi = (finalUser) =>
  paymentRequest.put(`/users/${finalUser._id}`, finalUser);

export const pingSpringApi = (email) =>
  springRequest.post("https://movieticket-api.onrender.com/", { email });
