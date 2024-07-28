import axios from "axios";

const BASEURL = "http://localhost:3008/";
const baseURL = "http://localhost:8080/"

export const paymentRequests = axios.create({
    baseURL: BASEURL
})

export const springRequest = axios.create({
    baseURL: baseURL
})