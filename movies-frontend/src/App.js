import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { fetchCurrentUserDetails } from "./Network/ApiCalls";
import { persistor } from "./redux/store";
import "./App.css";

// Import components for all roles
import Home from "./Pages/User/Home";
import LoginForm from "./Pages/User/LoginForm";
import RegistrationForm from "./Pages/User/RegistrationForm";
import Subscription from "./Pages/User/Subscription";
import VideoFullScreen from "./Pages/User/VideoFullScreen";
import AboutUs from "./Pages/User/AboutUs";
import Movies from "./Pages/User/Movies";
import Shows from "./Pages/User/Shows";

// Admin pages
import AdminHome from "./Pages/Admin/Home";
import AdminLogin from "./Pages/Admin/Login";
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

function AppWithHealthCheck() {
  return <AppWithNavigation />;
}

function AppWithNavigation() {
  const currentUser = useSelector((state) => state.user?.currentUser);
  const isSubscribed = currentUser && currentUser?.isSubscribed;
  const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN");
  const isFetching = useSelector((state) => state.user?.isFetching);
  const dispatch = useDispatch();

  console.log('AppWithNavigation - Current user:', currentUser);
  console.log('AppWithNavigation - Is subscribed:', isSubscribed);
  console.log('AppWithNavigation - Is admin:', isAdmin);
  console.log('AppWithNavigation - Is fetching:', isFetching);

  useEffect(() => {
    if (currentUser?.token) {
      fetchCurrentUserDetails(dispatch);
    }
  }, [currentUser?.token, dispatch]);

  // Role-based routing component
  const ProtectedRoute = ({ children, requiredRole, allowVideoPreview }) => {
    console.log('ProtectedRoute - Checking access:', { 
      currentUser: currentUser?.email, 
      requiredRole, 
      isSubscribed, 
      isAdmin, 
      allowVideoPreview,
      userHasToken: !!currentUser?.token,
      isFetching 
    });
    
    if (isFetching) {
      return <div style={{padding: '20px', textAlign: 'center', color: 'white'}}>Loading user data...</div>;
    }
    
    // Wait a moment for user data to be available
    if (!currentUser?.token) {
      console.log('ProtectedRoute - No token yet, showing loading...');
      return <div style={{padding: '20px', textAlign: 'center', color: 'white'}}>Loading user data...</div>;
    }
    
    // Additional delay to ensure Redux persistence is fully loaded
    setTimeout(() => {
      if (!currentUser?.token) {
        console.log('ProtectedRoute - Still no token after delay, redirecting to login');
        return <Navigate to="/login" replace />;
      }
    }, 500);

    if (requiredRole === "admin" && !isAdmin) {
      console.log('ProtectedRoute - Admin required but not admin');
      return <Navigate to="/" replace />;
    }

    if (requiredRole === "user" && isAdmin) {
      console.log('ProtectedRoute - User required but is admin');
      return <Navigate to="/admin" replace />;
    }

    // Special handling for video preview - allow access even without subscription
    if (requiredRole === "subscribed" && !isSubscribed && !allowVideoPreview) {
      console.log('ProtectedRoute - Subscription required but not subscribed, redirecting to subscription');
      return <Navigate to="/subscription" replace />;
    }

    console.log('ProtectedRoute - Access granted for video, allowVideoPreview:', allowVideoPreview);
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
          path="/video/:id"
          element={
            <ProtectedRoute requiredRole="subscribed" allowVideoPreview={true}>
              <VideoFullScreen />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
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
