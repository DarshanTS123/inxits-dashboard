# Project Overview - inXits Dashboard

## Purpose

The inXits Dashboard is a role-based internal web console for investment and operations teams to monitor and manage client-facing reporting modules, including clients, portfolio oversight, transactions, compliance, AUM reports, and related operational screens.

## Target Users

- Operations analysts: monitor client activity, exports, and report generation.
- Relationship managers: view client status and high-level portfolio information.
- Compliance users: access compliance reporting.
- Admins: manage users and application settings.

## Business Goals

- Provide a single control plane for premium inXits reporting modules.
- Enable fast navigation between modules with consistent UI and interaction patterns.
- Keep access control predictable through authenticated private routes and optional role-gated sections.
- Keep the module surface extensible so new pages can be added without architectural drift.

## Major Workflows

### Authentication

- Login uses mock data from `public/mock/user.json` for local and development flows.
- Session data persists in `localStorage` as token, role, and user.
- Guest users can access `/login`.
- Authenticated users are redirected away from `/login`.
- Private routes require authentication.

### Module Navigation

- Sidebar navigation links to module pages.
- Top header title is derived from router `handle.title`.
- Route-level pages are lazy-loaded through `src/routes/index.jsx`.

### Client Management

- `/clients` provides tabbed client states, search by selected column, pagination, and row action menus.
- Data is fetched via `src/features/clients/api/clients.js` using `privateApi` from `public/mock/clients.json`.
- The list is backed by shared UI primitives: `Tabs`, `Select`, `Input`, `DataTable`, `DropdownMenuList`, `Pagination`, and `Button`.
- API integration follows the project's standard React Query patterns.

### Data Workflows

- Server reads and writes should use TanStack React Query and Axios clients.
- Authenticated requests must use `privateApi`.
- API hooks should return unwrapped payload data because axios interceptors already return `response.data`.

## Key Features

- Private route shell: `MainLayout` with sidebar, header, and suspense loader.
- Public auth shell: `AuthLayout`.
- Route guards: `PublicRoute`, `PrivateRoute`, and `RoleProtectedRoute`.
- Global document title management: `DocumentTitle` and route `handle.title`.
- UI primitives: `Button`, `Input`, `Tooltip`, `DropdownMenu`, `Tabs`, `Select`, `Table`, `Pagination`, `PageLoader`, and `PagePlaceholder`.
- Clients list capabilities: state tabs with counts, column-scoped search, paginated rows, sticky first/action columns, row action menu, and empty state messaging.

## In Scope

- Adding new route-level modules under the existing router and layouts.
- Implementing feature domains under `src/features/*` when they include API hooks, state, or domain components.
- Integrating APIs through `src/lib/axios.js` and React Query.
- Extending design tokens in `src/index.css` and using Tailwind token aliases.

## Out of Scope Until Explicitly Added

- SSR or Next.js migration.
- Multi-tenant organization switching, SSO, MFA, or refresh-token auth.
- Backend implementation in this repo.
- Complex permission matrices beyond simple role checks.

## Success Criteria

- `npm run build` succeeds with no unresolved imports.
- Unauthenticated access to private routes redirects to `/login`.
- Authenticated access to `/login` redirects to `/dashboard`.
- Role-protected routes redirect unauthorized users to `/dashboard`.
- New shared UI uses design tokens instead of repeated hardcoded colors.
- New route pages are lazy-loaded and provide `handle.title`.
- List screens preserve keyboard access for tabs, selects, pagination, and row menus.

## Constraints

- Language: JavaScript/JSX. No `tsconfig.json` currently exists.
- React: React 19 with React Router DOM 7 data router APIs.
- State split:
  - Redux: app/session/layout UI state.
  - React Query: server state.
- Persistence: `localStorage` is the only in-app persistence layer today.

## Performance Expectations

- Keep route-level code splitting for all pages.
- Avoid broad Redux reads in low-level UI primitives.
- Lists rendering more than 100 rows must use pagination and/or virtualization.
