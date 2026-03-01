import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // TEMPORARY: Bypass authentication for testing API calls
  return children;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
