import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getRefreshToken, setAccessToken, clearAuth } from './authStore';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminInvite from './pages/SuperAdminInvite';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Fallback from './Utils/FallBackPage.jsx';
import ServerConnection from './Utils/ServerConnection.jsx';

function AppWithHealthCheck() {
  const [serverStatus, setServerStatus] = useState('checking');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const isLocal = () => {
          return (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === ''
          );
        };

        const getBaseURL = () => {
          if (import.meta.env.VITE_API_URL && !isLocal()) {
            return import.meta.env.VITE_API_URL;
          }
          return 'http://localhost:8080';
        };

        const baseURL = getBaseURL();
        const url = baseURL.includes('/api/v1')
          ? `${baseURL}/ping`
          : `${baseURL}/api/v1/ping`;

        await axios.get(url, {
          timeout: 5000,
        });
        setServerStatus('up');
      } catch (error) {
        console.warn('Backend health check failed:', error.message);
        setServerStatus('down');
      }
    };

    checkServerHealth();

    let retryInterval;
    if (serverStatus === 'down' && retryCount < 5) {
      retryInterval = setInterval(() => {
        setRetryCount(prev => prev + 1);
        checkServerHealth();
      }, 10000);
    }

    return () => {
      if (retryInterval) clearInterval(retryInterval);
    };
  }, [serverStatus, retryCount]);

  if (serverStatus === 'checking') {
    return <ServerConnection />;
  }

  if (serverStatus === 'down') {
    return (
      <Fallback
        retryCount={retryCount}
        onRetry={() => setServerStatus('checking')}
      />
    );
  }

  return <AppWithRoutes />;
}

function AppWithRoutes() {
  useEffect(() => {
    // Try to refresh token on app startup if refresh token exists
    const refreshToken = getRefreshToken();
    
    if (refreshToken) {
      const isLocal = () => {
        return (
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname === ''
        );
      };

      const getBaseURL = () => {
        if (import.meta.env.VITE_API_URL && !isLocal()) {
          return import.meta.env.VITE_API_URL;
        }
        return 'http://localhost:8080';
      };
      
      axios.post(`${getBaseURL()}/api/v1/auth/refresh-token`, {
        refreshToken
      })
      .then(res => {
        setAccessToken(res.data.accessToken);
        
        // Update refresh token if rotation is enabled
        if (res.data.refreshToken) {
          localStorage.setItem("refreshToken", res.data.refreshToken);
        }
      })
      .catch(() => {
        // Refresh token invalid, clear auth
        clearAuth();
      });
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/super-admin/login" element={
          <>
            {console.log("🎯 Rendering login route")}
            <SuperAdminLogin />
          </>
        } />
        <Route path="/super-admin/invite" element={
          <>
            {console.log("🎯 Rendering invite route with ProtectedRoute")}
            <ProtectedRoute>
              <SuperAdminInvite />
            </ProtectedRoute>
          </>
        } />
        <Route path="/" element={<Navigate to="/super-admin/invite" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

function App() {
  return <AppWithHealthCheck />;
}

export default App;
