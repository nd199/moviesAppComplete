import { store, persistor } from '../redux/store';
import { logout } from '../redux/userSlice';
import { clearAuth, getRefreshToken } from '../authStore';
import api from '../AxiosMethods';

export const performLogout = async () => {
  const refreshToken = getRefreshToken();
  clearAuth();
  store.dispatch(logout());
  persistor.purge();
  try {
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
  } catch (e) {}
};
