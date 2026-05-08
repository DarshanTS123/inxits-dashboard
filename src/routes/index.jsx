import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { lazy } from 'react';
const DashboardOverview = lazy(() => import('../pages/dashboard/DashboardOverview').then((m) => ({ default: m.DashboardOverview })));
const ClientsPage = lazy(() => import('../pages/clients/ClientsPage').then((m) => ({ default: m.ClientsPage })));
const PortfolioPage = lazy(() => import('../pages/portfolio/PortfolioPage').then((m) => ({ default: m.PortfolioPage })));
const SupportPage = lazy(() => import('../pages/support/SupportPage').then((m) => ({ default: m.SupportPage })));
const TransactionsPage = lazy(() => import('../pages/transactions/TransactionsPage').then((m) => ({ default: m.TransactionsPage })));
const UserManagementPage = lazy(() => import('../pages/user-management/UserManagementPage').then((m) => ({ default: m.UserManagementPage })));
const UniversePage = lazy(() => import('../pages/universe/UniversePage').then((m) => ({ default: m.UniversePage })));
const ApplicationManagementPage = lazy(() => import('../pages/application-management/ApplicationManagementPage').then((m) => ({ default: m.ApplicationManagementPage })));
const CompliancePage = lazy(() => import('../pages/compliance/CompliancePage').then((m) => ({ default: m.CompliancePage })));
const AUMReportsPage = lazy(() => import('../pages/aum-reports/AUMReportsPage').then((m) => ({ default: m.AUMReportsPage })));
const ReportsPage = lazy(() => import('../pages/reports/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
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
