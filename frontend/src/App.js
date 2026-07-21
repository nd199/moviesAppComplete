import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes, Navigate, useLocation } from "react-router-dom";
import axios from "axios";

import { setAuthStatus, logout } from "./redux/userSlice";
import { persistor } from "./redux/store";
import { fetchCurrentUserDetails } from "./Network/ApiCalls";
import { getRefreshToken, getAccessToken, clearAuth, setAccessToken, setRefreshToken } from "./authStore";

import Home from "./Pages/User/Home";
import LoginForm from "./Pages/User/LoginForm";
import RegistrationForm from "./Pages/User/RegistrationForm";
import ForgotPassword from "./Pages/User/ForgotPassword";
import NotFound from "./Pages/User/NotFound";
import Detail from "./Pages/User/Detail";
import UserSettings from "./Pages/User/Settings";
import Subscription from "./Pages/User/Subscription";
import EmailVerification from "./Pages/User/EmailVerification";
import VideoFullScreen from "./Pages/User/VideoFullScreen";
import AboutUs from "./Pages/User/AboutUs";
import Movies from "./Pages/User/Movies";
import Shows from "./Pages/User/Shows";
import Watchlist from "./Pages/User/Watchlist";
import Profile from "./Pages/User/Profile";
import NavBar from "./Components/NavBar";
import Sidebar from "./Components/Sidebar";

import PaymentCheckout from "./Pages/Payment/PaymentCheckout";
import Success from "./Pages/Payment/Success";

import AdminLogin from "./Pages/Admin/AdminLogin";
import ContentManagerLogin from "./Pages/Admin/ContentManagerLogin";
import Dashboard from "./Pages/Admin/Dashboard";
import UserList from "./Pages/Admin/UserList";
import NewUser from "./Pages/Admin/NewUser";
import UserEdit from "./Pages/Admin/UserEdit";
import MovieList from "./Pages/Admin/MovieList";
import NewMovie from "./Pages/Admin/NewMovie";
import MovieEdit from "./Pages/Admin/MovieEdit";
import ShowList from "./Pages/Admin/ShowList";
import NewShow from "./Pages/Admin/NewShow";
import ShowEdit from "./Pages/Admin/ShowEdit";
import AdminList from "./Pages/Admin/AdminList";
import NewAdmin from "./Pages/Admin/NewAdmin";
import AdminEdit from "./Pages/Admin/AdminEdit";
import ContentManagerList from "./Pages/Admin/ContentManagerList";
import NewContentManager from "./Pages/Admin/NewContentManager";
import ContentManagerEdit from "./Pages/Admin/ContentManagerEdit";
import Settings from "./Pages/Admin/Settings";
import SetPassword from "./Pages/Admin/SetPassword";

import AdminLayout from "./Components/Admin/AdminLayout";
import AdminProtectedRoute from "./Components/Admin/AdminProtectedRoute";

import Fallback from "./Utils/FallBackPage";
import ServerConnection from "./Utils/ServerConnection";

const isLocalHost = () =>
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const getBaseURL = () => {
  if (isLocalHost()) return 'http://localhost:8080';
  return process.env.REACT_APP_API_URL || 'https://nmoviesapi.duckdns.org';
};

const API_URL = getBaseURL();

function AppWithHealthCheck() {
  const [serverStatus, setServerStatus] = useState('checking');
  const [retryCount, setRetryCount] = useState(0);

  const checkServerHealth = useCallback(async () => {
    try {
      await axios.get(`${API_URL}/api/v1/ping`, { timeout: 5000 });
      setServerStatus('up');
    } catch (error) {
      console.warn('Backend health check failed:', error.message);
      setServerStatus('down');
    }
  }, []);

  useEffect(() => {
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
  }, [serverStatus, retryCount, checkServerHealth]);

  if (serverStatus === 'checking') {
    return <ServerConnection />;
  }
  
  if (serverStatus === 'down') {
    return <Fallback retryCount={retryCount} onRetry={() => setServerStatus('checking')} />;
  }

  return <AppWithNavigation />;
}

