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
import { DocumentTitle } from './DocumentTitle';

export const router = createBrowserRouter([
  {
    element: <DocumentTitle />,
    children: [
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
                element: <LoginPage />,
                handle: { title: 'Login' }
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
              { path: '/dashboard', element: <DashboardOverview />, handle: { title: 'Dashboard' } },
              { path: '/clients', element: <ClientsPage />, handle: { title: 'Clients' } },
              {
                path: '/clients/:id',
                element: <ClientsPage />,
                handle: { title: ({ params }) => `Client ${params.id}` }
              },
              { path: '/portfolio', element: <PortfolioPage />, handle: { title: 'Portfolio Oversight' } },
              { path: '/support', element: <SupportPage />, handle: { title: 'Support Management' } },
              { path: '/transactions', element: <TransactionsPage />, handle: { title: 'Transactions' } },
              { path: '/user-management', element: <UserManagementPage />, handle: { title: 'User Management' } },
              { path: '/universe', element: <UniversePage />, handle: { title: 'Universe' } },
              {
                path: '/application-management',
                element: <ApplicationManagementPage />,
                handle: { title: 'Application Management' }
              },
              { path: '/compliance', element: <CompliancePage />, handle: { title: 'Compliance Report' } },
              { path: '/aum-reports', element: <AUMReportsPage />, handle: { title: 'AUM Reports' } },
              { path: '/reports', element: <ReportsPage />, handle: { title: 'Reports' } },

              // 4. ROLE-PROTECTED ROUTE (Requires BOTH login AND 'admin' role)
              {
                element: <RoleProtectedRoute allowedRoles={['admin']} />,
                children: [
                  {
                    path: '/settings',
                    element: <div>Admin Settings Page</div>,
                    handle: { title: 'Settings' }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]);
