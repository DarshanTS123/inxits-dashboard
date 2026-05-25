# Architecture (engineering contract)

This document defines **non-negotiable architectural constraints** for the inXits Dashboard frontend. AI agents and engineers must treat these as **enforceable rules**. If a change requires breaking a constraint, it must be surfaced as an explicit architecture decision documented in the relevant PR or code comment.

## Tech stack (current)

- **Build/runtime**: Vite 8, React 19 (`vite`, `react`, `react-dom`)
- **Router**: React Router DOM 7 data router (`createBrowserRouter`, `RouterProvider`)
- **Client state**: Redux Toolkit + React Redux + Redux Persist (`@reduxjs/toolkit`, `react-redux`, `redux-persist`)
- **Server state**: TanStack React Query 5 (`@tanstack/react-query`)
- **HTTP**: Axios with split clients (`axios`)
- **UI**: TailwindCSS + Radix primitives (via `radix-ui`) + local UI components
- **Typography**: Myriad Pro (self-hosted OTF files in `public/fonts/myriad-pro/`, loaded via `@font-face` in `src/index.css`)
- **Forms**: `react-hook-form` — see `docs/form-design-guide.md` for usage patterns and shared primitives
- **Icons**: `lucide-react`
- **Toasts**: `sonner`

## Configuration & Environment Variables

The application uses Vite's built-in support for environment variables. All environment-specific variables must be prefixed with `VITE_`.

- **Shared Variables** (`.env`): Shared across all environments (dev, prod, test).
- **Development Variables** (`.env.development`): Local development overrides.
- **Production Variables** (`.env.production`): Production environment values.

**Key Variables**:
- `VITE_API_BASE_URL`: The base URL for all API requests (used by `axios.js`).
- `VITE_AUTH_API_BASE_URL`: The base URL for public authentication APIs hosted outside the mock API base.
- `VITE_APP_NAME`: The display name of the application.

**Invariant CFG1**: Do not hardcode API base URLs or environment-specific flags in source code. Use `src/config/envConfig.js` as the central access point.

## Path Aliases (Import Shortcuts)

To avoid deep relative paths (e.g., `../../../../`), use the following aliases:
- `@features/*`: `src/features/*`
- `@components/*`: `src/components/*`
- `@pages/*`: `src/pages/*`
- `@utils/*`: `src/utils/*`
- `@lib/*`: `src/lib/*`
- `@hooks/*`: `src/hooks/*`
- `@store/*`: `src/store/*`
- `@/*`: `src/*` (fallback)

## Runtime composition (source of truth)

- `src/main.jsx`: mounts `<App />`
- `src/App.jsx`: wraps providers in this order:
  - Redux `Provider` using `src/store/index.js`
  - Redux Persist `PersistGate` (loading: null, persistor: {persistor})
  - `<QueryProvider>` using `src/providers/QueryProvider.jsx`
  - Sonner `<Toaster />`
  - `<TooltipProvider />`
  - `<RouterProvider router={router} />` where router is from `src/routes/index.jsx`

**Invariant A1**: Provider order must preserve "store available before axios interceptors dispatch" behavior (axios imports `store`).

## Folder ownership & responsibilities

### `src/routes/*` (routing contract)

- Defines the route tree and access control wrappers (`PublicRoute`, `PrivateRoute`, `RoleProtectedRoute`).
- Defines document title integration using `handle.title` + `DocumentTitle`. Detail routes use the parent section title in `handle.title`; entity-specific labels belong in page content (breadcrumbs, `h1`), not the app bar.

**Invariant R1**: Route-level pages are **lazy-loaded** from router (`React.lazy` + `.then((m) => ({ default: m.NamedExport }))`).

### `src/layouts/*` (shells only)

- `MainLayout`: global private shell (sidebar + header + `<Outlet />` wrapped with `<Suspense>`).
- `AuthLayout`: public auth shell for `/login`.

**Invariant L1**: Layouts must not directly call APIs. Layouts may read UI state and session state only.

### `src/pages/*` (route screens)

- Route-level "screens" and orchestration for that module.
- May import **feature hooks** and **UI components**.

