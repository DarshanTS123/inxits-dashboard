# Progress Tracker

This file is updated on every feature change. It helps humans and AI agents quickly understand current state, decisions, and next work.

## Current Phase

- Phase: Foundation plus first module implementation
- Why: Router, layout, auth, shared UI primitives, and the first real client list surface are implemented. Most other business modules are still placeholders.

## Completed Features

### Authentication

- Status: Completed
- Scope:
  - Login page and form
  - Real login API integration via `VITE_AUTH_API_BASE_URL`
  - Session persistence via **Redux Persist**
  - Guest and private route guards
- Done criteria:
  - Login posts credentials to the admin API
  - Access token is persisted as the auth token
  - Authenticated users cannot access `/login`
  - Unauthenticated users cannot access private routes
  - 401 from `privateApi` logs out and redirects to `/login`

### App Shell

- Status: Completed
- Scope:
  - `MainLayout` with sidebar, header, and suspense loader
  - Sidebar collapse preference persistence via **Redux Persist**
  - Header title derived from route `handle.title`
- Done criteria:
  - Sidebar nav routes match router paths
  - Desktop collapsed state persists across refreshes
  - Header updates title when route changes

### Shared UI Primitives

- Status: Completed for current dashboard needs
- Scope:
  - `Button`, `Input`, `Tooltip`, `DropdownMenu`, `Tabs`, `Select`, `Table`, `Pagination`, `PageLoader`, `PagePlaceholder`, `Card`, `Badge`
- Done criteria:
  - Primitives are presentational
  - Components support composition through `className` and props
  - **NEW**: Higher-level data-driven APIs (e.g., `items` prop in `Tabs`) simplify common usage patterns.
  - **NEW**: `Card` system (Root, Header, Title, Content, Footer) provides unified container aesthetics.
  - **NEW**: All app-level button controls render through the shared `Button` primitive; raw `<button>` is reserved for the primitive implementation.
  - Interactive controls include keyboard focus states

### Clients Feature
- Status: Completed (Mock-backed API)
- Scope:
  - Tabbed client states with counts
  - Search/filter by selected column through shared `Select` + `Input`
  - Paginated table through shared `DataTable` + `Pagination`
  - Sticky first and action columns for horizontal scanning
  - Row action menu through `DropdownMenuList`
  - Empty state for no filtered results
  - **NEW**: Fetches data from `public/mock/clients.json` using `privateApi` via React Query hooks.
- Done criteria:
  - API calls use `privateApi` and include auth headers
  - Hook logic resides in `src/features/clients/api/clients.js`
  - Data structure matches backend-ready patterns

### Chart Components

- Status: Completed (High-Fidelity Update)
- Scope:
  - `DonutChart` — Thinner ring (70%), smart decimal integer labels, unified `Category - Value` legend.
  - `PieChart` — Synchronized design with `Category : Value%` legend format.
  - `GaugeChart` — Semi-circular gauge for single-metric risk scoring.
  - `SunburstChart` — Hierarchical circular chart for multi-level asset allocation.
  - `ChartsShowcase` — Side-by-side demo matching latest design specifications.
- Done criteria:
  - Components accept appropriate data shapes (flat for Pie/Donut, hierarchical for Sunburst).
  - Smart decimal formatting (`#.##%`) shows integers by default, max 2 decimals if needed.
  - Design matches premium UI reference (slate-300 titles, rounded markers, updated palettes).
  - amCharts root properly disposed on unmount.
  - Barrel export at `src/components/charts/index.js`.

### Dashboard Feature

- Status: Completed (Feature-First Pattern)
- Scope:
  - Dynamic `StatsGrid` with linked metrics
  - Multi-chart row (Risk Donut + AUM Pie)
  - Layout-integrated Transaction Status Pie with raw value legends
  - Regulatory Announcements list with category-aware `Badge` indicators
  - Comprehensive Business Update and RM Performance summary tables
  - Paginated Ongoing Transactions list with loading skeletons
- Done criteria:
  - Orchestration resides in `src/features/dashboard/Dashboard.jsx`
  - Page at `src/pages/dashboard/DashboardOverview.jsx` is lean (delegates to feature)
  - All containers use the shared `Card` system
  - Mock data is fully integrated from `public/mock/dashboard.json`

## In-Progress Work

### Business Modules

- Status: In progress
- Scope:
  - Replace placeholders with real data and workflows for:
    - `/portfolio`
    - `/transactions`
    - `/support`
    - `/user-management`
    - `/universe`
    - `/application-management`
    - `/compliance`
    - `/aum-reports`
    - `/reports`
- Done criteria per module:
  - Page has real content beyond `PagePlaceholder`
  - Uses React Query hooks for data fetching
  - Uses consistent loading, error, and empty states per `docs/ui-context.md`
  - Respects access control

## Next Tasks

