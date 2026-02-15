import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import "./App.css";

// Import components for all roles
import { fetchCurrentUserDetails } from "./Network/ApiCalls";

// User pages
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
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser?.token) {
      fetchCurrentUserDetails(dispatch);
    }
  }, [currentUser?.token, dispatch]);

  // Role-based routing component
  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!currentUser?.token) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRole === "admin" && !isAdmin) {
      return <Navigate to="/" replace />;
    }

    if (requiredRole === "user" && isAdmin) {
      return <Navigate to="/admin" replace />;
    }

    if (requiredRole === "subscribed" && !isSubscribed) {
      return <Navigate to="/subscription" replace />;
    }

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
            <ProtectedRoute requiredRole="subscribed">
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
      <AppWithHealthCheck />
    </div>
  );
}

export default App;
