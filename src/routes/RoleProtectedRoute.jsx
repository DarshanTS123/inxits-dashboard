import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/store/useAuth';

export const RoleProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
