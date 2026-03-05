import { getAccessToken } from '../authStore';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/super-admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
