import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardOverview } from '../pages/dashboard/DashboardOverview';
import { ClientsPage } from '../pages/clients/ClientsPage';
import { PortfolioPage } from '../pages/portfolio/PortfolioPage';
import { SupportPage } from '../pages/support/SupportPage';
import { TransactionsPage } from '../pages/transactions/TransactionsPage';
import { UserManagementPage } from '../pages/user-management/UserManagementPage';
import { UniversePage } from '../pages/universe/UniversePage';
import { ApplicationManagementPage } from '../pages/application-management/ApplicationManagementPage';
import { CompliancePage } from '../pages/compliance/CompliancePage';
import { AUMReportsPage } from '../pages/aum-reports/AUMReportsPage';
import { ReportsPage } from '../pages/reports/ReportsPage';
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
          { path: '/dashboard', element: <DashboardOverview /> },
          { path: '/clients', element: <ClientsPage /> },
          { path: '/portfolio', element: <PortfolioPage /> },
          { path: '/support', element: <SupportPage /> },
          { path: '/transactions', element: <TransactionsPage /> },
          { path: '/user-management', element: <UserManagementPage /> },
          { path: '/universe', element: <UniversePage /> },
          { path: '/application-management', element: <ApplicationManagementPage /> },
          { path: '/compliance', element: <CompliancePage /> },
          { path: '/aum-reports', element: <AUMReportsPage /> },
          { path: '/reports', element: <ReportsPage /> },
          
          // 4. ROLE-PROTECTED ROUTE (Requires BOTH login AND 'admin' role)
          {
            element: <RoleProtectedRoute allowedRoles={['admin']} />,
            children: [
              {
                path: '/settings',
                element: <div>Admin Settings Page</div>
              }
            ]
          }
        ]
      }
    ]
  }
]);
