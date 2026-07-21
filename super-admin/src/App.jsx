import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getRefreshToken, setAccessToken, setRefreshToken, clearAuth } from './authStore';
import { getBaseURL } from './config';
import SuperAdminLogin from './pages/SuperAdminLogin';
import Dashboard from './pages/Dashboard';
import InviteAdmin from './pages/InviteAdmin';
import AdminsList from './pages/AdminsList';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get(`${getBaseURL()}/api/v1/ping`, { timeout: 5000 });
        setServerStatus('up');
      } catch {
        setServerStatus('down');
      }
    };

    checkServer();

    const rt = getRefreshToken();
    if (rt) {
      axios.post(`${getBaseURL()}/api/v1/auth/refresh-token`, { refreshToken: rt })
        .then(res => {
          setAccessToken(res.data.accessToken);
          if (res.data.refreshToken) setRefreshToken(res.data.refreshToken);
        })
        .catch(() => clearAuth());
    }
  }, []);

  if (serverStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm font-medium">Connecting to server...</p>
        </div>
      </div>
    );
  }

  if (serverStatus === 'down') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Server Unavailable</h2>
          <p className="text-gray-500 text-sm mb-6">Cannot connect to the backend server.</p>
          <button onClick={() => setServerStatus('checking')}
            className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/super-admin" element={<Dashboard />} />
          <Route path="/super-admin/invite" element={<InviteAdmin />} />
          <Route path="/super-admin/admins" element={<AdminsList />} />
        </Route>
        <Route path="*" element={<Navigate to="/super-admin" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
