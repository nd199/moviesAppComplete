import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await authAPI.checkAuth();
        setIsLoading(false);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/super-admin/login');
        } else {
          console.error('Authentication check failed:', error);
          navigate('/super-admin/login');
        }
      }
    };

    checkAuthentication();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
