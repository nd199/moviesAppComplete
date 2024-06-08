import axios from 'axios';


const base_url = "http://localhost:8080/api/v1";

export const permitAll = axios.create({
    baseURL: base_url,
})

