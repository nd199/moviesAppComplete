import axios from "axios";

const Base_url = "http://localhost:8080/api/v1";
const BaseAuthUrl = "http://localhost:8080/api/v1/auth";

export const publicRequest = axios.create({
  baseURL: Base_url,
});

export const authRequest = axios.create({
  baseURL: BaseAuthUrl,
});

export const userRequest = () => {
  const persistRoot = localStorage.getItem("persist:root");
  const TOKEN = persistRoot
    ? JSON.parse(JSON.parse(persistRoot).user)?.currentUser.token
    : null;

  return axios.create({
    baseURL: Base_url,
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
};
