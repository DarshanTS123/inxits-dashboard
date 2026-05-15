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

### AD-006: Feature-First Page Orchestration

- Decision: Move all domain-specific composition and state management from `src/pages` into `src/features`. Pages must be "Lean" targets for the router.
- Location: All new screens (e.g., `DashboardOverview.jsx`, `ClientsPage.jsx`).
- Rationale: Enforces a clean separation between routing and business logic. Pages handle *where* you are; Features handle *what* you do.
- Implementation Pattern:
  - Page: `src/pages/module/MyPage.jsx` -> renders `<MyFeature />`
  - Feature: `src/features/module/MyFeature.jsx` -> handles `useQuery` + layout.
  - Export: `src/features/module/index.js` -> `export * from './MyFeature'`

### Dashboard & Analytics

- `/dashboard` provides a high-level overview of AUM, risk segmentation, transaction status, and regulatory updates.
- Uses a "Feature-First" orchestration pattern where domain logic resides in `src/features/dashboard/Dashboard.jsx`.
- Analytics are powered by AmCharts 5 with custom dark-themed wrappers and unified legend formatting.
- All layout sections are encapsulated in the shared `Card` primitive for visual consistency.

### Data Workflows

- Server reads and writes should use TanStack React Query and Axios clients.
- Authenticated requests must use `privateApi`.
- API hooks should return unwrapped payload data because axios interceptors already return `response.data`.

## Key Features

- Private route shell: `MainLayout` with sidebar, header, and suspense loader.
- Public auth shell: `AuthLayout`.
- Route guards: `PublicRoute`, `PrivateRoute`, and `RoleProtectedRoute`.
- Global document title management: `DocumentTitle` and route `handle.title`.
- UI primitives: `Button`, `Input`, `Tooltip`, `DropdownMenu`, `Tabs`, `Select`, `Table`, `Pagination`, `PageLoader`, `PagePlaceholder`, `Card`, and `Badge`.
- Analytics Charts: High-fidelity `DonutChart`, `PieChart`, `GaugeChart`, and `SunburstChart` with smart decimal labels, custom legends, and skeleton loading.
- Dashboard capabilities: linked statistics, categorical announcements with badges, summary performance tables, and functional transaction pagination.
- Clients list capabilities: state tabs with counts, column-scoped search, paginated rows, sticky first/action columns, row action menu, and empty state messaging.

## In Scope

- Adding new route-level modules under the existing router and layouts.
- Implementing feature domains under `src/features/*` when they include API hooks, state, or domain components.
- Integrating APIs through `src/lib/axios.js` and React Query.
- Extending design tokens in `src/index.css` and using Tailwind token aliases.

## Development Patterns

### Feature-First Page Orchestration (Mandatory)

To maintain a scalable and clean architecture, we follow a strict separation between routing and domain logic:

1.  **The Page Layer (`src/pages/<domain>/*`)**:
    *   **Role**: Serves as the entry point for the router.
    *   **Responsibility**: Only handles top-level routing concerns and metadata (like `handle.title`).
    *   **Constraint**: Must be a "Lean Page". It should only import and render a single Feature Component. It should **not** handle API calls, complex state, or granular component assembly.
    *   *Example*: `ClientsPage.jsx` simply returns `<Clients />`.

2.  **The Feature Layer (`src/features/<domain>/*`)**:
    *   **Role**: Orchestrates the domain logic.
    *   **Responsibility**: Manages data fetching (`useQuery`), local state, and the composition of sub-components (`components/`, `api/`, `store/`).
    *   **Constraint**: The main feature component (e.g., `Dashboard.jsx`) must be exported via an `index.js` barrel file within the feature directory.

3.  **The Component Layer (`src/components/ui/*` and `src/components/charts/*`)**:
    *   **Role**: Reusable primitives.
    *   **Responsibility**: Presentational logic only.
    *   **Constraint**: No domain knowledge. They receive all data via props.

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
