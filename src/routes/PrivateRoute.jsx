import { Navigate, Outlet } from 'react-router-dom';
import { authUtils } from '../utils/auth';

export const PrivateRoute = () => {
  if (!authUtils.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
