# Architecture (engineering contract)

This document defines **non-negotiable architectural constraints** for the inXits Dashboard frontend. AI agents and engineers must treat these as **enforceable rules**. If a change requires breaking a constraint, it must be surfaced as an explicit architecture decision (record in `docs/progress-tracker.md`).

## Tech stack (current)

- **Build/runtime**: Vite 8, React 19 (`vite`, `react`, `react-dom`)
- **Router**: React Router DOM 7 data router (`createBrowserRouter`, `RouterProvider`)
- **Client state**: Redux Toolkit + React Redux (`@reduxjs/toolkit`, `react-redux`)
- **Server state**: TanStack React Query 5 (`@tanstack/react-query`)
- **HTTP**: Axios with split clients (`axios`)
- **UI**: TailwindCSS + Radix primitives (via `radix-ui`) + local UI components
- **Forms**: `react-hook-form`
- **Icons**: `lucide-react`
- **Toasts**: `sonner`

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
  - `<QueryProvider>` using `src/providers/QueryProvider.jsx`
  - Sonner `<Toaster />`
  - `<TooltipProvider />`
  - `<RouterProvider router={router} />` where router is from `src/routes/index.jsx`

**Invariant A1**: Provider order must preserve "store available before axios interceptors dispatch" behavior (axios imports `store`).

## Folder ownership & responsibilities

### `src/routes/*` (routing contract)

- Defines the route tree and access control wrappers (`PublicRoute`, `PrivateRoute`, `RoleProtectedRoute`).
- Defines document title integration using `handle.title` + `DocumentTitle`.

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
- `features/clients/*`: client listing, filtering, and management
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

- `src/lib/axios.js`: `publicApi` / `privateApi` axios clients + interceptors
- `src/lib/react-query.js`: shared `queryClient`

### `src/utils/*` (pure helpers)

- `utils/auth.js`: `authUtils` for localStorage session (token/role/user)
- `utils/layoutPreferences.js`: localStorage preference helpers

**Invariant U1**: `src/utils/*` must be side-effect minimal and never import React.

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
  - Persisted via listener middleware in `src/store/index.js` (auth session + sidebar collapse).
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

## Auth model

- Session model: `{ token, role, user }`
- Storage: `localStorage` keys:
  - `token`, `role`, `user`
- Guards:
  - `PrivateRoute`: requires `isAuthenticated`
  - `PublicRoute`: blocks authenticated users from `/login`
  - `RoleProtectedRoute`: requires `hasRole(allowedRoles)`

**Invariant AUTH1**: Any new private route must be under `PrivateRoute` in router tree.

## Storage model

- `localStorage` only (session + sidebar preference)
- No cookies/session storage usage currently.

**Invariant ST1**: All `localStorage` access must be centralized in `src/utils/*` (or Redux listener middleware reading/writing via those utils).

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

