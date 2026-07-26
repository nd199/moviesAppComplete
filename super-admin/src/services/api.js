import axios from "axios";
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearAuth, getCsrfToken } from "../authStore";
import { getBaseURL } from "../config";

const api = axios.create({ baseURL: getBaseURL(), timeout: 15000, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const csrf = getCsrfToken();
  if (csrf && ['post', 'put', 'delete', 'patch'].includes(config.method)) {
    config.headers['X-CSRF-TOKEN'] = csrf;
  }

  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const rt = getRefreshToken();
    if (!rt) { clearAuth(); window.location.href = '/super-admin/login'; return Promise.reject(error); }
    try {
      const res = await axios.post(`${getBaseURL()}/api/v1/auth/refresh-token`, { refreshToken: rt });
      setAccessToken(res.data.accessToken);
      if (res.data.refreshToken) setRefreshToken(res.data.refreshToken);
      originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearAuth();
      if (window.location.pathname !== '/super-admin/login') window.location.href = '/super-admin/login';
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
});

export default api;

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/api/v1/auth/login', credentials);
    const { accessToken, refreshToken } = response.data;
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    return response.data;
  },
  logout: async () => {
    try { await api.post('/api/v1/auth/logout', { refreshToken: getRefreshToken() }); } catch (e) {}
    clearAuth();
  },
};

export const systemAPI = {
  getCustomers: () => api.get('/api/v1/customers'),
  getAdmins: () => api.get('/api/v1/admins'),
  inviteAdmin: (data) => api.post('/api/v1/system/superadmin/invite', data),
  resendInvite: (data) => api.post('/api/v1/system/superadmin/resend-invite', data),
  getHealth: () => api.get('/api/v1/ping'),
};
