import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminProtectedRoute = ({ children, requiredRole = null }) => {
  const authStatus = useSelector((state) => state.user.authStatus);
  const currentUser = useSelector((state) => state.user.currentUser);
  const location = useLocation();

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (authStatus !== 'authenticated') {
    console.log('AdminProtectedRoute: Not authenticated, redirecting');
    if (location.pathname.startsWith('/admin/content-manager')) {
      console.log('AdminProtectedRoute: Redirecting to content manager login');
      return <Navigate to="/admin/cm-login" replace />;
    }
    console.log('AdminProtectedRoute: Redirecting to admin login');
    return <Navigate to="/admin/login" replace />;
  }

  const userRoles = currentUser?.roles || [];
  const isAdmin = userRoles.includes('ROLE_ADMIN');
  const isContentManager = userRoles.includes('ROLE_CONTENT_MANAGER');

  if (requiredRole === 'ROLE_ADMIN' && !isAdmin) {
    console.log('AdminProtectedRoute: User not admin, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRole === 'ROLE_CONTENT_MANAGER' && !isContentManager && !isAdmin) {
    console.log('AdminProtectedRoute: User not content manager, redirecting to CM login');
    return <Navigate to="/admin/cm-login" replace />;
  }

  const adminOnlyRoutes = ['/admin/dashboard', '/admin/users', '/admin/admins', '/admin/content-managers', '/admin/settings'];
  const isAdminRoute = adminOnlyRoutes.some(route => location.pathname.startsWith(route));

  if (isAdminRoute && !isAdmin) {
    console.log('AdminProtectedRoute: Access to admin route denied, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
