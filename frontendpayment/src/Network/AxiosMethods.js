import axios from "axios";

const BASEURL = "https://movieticket-api.onrender.com/";
const baseURL = "https://moviesappcomplete.onrender.com/"

export const paymentRequests = axios.create({
    baseURL: BASEURL
})

export const springRequest = axios.create({
    baseURL: baseURL
})