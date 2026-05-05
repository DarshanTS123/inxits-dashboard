import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/store/useAuth';

export const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
