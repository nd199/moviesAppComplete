import { getAccessToken, getRefreshToken } from '../authStore';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  console.log("🛡️ ProtectedRoute rendered");
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  console.log("🔍 ProtectedRoute token check:", {
    accessToken: !!accessToken,
    refreshToken: !!refreshToken,
    accessTokenLength: accessToken?.length || 0,
    refreshTokenLength: refreshToken?.length || 0
  });

  if (!accessToken && !refreshToken) {
    console.log("❌ ProtectedRoute: No tokens found, redirecting to login");
    return <Navigate to="/super-admin/login" replace />;
  }

  console.log("✅ ProtectedRoute: Tokens found, allowing access");
  return children;
};

export default ProtectedRoute;
