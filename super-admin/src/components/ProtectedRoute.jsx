import { getAccessToken, getRefreshToken } from '../authStore';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken && !refreshToken) {
    return <Navigate to="/super-admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
