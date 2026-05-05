import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/store/useAuth';

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
