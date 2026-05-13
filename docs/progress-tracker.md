# Progress Tracker

This file is updated on every feature change. It helps humans and AI agents quickly understand current state, decisions, and next work.

## Current Phase

- Phase: Foundation plus first module implementation
- Why: Router, layout, auth, shared UI primitives, and the first real client list surface are implemented. Most other business modules are still placeholders.

## Completed Features

### Authentication (Mock)

- Status: Completed
- Scope:
  - Login page and form
  - Session persistence in `localStorage`
  - Guest and private route guards
- Done criteria:
  - Login works with mock users in `public/mock/user.json`
  - Authenticated users cannot access `/login`
  - Unauthenticated users cannot access private routes
  - 401 from `privateApi` logs out and redirects to `/login`

### App Shell

- Status: Completed
- Scope:
  - `MainLayout` with sidebar, header, and suspense loader
  - Sidebar collapse preference persistence
  - Header title derived from route `handle.title`
- Done criteria:
  - Sidebar nav routes match router paths
  - Desktop collapsed state persists across refreshes
  - Header updates title when route changes

### Shared UI Primitives

- Status: Completed for current dashboard needs
- Scope:
  - `Button`, `Input`, `Tooltip`, `DropdownMenu`, `Tabs`, `Select`, `Table`, `Pagination`, `PageLoader`, `PagePlaceholder`
- Done criteria:
  - Primitives are presentational
  - Components support composition through `className` and props
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
3. Module implementations
   - Status: Not started
   - Done criteria:
     - Replace remaining placeholders with real module-specific screens
     - Keep route titles and sidebar navigation synchronized

## Open Questions

- Backend contract: What are the real API endpoints and response formats for each module?
- Auth model: Will mock users move to a real login endpoint? If yes, what token format and refresh strategy?
- Roles and permissions: Is `role` the only permission primitive, or are granular permissions required?

## Technical Debt

- Some UI still uses hardcoded color literals (`DropdownMenu` dark surface and `Table` sticky hover); promote these to tokens before reusing those values.
- No automated tests are currently documented or implemented.

## Architecture Decisions

### AD-001: Split API Clients Into Public and Private

- Decision: Use `publicApi` for unauthenticated calls and `privateApi` for authenticated calls with token attachment and global error handling.
- Location: `src/lib/axios.js`
- Rationale: Centralizes auth header injection and 401 behavior.

### AD-002: Session Stored in localStorage

- Decision: Persist `{ token, role, user }` in localStorage via `authUtils` and Redux listener middleware.
- Location: `src/utils/auth.js`, `src/store/index.js`
- Rationale: Simple SPA session persistence for current scope.

### AD-003: Route-Level Code Splitting

- Decision: All route pages are lazy-loaded in router with named exports.
- Location: `src/routes/index.jsx`
- Rationale: Keeps initial bundle smaller and enforces page boundaries.

## Blockers

- None currently. If build or lint fails, record repro steps and file paths here.

## Quick References

- Mock users: `public/mock/user.json`
- Router: `src/routes/index.jsx`
- Layouts: `src/layouts/MainLayout.jsx`, `src/layouts/AuthLayout.jsx`
- Auth store: `src/features/auth/store/*`
- Axios infra: `src/lib/axios.js`
- React Query client: `src/lib/react-query.js`
- Tokens: `src/index.css`, Tailwind mapping in `tailwind.config.js`
- Clients page: `src/pages/clients/ClientsPage.jsx`
- Shared list UI: `src/components/ui/Table/Table.jsx`, `src/components/ui/Pagination/Pagination.jsx`, `src/components/ui/Select/Select.jsx`, `src/components/ui/Tabs/Tabs.jsx`, `src/components/ui/DropdownMenu/DropdownMenu.jsx`

## Known Issues

- Vite Fast Refresh warnings may occur if router exports change shape during HMR. This is a dev-only warning; keep router exports consistent rather than removing them.