### `src/features/*` (domain modules)

Use `features/<domain>` when the domain has any of:
- API hooks (React Query mutations/queries)
- Redux slice/state
- Domain-level components used by the page

Examples present today:
- `features/auth/*`: session + login flow
- `features/clients/*`: client listing, filtering, detail views, and management
  - `api/clients.js`: list query + tab counts (`public/mock/clients.json`)
  - `api/clientDetail.js`: detail query merging list row + mock detail template/overrides
  - `components/ClientDetail*.jsx`: detail layout, summary cards, personal tab, and error states
  - `components/DetailField.jsx`: read-only label/value grid for detail surfaces; defaults to 14px regular labels and 16px regular values
- `features/portfolio/*`: portfolio oversight (metrics, allocation charts, holdings table)
  - `PortfolioOversight.jsx`: orchestrator — React Query hook, holdings pagination state, section composition
  - `api/portfolio.js`: overview query via `public/mock/portfolio.json`; `normalizePortfolioData` expands holdings when mock `total` exceeds sample rows
  - `portfolioConfig.js`: domain-owned chart palette (`PLATFORM_COLORS`) and table column definitions
  - `components/PortfolioControls.jsx`: scope select, date range, download (placeholder)
  - `components/PortfolioMetricCards.jsx`: summary metric tiles
  - `components/PortfolioInvestmentSummary.jsx`: embedded platform-split pie + investment sources table
  - `components/PortfolioAllocationCharts.jsx`: grid of allocation pies with per-chart colors from mock payload
  - `components/PortfolioHoldingsTable.jsx`: paginated holdings with status badges and star ratings
- `features/support/*`: support management (ticket list, stats, filters)
  - `SupportManagement.jsx`: orchestrator — data fetching, pagination/search state, section composition
  - `api/supportApi.js`: queries `public/mock/support.json` using `privateApi`
  - `components/SupportStats.jsx`: metric cards with row-based label/value layout
  - `components/SupportFilters.jsx`: ticket count, search, and filters button
  - `components/SupportTable.jsx`: `DataTable` for support tickets
- `features/dashboard/*`: dashboard overview via `public/mock/dashboard.json`
- `features/layout/*`: sidebar collapse/mobile open state

### `src/components/*` (shared UI + layout atoms)

- `components/ui/*`: reusable primitives (Button/Input/Tooltip/etc.)
- `components/layout/*`: sidebar/header composition

**Invariant C1**: `components/ui/*` must be **pure presentational**:
- no network calls
- no React Query usage
- no Redux dispatch/select
- no direct access to `localStorage`

(Exceptions: accessibility-only hooks like `useId`, `forwardRef` are fine.)

### `src/lib/*` (infrastructure)

- `src/lib/axios.js`: `publicApi` / `privateApi` axios clients + interceptors (reads token from Redux store)
- `src/lib/react-query.js`: shared `queryClient`

### `src/utils/*` (pure helpers)

- `utils/cn.js`: Tailwind class merging utility

## Dependency rules (import boundaries)

### Allowed dependency directions

| From \\ To | `routes` | `layouts` | `pages` | `features` | `components/ui` | `components/layout` | `lib` | `utils` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `routes` | self | yes | yes | yes | yes | yes | yes | yes |
| `layouts` | no | self | no | yes (layout slice only) | yes | yes | no | yes |
| `pages` | no | yes | self | yes | yes | yes | yes | yes |
| `features` | no | no | yes (via pages) | self | yes | yes | yes | yes |
| `components/ui` | no | no | no | no | self | no | no | yes |
| `components/layout` | no | no | no | yes (layout/auth hooks only) | yes | self | no | yes |
| `lib` | no | no | no | no | no | no | self | yes |
| `utils` | no | no | no | no | no | no | no | self |

Legend:
- yes: Allowed
- no: Forbidden

### Forbidden dependency directions (must enforce)

