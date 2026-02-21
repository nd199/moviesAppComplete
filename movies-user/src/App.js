import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { fetchCurrentUserDetails } from "./Network/ApiCalls";
import { persistor } from "./redux/store";
import axios from "axios";
import "./App.css";

import Home from "./Pages/User/Home";
import LoginForm from "./Pages/User/LoginForm";
import RegistrationForm from "./Pages/User/RegistrationForm";
import Subscription from "./Pages/User/Subscription";
import EmailVerification from "./Pages/User/EmailVerification";
import VideoFullScreen from "./Pages/User/VideoFullScreen";
import AboutUs from "./Pages/User/AboutUs";
import Movies from "./Pages/User/Movies";
import Shows from "./Pages/User/Shows";

import PaymentCheckout from "./Pages/Payment/PaymentCheckout";
import Success from "./Pages/Payment/Success";

import Fallback from "./Utils/FallBackPage";
import ServerConnection from "./Utils/ServerConnection";

function AppWithHealthCheck() {
  const [serverStatus, setServerStatus] = useState('checking');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkServerHealth = async () => {
      try {

        const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080";
        const url = `${baseURL}/api/v1/ping`;
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

  return <AppWithNavigation />;
}

function AppWithNavigation() {
  const dispatch = useDispatch();
  const [skipUserFetch, setSkipUserFetch] = useState(false);

  useEffect(() => {
    if (!skipUserFetch) {
      fetchCurrentUserDetails(dispatch);
    }
  }, [dispatch, skipUserFetch]);

  // Listen for payment success to skip next fetch
  useEffect(() => {
    const handlePaymentSuccess = () => {
      setSkipUserFetch(true);
      setTimeout(() => setSkipUserFetch(false), 10000);
    };

    window.paymentSuccess = handlePaymentSuccess;
    
    return () => {
      window.paymentSuccess = null;
    };
  }, []);

  const ProtectedRoute = ({ children, requiredRole }) => {
    const authStatus = useSelector(state => state.user.authStatus);
    const currentUser = useSelector(state => state.user.currentUser);
    const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN");
    const isSubscribed = currentUser?.isSubscribed;

    console.log('ProtectedRoute - Debug:', {
      authStatus,
      currentUser,
      isAdmin,
      isSubscribed,
      requiredRole
    });

    if (authStatus === "loading") {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "white" }}>
          Checking authentication...
        </div>
      );
    }

    if (authStatus === "unauthenticated") {
      console.log('ProtectedRoute - Redirecting to login (unauthenticated)');
      return <Navigate to="/login" replace />;
    }

    if (requiredRole === "admin" && !isAdmin) {
      console.log('ProtectedRoute - Redirecting to home (not admin)');
      return <Navigate to="/" replace />;
    }

    if (requiredRole === "subscribed" && !isSubscribed) {
      console.log('ProtectedRoute - Redirecting to subscription (not subscribed)');
      return <Navigate to="/subscription" replace />;
    }

    console.log('ProtectedRoute - Access granted');
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/server-status" element={<ServerConnection />} />
        <Route path="/fallback" element={<Fallback />} />

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/shows" element={<Shows />} />

        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/email-verification"
          element={
            <ProtectedRoute>
              <EmailVerification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video/:id"
          element={
            <ProtectedRoute requiredRole="subscribed">
              <VideoFullScreen />
            </ProtectedRoute>
          }
        />

        {/* Admin routes should be handled separately or removed for user app */}
        <Route path="/admin/login" element={<Navigate to="/" replace />} />
        <Route path="/registerAdmin" element={<Navigate to="/" replace />} />
        <Route
          path="/admin"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/admin/users"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/admin/users/:id"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/admin/users/new"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/admin/products"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/admin/products/:id"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/admin/products/new"
          element={<Navigate to="/" replace />}
        />

        <Route
          path="/payment/:userId"
          element={
            <ProtectedRoute>
              <PaymentCheckout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <div className="App">
      <PersistGate loading={null} persistor={persistor}>
        <AppWithHealthCheck />
      </PersistGate>
    </div>
  );
}

export default App;
