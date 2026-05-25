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

- Login uses the real admin API through `VITE_AUTH_API_BASE_URL`.
- Session data persists in `localStorage` as token, role, and user.
- Guest users can access `/login`.
- Authenticated users are redirected away from `/login`.
- Private routes require authentication.

### Module Navigation

- Sidebar navigation links to module pages.
- Top header title is derived from router `handle.title`.
- Route-level pages are lazy-loaded through `src/routes/index.jsx`.

### Client Management

#### Clients list (`/clients`)

- Tabbed client states (All, Invited, Ageing, Inactive), search by selected column, pagination, and row action menus.
- Row action menus support opening `Modal` components (e.g., "Change RM" and "Mark Inactive" actions) for quick operational updates without leaving the page.
- Row click navigates to `/clients/:id`.
- Data is fetched via `src/features/clients/api/clients.js` using `privateApi` from `public/mock/clients.json`.
- Tab constants live in `src/features/clients/constants/clientTabs.js`.
- The list is backed by shared UI primitives: `Tabs`, `Select`, `Input`, `DataTable`, `DropdownMenuList`, `Pagination`, and `Button`.
- API integration follows the project's standard React Query patterns.

#### Client detail (`/clients/:id`)

- Lean page: `src/pages/clients/ClientDetailPage.jsx` loads data and delegates rendering to `src/features/clients/components/ClientDetail.jsx`.
- Data is fetched via `src/features/clients/api/clientDetail.js` (`useClient`), merging list rows from `public/mock/clients.json` with section templates/overrides from `public/mock/client-details.json`.
- Layout pattern: `Breadcrumbs` → page title → summary cards grid → data-driven `Tabs`.
- Summary cards (`ClientDetailSummaryCards`) use the parent-defined card array pattern with `Card`, `DetailFieldGrid`, and `GaugeChart`; typography inherits shared defaults from `Card` and `DetailFieldGrid`.
 - Implementation note: In some designs the primary or featured summary card may be required to take the full row on medium and larger screens; implement this by applying `md:col-span-2` to the featured card wrapper when mapping the parent card array.
- Personal tab (`ClientDetailPersonalTab`) renders identity, address, nominees, FATCA, bank, and document sections as stacked cards.
- Remaining tabs (Portfolios, Transactions, Family member, Reports) render placeholders until their workflows are implemented.
- Loading, not-found, and error states are handled at the page layer (`PageLoader`, `ClientDetailNotFound`, `ClientDetailError`).
- App bar / document title stays **Clients** (`handle: { title: 'Clients' }`); the entity name appears in breadcrumbs and the page `h1`, not in the header.

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
- Analytics are powered by AmCharts 5; slice/band colors are passed from parent features, with adaptive labels and unified `Card` containers.
- All layout sections are encapsulated in the shared `Card` primitive for visual consistency.

### Portfolio Oversight (`/portfolio`)

- Lean page: `src/pages/portfolio/PortfolioPage.jsx` renders `src/features/portfolio/PortfolioOversight.jsx`.
- Data is fetched via `src/features/portfolio/api/portfolio.js` (`usePortfolioData`) from `public/mock/portfolio.json`.
- Orchestrator owns client-side holdings pagination (`page`, `pageSize`); mock payload normalization expands holdings rows when `total` exceeds sample items.
- Layout sections (top to bottom):
  - **Controls** (`PortfolioControls`): portfolio scope `Select`, disabled download action, date-range button, NAV as-of note.
  - **Metric cards** (`PortfolioMetricCards`): five summary tiles (current value, invested value, gain/loss, XIRR, scheme count) via `Card` label/value/meta pattern.
  - **Investment summary** (`PortfolioInvestmentSummary`): two-column card with embedded `PieChart` (platform split) and `DataTable` (investment sources by platform).
  - **Allocation charts** (`PortfolioAllocationCharts`): responsive 2×2 grid of domain-owned `PieChart` cards (asset, market cap, sector, geography).
  - **Holdings table** (`PortfolioHoldingsTable`): paginated `DataTable` with scheme status badges, `StarRating` via `cellType: 'rating'`, and footer `Pagination`.
