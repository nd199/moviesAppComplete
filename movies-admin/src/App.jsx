import axios from 'axios';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { getRefreshToken, setAccessToken, clearAuth } from './authStore';
import Fallback from './Utils/FallBackPage.jsx';
import ServerConnection from './Utils/ServerConnection.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout.jsx';
import ContentManagerLayout from './layouts/ContentManagerLayout.jsx';
import AdminEdit from './pages/AdminEdit';
import AdminList from './pages/AdminList';
import ContentManagerList from './pages/ContentManagerList';
import ContentManagerLogin from './pages/ContentManagerLogin';
import ContentManagerDashboard from './pages/ContentManagerDashboard';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MovieEdit from './pages/MovieEdit';
import MovieList from './pages/MovieList';
import ShowList from './pages/ShowList';
import ShowEdit from './pages/ShowEdit';
import NewShow from './pages/NewShow';
import NewAdmin from './pages/NewAdmin';
import NewMovie from './pages/NewMovie';
import NewUser from './pages/NewUser';
import NewContentManager from './pages/NewContentManager';
import ContentManagerEdit from './pages/ContentManagerEdit';
import SetPassword from './pages/SetPassword';
import Settings from './pages/Settings';
import UserEdit from './pages/UserEdit';
import UserList from './pages/UserList';
import { store } from './store/store';

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
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/contentManagerLogin" element={<ContentManagerLogin />} />
      {/* Dashboard is now public - accessible without login */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<NewUser />} />
        <Route path="/users/edit/:id" element={<UserEdit />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/new" element={<NewMovie />} />
        <Route path="/movies/edit/:id" element={<MovieEdit />} />
        <Route path="/shows" element={<ShowList />} />
        <Route path="/shows/new" element={<NewShow />} />
        <Route path="/shows/edit/:id" element={<ShowEdit />} />
        <Route path="/admins" element={<AdminList />} />
        <Route path="/admins/new" element={<NewAdmin />} />
        <Route path="/admins/edit/:id" element={<AdminEdit />} />
        <Route path="/contentManagers" element={<ContentManagerList />} />
        <Route path="/contentManagers/new" element={<NewContentManager />} />
        <Route path="/contentManagers/edit/:id" element={<ContentManagerEdit />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Content Manager Routes */}
      <Route
        element={
          <ProtectedRoute>
            <ContentManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/contentManagerDashboard" element={<ContentManagerDashboard />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/new" element={<NewMovie />} />
        <Route path="/movies/edit/:id" element={<MovieEdit />} />
        <Route path="/shows" element={<ShowList />} />
        <Route path="/shows/new" element={<NewShow />} />
        <Route path="/shows/edit/:id" element={<ShowEdit />} />
        <Route path="*" element={<Navigate to="/contentManagerDashboard" replace />} />
      </Route>

      <Route path="/set-password" element={<SetPassword />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    // Try to refresh token on app startup if refresh token exists
    const refreshToken = getRefreshToken();
    
    if (refreshToken) {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = baseURL.endsWith('/api/v1') ? baseURL : `${baseURL}/api/v1`;
      
      axios.post(`${apiURL}/auth/refresh-token`, {
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
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/serverStatus" element={<ServerConnection />} />
          <Route path="/fallback" element={<Fallback />} />
          <Route path="/*" element={<AppWithHealthCheck />} />
        </Routes>
      </Router>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white dark:border-slate-600',
          style: {
            background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#1f2937',
            border: document.documentElement.classList.contains('dark') ? '#475569' : '#e5e7eb',
          }
        }}
      />
    </Provider>
  );
}

export default App;
