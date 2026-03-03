import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminInvite from './pages/SuperAdminInvite';
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
  return (
    <Router>
      <Routes>
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route 
          path="/super-admin/invite" 
          element={
            <ProtectedRoute>
              <SuperAdminInvite />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/super-admin/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

function App() {
  return <AppWithHealthCheck />;
}

export default App;
