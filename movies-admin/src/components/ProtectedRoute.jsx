import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, admin } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect based on the requested route
    if (location.pathname.startsWith('/contentManager')) {
      return <Navigate to="/contentManagerLogin" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Check if user has proper role for the current route
  const userRoles = admin?.roles || [];
  const isAdmin = userRoles.some(role =>
    role.name === 'ROLE_ADMIN' || role.name === 'ADMIN' || role === 'ROLE_ADMIN'
  );
  const isContentManager = userRoles.some(role =>
    role.name === 'ROLE_CONTENT_MANAGER' || role.name === 'CONTENT_MANAGER' || role === 'ROLE_CONTENT_MANAGER'
  );

  // Admin routes (dashboard, users, admins, contentManagers)
  const adminRoutes = ['/dashboard', '/users', '/admins', '/contentManagers'];
  const isAdminRoute = adminRoutes.some(route => location.pathname.startsWith(route));

  // Content manager routes (contentManagerDashboard, movies, shows)
  const contentManagerRoutes = ['/contentManagerDashboard', '/movies', '/shows'];
  const isContentManagerRoute = contentManagerRoutes.some(route => location.pathname.startsWith(route));

  // Check role-based access
  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  if (isContentManagerRoute && !isContentManager && !isAdmin) {
    return <Navigate to="/contentManagerLogin" replace />;
  }

  return children;
};

export default ProtectedRoute;