- **F1**: `src/components/ui/**` **must not** import from `src/features/**`, `src/lib/**`, `src/routes/**`, `src/store/**`.
- **F2**: `src/utils/**` **must not** import React, Redux, React Query, Router, or Axios.
- **F3**: `src/lib/**` **must not** import UI or pages. (`axios.js` may import `store` + auth utilities only.)
- **F4**: `src/features/**` **must not** import from `src/pages/**` or `src/layouts/**`.
- **F5**: Route files (`src/routes/**`) **must not** import feature internals other than exported route guards/hooks; no deep imports like `features/x/components/*` from routes.

## Feature architecture (standard pattern)

For any non-trivial domain `X`:

- `src/features/x/api/*`
  - React Query hooks only (no JSX).
  - Use `publicApi`/`privateApi`.
- `src/features/x/store/*`
  - Redux slice or domain hooks that wrap Redux selectors/dispatch.
- `src/features/x/components/*`
  - Domain components (may use hooks).
- `src/pages/x/*`
  - Page composes domain components and owns routing params.

**Invariant FA1**: "Hooks files" (`use*.js`) must not export JSX components.

## State management strategy

- **Redux**: session (`auth`) + UI layout (`layout`) + any future UI state needing global coordination.
  - Persisted via **Redux Persist** in `src/store/index.js` (auth session + sidebar collapse).
- **React Query**: all server reads/writes.

**Invariant S1**: Do not store server responses in Redux. Cache server data in React Query.

## API architecture

Defined in `src/lib/axios.js`:

- `publicApi`: no auth header; used for unauthenticated endpoints.
- `privateApi`: attaches `Authorization: Bearer <token>` via request interceptor.
- Response interceptors:
  - resolve with `response.data`
  - on 401: dispatch logout, toast, redirect to `/login`
  - optional `skipToast` request config flag

**Invariant API1**: All authenticated API calls must use `privateApi`.
**Invariant API2**: API hooks must return *data* (already unwrapped), not full axios response objects.

### Mock API layer (default for new features)

Until a real backend endpoint is available, data-driven features must use mock JSON served from `public/mock/`:

- **Invariant API3**: New data-driven features must add `public/mock/<domain>.json` and fetch it from `src/features/<domain>/api/*` via `privateApi.get('/mock/<domain>.json')` (or `publicApi` for unauthenticated reads).
- **Invariant API4**: Screen data must not live as large inline arrays/objects in pages or presentational components. Mock payloads belong in JSON files; shaping/normalization belongs in the feature API module.
- **Invariant API5**: Swapping mock → real API is a change inside the feature API module only (URL + optional response mapping). UI and page layers must not hardcode mock paths.

Reference: `features/clients/api/*`, `features/portfolio/api/portfolio.js`, `features/dashboard/api/dashboard.js`.

## Auth model

- Session model: `{ token, role, user }`
- Storage: Managed by **Redux Persist** using `localStorage` (key: `persist:root`).
- Guards:
  - `PrivateRoute`: requires `isAuthenticated`
  - `PublicRoute`: blocks authenticated users from `/login`
  - `RoleProtectedRoute`: requires `hasRole(allowedRoles)`

**Invariant AUTH1**: Any new private route must be under `PrivateRoute` in router tree.

## Storage model

- `localStorage` only (session + sidebar preference)
- No cookies/session storage usage currently.

**Invariant ST1**: Direct `localStorage` access is discouraged. Use Redux state for persistent data, allowing Redux Persist to manage the underlying storage.

## Caching strategy

- React Query cache configured in `src/lib/react-query.js`:
  - `retry: false`
  - `refetchOnWindowFocus: false`
  - `staleTime: 5 minutes`

**Invariant CQ1**: Do not override cache defaults per-query unless the API contract requires it.

## Rendering strategy

- SPA with route-level code splitting.
- Layout-level Suspense boundary uses `PageLoader`.

**Invariant RS1**: New route-level pages must be added as lazy imports (no eager `import ... from '../pages/...'` in router).

## Scalability considerations (guardrails)

- Keep shared UI primitives pure (prevents global coupling).
- Keep domain logic in `features/*` (prevents pages becoming "god files").
- Centralize network concerns in React Query + Axios layer (prevents inconsistent error handling).
