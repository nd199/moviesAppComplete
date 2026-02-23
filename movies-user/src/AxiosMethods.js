import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api/v1" || "http://localhost:8080/api/v1",
  withCredentials: true,
  timeout: 30000, // Increased from 10000 to 30000 for debugging
});

api.interceptors.request.use(
  (config) => {
    // For HTTP-only cookies, we don't need to manually add the token
    // The browser will automatically include cookies with withCredentials: true
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export const userRequest = () => api;
export const authRequest = () => {
  const baseURL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/v1` : "http://localhost:8080/api/v1";
  return axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 30000, // Increased timeout
  });
};
export const passResetRequest = () => {
  const baseURL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/password-reset` : "http://localhost:8080/api/password-reset";
  return axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 30000, // Increased timeout
  });
};
export const publicRequest = () => api;
export const paymentRequest = () => {
  const baseURL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/v1/payments` : "http://localhost:8080/api/v1/payments";
  return axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 30000, // Increased timeout
  });
};
export const springRequest = () => {
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080";
  return axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 30000, // Increased timeout
  });
};
