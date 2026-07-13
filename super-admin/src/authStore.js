let accessToken = null;

export const setAccessToken = (token) => { accessToken = token; };
export const getAccessToken = () => accessToken;
export const clearAuth = () => { accessToken = null; localStorage.removeItem("refreshToken"); };
export const setRefreshToken = (token) => { localStorage.setItem("refreshToken", token); };
export const getRefreshToken = () => localStorage.getItem("refreshToken");
