import { Navigate, Outlet } from 'react-router-dom';
import { authUtils } from '../utils/auth';

export const PublicRoute = () => {
  if (authUtils.isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
