import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardOverview } from '../pages/dashboard/DashboardOverview';
import { LoginPage } from '../pages/auth/LoginPage';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import { RoleProtectedRoute } from './RoleProtectedRoute';

export const router = createBrowserRouter([
  // 1. PUBLIC REDIRECT (Accessible to everyone)
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },

  // 2. PUBLIC/GUEST ROUTES (Only accessible if NOT logged in)
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: <LoginPage />
          }
        ]
      }
    ]
  },

  // 3. PRIVATE ROUTES (Only accessible if logged in)
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardOverview />
          },
          // 4. ROLE-PROTECTED ROUTE (Requires BOTH login AND 'admin' role)
          {
            element: <RoleProtectedRoute allowedRoles={['admin']} />,
            children: [
              {
                path: '/settings',
                element: <div>Admin Settings Page</div> // Placeholder for admin route
              }
            ]
          }
        ]
      }
    ]
  }
]);
