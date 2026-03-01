                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import axios from 'axios';
import Fallback from './Utils/FallBackPage.jsx';
import ServerConnection from './Utils/ServerConnection.jsx';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminLayout from './layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import UserList from './pages/UserList';
import NewUser from './pages/NewUser';
import UserEdit from './pages/UserEdit';
import MovieList from './pages/MovieList';
import NewMovie from './pages/NewMovie';
import MovieEdit from './pages/MovieEdit';
import AdminList from './pages/AdminList';
import NewAdmin from './pages/NewAdmin';
import AdminEdit from './pages/AdminEdit';
import SetPassword from './pages/SetPassword';
import Settings from './pages/Settings';

function AppWithHealthCheck() {
  const [serverStatus, setServerStatus] = useState('checking');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        // Use same environment detection as movies-user
        const isLocal = () => {
          return window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1' || 
                 window.location.hostname === '';
        };

        const getBaseURL = () => {
          // If VITE_API_URL is set AND we're not local, use it
          if (import.meta.env.VITE_API_URL && !isLocal()) {
            return import.meta.env.VITE_API_URL;
          }
          // Default to localhost for local development
          return "http://localhost:8080";
        };

        const baseURL = getBaseURL();
        const url = baseURL.includes('/api/v1') ? `${baseURL}/ping` : `${baseURL}/api/v1/ping`;
        
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
    return <Fallback retryCount={retryCount} onRetry={() => setServerStatus('checking')} />;
  }

  return <AppWithRoutes />;
}

function AppWithRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<NewUser />} />
        <Route path="/users/edit/:id" element={<UserEdit />} />

        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/new" element={<NewMovie />} />
        <Route path="/movies/edit/:id" element={<MovieEdit />} />

        <Route path="/admins" element={<AdminList />} />
        <Route path="/admins/new" element={<NewAdmin />} />
        <Route path="/admins/edit/:id" element={<AdminEdit />} />

        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      <Route path="/set-password" element={<SetPassword />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppWithHealthCheck />
      </Router>
      <Toaster position="top-right" />
    </Provider>
  );
}

export default App;
