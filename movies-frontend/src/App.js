import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { fetchCurrentUserDetails } from "./Network/ApiCalls";
import { persistor } from "./redux/store";
import axios from "axios";
import "./App.css";

// Import components for all roles
import Home from "./Pages/User/Home";
import LoginForm from "./Pages/User/LoginForm";
import RegistrationForm from "./Pages/User/RegistrationForm";
import Subscription from "./Pages/User/Subscription";
import EmailVerification from "./Pages/User/EmailVerification";
import VideoFullScreen from "./Pages/User/VideoFullScreen";
import AboutUs from "./Pages/User/AboutUs";
import Movies from "./Pages/User/Movies";
import Shows from "./Pages/User/Shows";

// Admin pages
import AdminHome from "./Pages/Admin/Home";
import AdminLogin from "./Pages/Admin/Login";
import AdminRegister from "./Pages/Admin/Register";
import UserList from "./Pages/Admin/UserList";
import UserInfoAndEdit from "./Pages/Admin/UserInfoAndEdit";
import NewUser from "./Pages/Admin/NewUser";
import ProductList from "./Pages/Admin/ProductList";
import ProductInfoAndEdit from "./Pages/Admin/ProductInfoAndEdit";
import NewProduct from "./Pages/Admin/NewProduct";

// Payment pages
import PaymentCheckout from "./Pages/Payment/PaymentCheckout";
import Success from "./Pages/Payment/Success";

// Shared components
import Fallback from "./Utils/FallBackPage";
import ServerConnection from "./Utils/ServerConnection";

// Backend Health Check Component
function AppWithHealthCheck() {
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'up', 'down'
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkServerHealth = async () => {
      try {

        await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1"}/ping`, {
          timeout: 5000,
        });
        setServerStatus('up');
      } catch (error) {
        console.warn('Backend health check failed:', error.message);
        setServerStatus('down');
      }
    };

    // Initial health check
    checkServerHealth();

    // Set up retry mechanism if server is down
    let retryInterval;
    if (serverStatus === 'down' && retryCount < 5) {
      retryInterval = setInterval(() => {
        setRetryCount(prev => prev + 1);
        checkServerHealth();
      }, 10000); // Retry every 10 seconds
    }

    return () => {
      if (retryInterval) clearInterval(retryInterval);
    };
  }, [serverStatus, retryCount]);

  // Show server connection screen while checking
  if (serverStatus === 'checking') {
    return <ServerConnection />;
  }

  // Show fallback page if server is down
  if (serverStatus === 'down') {
    return <Fallback retryCount={retryCount} onRetry={() => setServerStatus('checking')} />;
  }

  // Only render app if server is up
  return <AppWithNavigation />;
}

function AppWithNavigation() {
  const dispatch = useDispatch();
  const [skipUserFetch, setSkipUserFetch] = useState(false);

  useEffect(() => {
    // Skip user fetch if we just completed payment (to preserve subscription status)
    if (!skipUserFetch) {
      fetchCurrentUserDetails(dispatch);
    }
  }, [dispatch, skipUserFetch]);

  // Listen for payment success to skip next fetch
  useEffect(() => {
    const handlePaymentSuccess = () => {
      setSkipUserFetch(true);
      // Reset flag after 10 seconds to allow normal fetching again
      setTimeout(() => setSkipUserFetch(false), 10000);
    };

    // This will be called from PaymentCheckout
    window.paymentSuccess = handlePaymentSuccess;
    
    return () => {
      window.paymentSuccess = null;
    };
  }, []);

  // Role-based routing component
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
        {/* Public routes */}
        <Route path="/server-status" element={<ServerConnection />} />
        <Route path="/fallback" element={<Fallback />} />

        {/* User routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/shows" element={<Shows />} />

        {/* Protected user routes */}
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

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/registerAdmin" element={<AdminRegister />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserInfoAndEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/new"
          element={
            <ProtectedRoute requiredRole="admin">
              <NewUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole="admin">
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <ProductInfoAndEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/new"
          element={
            <ProtectedRoute requiredRole="admin">
              <NewProduct />
            </ProtectedRoute>
          }
        />

        {/* Payment routes */}
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

        {/* Fallback route */}
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
