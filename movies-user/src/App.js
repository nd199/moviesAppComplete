import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

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

// Utils
import Fallback from "./Utils/FallBackPage";
import ServerConnection from "./Utils/ServerConnection";

// ============================================
// CONFIGURATION
// ============================================

const isLocal = () => {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
};

const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL && !isLocal()) {
    return process.env.REACT_APP_API_URL;
  }
  return "http://localhost:8080";
};

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
  const authStatus = useSelector(state => state.user.authStatus);
  const currentUser = useSelector(state => state.user.currentUser);
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
      <NavBar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
        <Route path="/admin/login" element={<Navigate to="/" replace />} />
        <Route path="/registerAdmin" element={<Navigate to="/" replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
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
      <div style={{ padding: "20px", textAlign: "center", color: "white" }}>
        Loading...
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