function AppWithNavigation() {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = getRefreshToken();
      const accessToken = getAccessToken();

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_URL}/api/v1/auth/refresh-token`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

          setAccessToken(newAccessToken);
          if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
          }

          dispatch(setAuthStatus('authenticated'));
          await fetchCurrentUserDetails(dispatch);
        } catch (error) {
          console.log('Token refresh failed:', error.message);
          clearAuth();
          dispatch(logout());
          persistor.purge();
        }
      }
      else if (accessToken) {
        try {
          await fetchCurrentUserDetails(dispatch);
          dispatch(setAuthStatus('authenticated'));
        } catch (error) {
          console.log('Access token invalid:', error.message);
          clearAuth();
          dispatch(logout());
          persistor.purge();
        }
      }
      else {
        dispatch(setAuthStatus('unauthenticated'));
      }
    };

    initializeAuth();

  }, [dispatch]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'accessToken' && !e.newValue) {
        clearAuth();
        dispatch(logout());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [dispatch]);

  useEffect(() => {
    window.paymentSuccess = () => {
      fetchCurrentUserDetails(dispatch);
    };

    return () => {
      window.paymentSuccess = null;
    };
  }, [dispatch]);


  return (
    <Router>
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </Router>
  );
}

function Layout({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isVideoPage = location.pathname.startsWith('/video');

  // Admin layout
  if (isAdminRoute) {
    return (
      <Routes>
        {/* Admin login pages (no layout shell) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/cm-login" element={<ContentManagerLogin />} />
        <Route path="/admin/set-password" element={<SetPassword />} />

        {/* Admin pages with layout */}
        <Route path="/admin/*" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/new" element={<NewUser />} />
          <Route path="users/edit/:id" element={<UserEdit />} />
          <Route path="movies" element={<MovieList />} />
          <Route path="movies/new" element={<NewMovie />} />
          <Route path="movies/edit/:id" element={<MovieEdit />} />
          <Route path="shows" element={<ShowList />} />
          <Route path="shows/new" element={<NewShow />} />
          <Route path="shows/edit/:id" element={<ShowEdit />} />
          <Route path="admins" element={<AdminList />} />
          <Route path="admins/new" element={<NewAdmin />} />
          <Route path="admins/edit/:id" element={<AdminEdit />} />
          <Route path="content-managers" element={<ContentManagerList />} />
          <Route path="content-managers/new" element={<NewContentManager />} />
          <Route path="content-managers/edit/:id" element={<ContentManagerEdit />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Catch all for admin */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    );
  }

  // User layout
  return (
    <>
      {!isVideoPage && <NavBar onMenuClick={() => setSidebarOpen(true)} />}
      {!isVideoPage && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/server-status" element={<ServerConnection />} />
        <Route path="/fallback" element={<Fallback />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/movie/:id" element={<Detail />} />
        <Route path="/show/:id" element={<Detail />} />

        {/* Protected Routes - Require Authentication */}
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/payment" element={<PaymentCheckout />} />
        <Route path="/payment/success" element={<Success />} />
        <Route path="/payment/:userId" element={<PaymentCheckout />} />
        <Route path="/success" element={<Success />} />

        {/* Protected Routes - Require Authentication */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <UserSettings />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Require Subscription */}
        <Route
          path="/subscription"
          element={
            <Subscription />
          }
        />

        <Route
          path="/video/:id"
          element={
            <ProtectedRoute requireSubscription redirectToRegister>
              <VideoFullScreen />
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route path="/registerAdmin" element={<Navigate to="/" replace />} />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

// protected route component

function ProtectedRoute({ 
  children, 
  requireSubscription = false,
  redirectToRegister = false 
}) {
  const authStatus = useSelector(state => state.user.authStatus);
  const currentUser = useSelector(state => state.user.currentUser);

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-[#8892b0] text-sm">Loading...</div>
      </div>
    );
  }

  if (authStatus !== 'authenticated') {
    return (
      <Navigate
        to={redirectToRegister ? "/register" : "/login"}
        replace
      />
    );
  }

  const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN");

  if (requireSubscription && isAdmin) {
    return children;
  }

  if (requireSubscription && !currentUser?.isSubscribed) {
    return <Navigate to="/subscription" replace />;
  }

  return children;
}

export default AppWithHealthCheck;
