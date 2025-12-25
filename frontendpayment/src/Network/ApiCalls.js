import { paymentRequest, springRequest } from "./AxiosMethods";

export const savePaymentApi = (data) =>
  paymentRequest.post("/submitPayment", { finalPayment: data });

export const getPaymentDetailsApi = (email) =>
  paymentRequest.get(`/paymentDetails?email=${email}`);

export const updateFinalUserApi = (finalUser) =>
  paymentRequest.post("/updateFinalUser", { finalUser });

export const pingSpringApi = (email) =>
  springRequest.post("/pingSpring", { email });