1. Client actions
   - Status: Not started
   - Done criteria:
     - Add client flow
     - View client route/detail state
     - Edit client flow
2. Module implementations
   - Status: Not started
   - Done criteria:
     - Replace remaining placeholders with real module-specific screens
     - Keep route titles and sidebar navigation synchronized

## Open Questions

- Backend contract: What are the real API endpoints and response formats for each module?
- Auth model: Refresh-token handling is still pending; the token is stored for future support.
- Roles and permissions: Is `role` the only permission primitive, or are granular permissions required?

## Technical Debt

- Some UI still uses hardcoded color literals (`DropdownMenu` dark surface and `Table` sticky hover); promote these to tokens before reusing those values.
- No automated tests are currently documented or implemented.

## Architecture Decisions

### AD-001: Split API Clients Into Public and Private

- Decision: Use `publicApi` for unauthenticated calls and `privateApi` for authenticated calls with token attachment and global error handling.
- Location: `src/lib/axios.js`
- Rationale: Centralizes auth header injection and 401 behavior.

### AD-002: Session and Preference Persistence via Redux Persist

- Decision: Use `redux-persist` to automatically manage the persistence of the `auth` (session) and `layout` (UI preferences) slices in `localStorage`.
- Location: `src/store/index.js`, `src/App.jsx`
- Rationale: Replaces manual `localStorage` listeners and utility functions with a standardized, scalable solution that ensures state hydration before the app renders.

### AD-003: Route-Level Code Splitting

- Decision: All route pages are lazy-loaded in router with named exports.
- Location: `src/routes/index.jsx`
- Rationale: Keeps initial bundle smaller and enforces page boundaries.

### AD-004: Environment-Driven Configuration

- Decision: Use `.env` and `src/config/envConfig.js` for all environment-specific values (API base URLs, app names).
- Location: `.env`, `src/config/envConfig.js`, `src/lib/axios.js`
- Rationale: Avoids hardcoding URLs in code and simplifies switching between local mock servers and real backend environments.

### AD-005: Data-Driven Shared Components

- Decision: Enhance shared UI primitives with data-driven props (like `items` or `options`) while preserving manual composition capabilities.
- Location: `src/components/ui/Tabs/Tabs.jsx`, `src/components/ui/Select/Select.jsx`
- Rationale: Reduces boilerplate in feature components and ensures consistent rendering logic (e.g., badges, labels) across the application.

### AD-007: Separate Real Auth API From Mock Data API

- Decision: Keep `VITE_API_BASE_URL=/` for mock-backed module APIs and introduce `VITE_AUTH_API_BASE_URL` for the real admin login endpoint.
- Location: `.env*`, `src/config/envConfig.js`, `src/lib/axios.js`, `src/features/auth/api/login.js`
- Rationale: Allows login to use the available real backend without breaking existing mock-backed dashboard and module APIs.

### AD-006: Feature-First Page Orchestration

- Decision: Move all domain-specific composition and state management from `src/pages` into `src/features`. Pages must be "Lean" targets for the router.
- Location: All new screens (e.g., `DashboardOverview.jsx`, `ClientsPage.jsx`).
- Rationale: Enforces a clean separation between routing and business logic. Pages handle *where* you are; Features handle *what* you do.
- Implementation Pattern:
  - **Page**: `src/pages/module/MyPage.jsx` -> renders `<MyFeature />`. No API calls or logic allowed here.
  - **Feature**: `src/features/module/MyFeature.jsx` -> handles `useQuery`, state, and sub-component assembly.
  - **Export**: `src/features/module/index.js` -> `export * from './MyFeature'` to keep imports clean.


## Blockers

- None currently. If build or lint fails, record repro steps and file paths here.

## Quick References

- Login API: `VITE_AUTH_API_BASE_URL` + `/api/user/login`
- Router: `src/routes/index.jsx`
- Layouts: `src/layouts/MainLayout.jsx`, `src/layouts/AuthLayout.jsx`
- Auth store: `src/features/auth/store/*`
- Axios infra: `src/lib/axios.js` (accesses store for tokens)
- Tokens: `src/index.css`, Tailwind mapping in `tailwind.config.js`
- Clients page: `src/pages/clients/ClientsPage.jsx`
- Shared list UI: `src/components/ui/Table/Table.jsx`, `src/components/ui/Pagination/Pagination.jsx`, `src/components/ui/Select/Select.jsx`, `src/components/ui/Tabs/Tabs.jsx`, `src/components/ui/DropdownMenu/DropdownMenu.jsx`
- Chart components: `src/components/charts/DonutChart.jsx`, `src/components/charts/PieChart.jsx`
- Charts doc: `docs/chart-architecture.md`

## Known Issues

- Vite Fast Refresh warnings may occur if router exports change shape during HMR. This is a dev-only warning; keep router exports consistent rather than removing them.
