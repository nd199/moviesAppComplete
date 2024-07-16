import axios from "axios";

const BASEURL = "http://localhost:3008/";

export const paymentRequests = axios.create({
    baseURL: BASEURL
})