- Domain config lives in `src/features/portfolio/portfolioConfig.js` (`PLATFORM_COLORS`, `investmentSourceColumns`).
- Route title: **Portfolio Oversight** (`handle: { title: 'Portfolio Oversight' }`).

### Support Management (`/support`)

- Lean page: `src/pages/support/SupportPage.jsx` renders `src/features/support/SupportManagement.jsx`.
- Data is fetched via `src/features/support/api/supportApi.js` (`useSupportData`) from `public/mock/support.json`.
- Layout sections:
  - **Support stats** (`SupportStats`): row-based cards for today's received, open, and resolved tickets with status dots.
  - **Filters** (`SupportFilters`): ticket count, column-agnostic search, and filter controls.
  - **Ticket table** (`SupportTable`): `DataTable` with ticket ID, client details, request reason, assigned RM, and status indicators.
- Orchestrates pagination and search state at the feature layer, passing results to `Pagination` and `SupportTable`.
- Route title: **Support Management** (`handle: { title: 'Support Management' }`).

### Data Workflows

- Server reads and writes should use TanStack React Query and Axios clients.
- Authenticated requests must use `privateApi`.
- API hooks should return unwrapped payload data because axios interceptors already return `response.data`.

## Key Features

- Private route shell: `MainLayout` with sidebar, header, and suspense loader.
- Public auth shell: `AuthLayout`.
- Route guards: `PublicRoute`, `PrivateRoute`, and `RoleProtectedRoute`.
- Global document title management: `DocumentTitle` and route `handle.title`.
- UI primitives: `Button`, `Input`, `Tooltip`, `DropdownMenu`, `Tabs`, `Select`, `Table`, `Pagination`, `PageLoader`, `PagePlaceholder`, `Card`, `Badge`, `Modal`, `Drawer`, `RadioGroup`, `StarRating`, and `Breadcrumbs`.
- Analytics Charts: High-fidelity `DonutChart`, `PieChart`, `GaugeChart`, and `SunburstChart` with smart decimal labels, custom legends, skeleton loading, and optional embedded (card-less) pie mode for nested layouts.
- Dashboard capabilities: linked statistics, categorical announcements with badges, summary performance tables, and functional transaction pagination.
- Clients list capabilities: state tabs with counts, column-scoped search, paginated rows, sticky first/action columns, row action menu, row navigation to detail, and empty state messaging.
- Client detail capabilities: breadcrumb navigation, summary cards (personal, risk profile gauge, KYC, relationship manager), tabbed sections with read-only field grids, and dedicated not-found/error recovery states.
- Portfolio oversight capabilities: portfolio scope controls, summary metric cards, platform split visualization, allocation pie grid, paginated holdings with inXits star ratings, and buy/sell/hold status indicators.

## In Scope

- Adding new route-level modules under the existing router and layouts.
- Implementing feature domains under `src/features/*` when they include API hooks, state, or domain components.
- Integrating APIs through `src/lib/axios.js` and React Query.
- Extending design tokens in `src/index.css` and using Tailwind token aliases (see `docs/ui-context.md` for the full palette, Figma reference, and accessibility rules).

## Development Patterns

### Feature-First Page Orchestration (Mandatory)

To maintain a scalable and clean architecture, we follow a strict separation between routing and domain logic:

1.  **The Page Layer (`src/pages/<domain>/*`)**:
    *   **Role**: Serves as the entry point for the router.
    *   **Responsibility**: Only handles top-level routing concerns and metadata (like `handle.title`).
    *   **Constraint**: Must be a "Lean Page". It should only import and render a single Feature Component. It should **not** handle API calls, complex state, or granular component assembly.
    *   *Example*: `ClientsPage.jsx` returns `<Clients />`; `ClientDetailPage.jsx` loads via `useClient(id)` and returns `<ClientDetail />` or error states.

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
