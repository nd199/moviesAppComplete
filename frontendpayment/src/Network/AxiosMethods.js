import axios from "axios";

const BASEURL = "https://moviesappcomplete.onrender.com/";
const baseURL = "https://movieticket-api.onrender.com"

export const paymentRequests = axios.create({
    baseURL: BASEURL
})

export const springRequest = axios.create({
    baseURL: baseURL
})