import axios from "axios";

export const paymentRequest = axios.create({
  baseURL: "https://movie-payment.onrender.com",
});

export const springRequest = axios.create({
  baseURL: "https://movieticket-api.onrender.com",
});
