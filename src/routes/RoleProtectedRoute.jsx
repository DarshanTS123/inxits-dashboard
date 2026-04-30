import { Navigate, Outlet } from 'react-router-dom';
import { authUtils } from '../utils/auth';

export const RoleProtectedRoute = ({ allowedRoles }) => {
  if (!authUtils.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!authUtils.hasRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
