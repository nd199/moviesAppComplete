import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes, Navigate, useLocation } from "react-router-dom";
import axios from "axios";


// Redux actions
import { setAuthStatus, setTokens, logout } from "./redux/userSlice";
import { fetchCurrentUserDetails } from "./Network/ApiCalls";

// Auth store
import { getRefreshToken, getAccessToken, clearAuth, setAccessToken, setRefreshToken } from "./authStore";

// Pages
import Home from "./Pages/User/Home";
import LoginForm from "./Pages/User/LoginForm";
import RegistrationForm from "./Pages/User/RegistrationForm";
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

// Admin Pages
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

// Admin Components
import AdminLayout from "./Components/Admin/AdminLayout";
import AdminProtectedRoute from "./Components/Admin/AdminProtectedRoute";

// Utils
import Fallback from "./Utils/FallBackPage";
import ServerConnection from "./Utils/ServerConnection";

// ============================================
// CONFIGURATION
// ============================================

const getBaseURL = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:8080';
};

const isMockMode = process.env.REACT_APP_MOCK_MODE === 'true';
const API_URL = getBaseURL();

// ============================================
// HEALTH CHECK COMPONENT
// ============================================

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
    // Skip health check entirely in mock mode
    if (isMockMode) {
      setServerStatus('up');
      return;
    }

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

// ============================================
// MAIN APP COMPONENT
// ============================================

function AppWithNavigation() {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = getRefreshToken();
      const accessToken = getAccessToken();

      // If we have a refresh token, try to get new access token
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_URL}/api/v1/auth/refresh-token`, 
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );
          
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
          
          // Update tokens
          setAccessToken(newAccessToken);
          if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
          }
          
          // Update Redux state
          dispatch(setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken }));
          dispatch(setAuthStatus('authenticated'));
          
          // Fetch user details
          await fetchCurrentUserDetails(dispatch);
        } catch (error) {
          // Token refresh failed - clear everything
          console.log('Token refresh failed:', error.message);
          clearAuth();
          dispatch(logout());
        }
      } 
      // If we only have access token (less common), try to use it
      else if (accessToken) {
        dispatch(setAuthStatus('authenticated'));
        try {
          await fetchCurrentUserDetails(dispatch);
        } catch (error) {
          // Access token is invalid - clear auth
          console.log('Access token invalid:', error.message);
          clearAuth();
          dispatch(logout());
        }
      } 
      // No tokens at all
      else {
        dispatch(setAuthStatus('unauthenticated'));
      }
    };

    // Small delay to ensure store is ready
    const timer = setTimeout(initializeAuth, 100);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Handle payment success callback
  useEffect(() => {
    window.paymentSuccess = () => {
      // Refresh user data after payment success
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
        <Route path="/about" element={<AboutUs />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/shows" element={<Shows />} />

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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================

function ProtectedRoute({ 
  children, 
  requireSubscription = false,
  redirectToRegister = false 
}) {
  const authStatus = useSelector(state => state.user.authStatus);
  const currentUser = useSelector(state => state.user.currentUser);

  // Debug logging
  // console.log('[ProtectedRoute] authStatus:', authStatus);
  // console.log('[ProtectedRoute] currentUser:', currentUser);
  // console.log('[ProtectedRoute] isSubscribed:', currentUser?.isSubscribed);
  // console.log('[ProtectedRoute] requireSubscription:', requireSubscription);

  // Show loading while checking auth
  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-[#8892b0] text-sm">Loading...</div>
      </div>
    );
  }

  // Not authenticated - redirect to login or register
  if (authStatus !== 'authenticated') {
    return (
      <Navigate 
        to={redirectToRegister ? "/register" : "/login"} 
        replace 
      />
    );
  }

  // Check for admin role
  const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN");
  
  // If require subscription but user is admin, allow access
  if (requireSubscription && isAdmin) {
    return children;
  }

  // If require subscription but user is not subscribed
  if (requireSubscription && !currentUser?.isSubscribed) {
    // Redirect to subscription page if not subscribed
    return <Navigate to="/subscription" replace />;
  }

  return children;
}

export default AppWithHealthCheck;
