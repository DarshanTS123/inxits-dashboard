# AI workflow rules (execution contract)

These rules define how AI agents must work in this repo to preserve architecture consistency and avoid regressions.

## 0) Non-negotiable order of operations

AI must follow this order for any change that touches code:

1. Read `docs/project-overview.md` and `docs/architecture.md`
2. Identify impacted boundaries (pages/features/components/ui/lib/utils)
3. Implement **types/contracts first** (API shapes, state shapes) before UI wiring
4. Validate imports obey forbidden directions (see `docs/architecture.md`)
5. Run verification:
   - `npm run build` (required for any PR)
   - `npm run lint` (required for any PR)

## 1) Scoping rules

- **Small change**: single module, 2 or fewer files, no new routes, no new shared components.
- **Feature change**: new page or domain flow, touches 3-10 files, may require a feature module.
- **Architecture change**: changes boundaries, provider setup, router structure, or storage/auth model.

Rules:
- If a change is "architecture change", document the rationale as a comment or inline note in the relevant file.
- If a change touches **both** `src/lib/*` and `src/components/ui/*`, it must be split (prevents infrastructure leaking into UI primitives).

## 2) Feature development workflow (deterministic)

When adding a new module or feature:

1. **Define the route**
   - Add a lazy import to `src/routes/index.jsx`
   - Add `handle.title` (usually the section name; detail routes reuse the list title — entity name goes in breadcrumbs + page `h1`, not the app bar)
2. **Define domain boundary**
   - If feature requires API/state/hooks, create `src/features/<domain>/...`
3. **Create the mock API payload (mandatory for data-driven features)**
   - Add `public/mock/<domain>.json` (or `public/mock/<domain>-<screen>.json` for multi-screen domains)
   - Shape the JSON to match the screen contract: metrics, tables, charts, detail fields, filters, etc.
   - Use realistic sample values; keep field names stable so swapping to a real endpoint later is a URL change only
   - Do **not** embed large mock datasets inside JSX, page files, or presentational components
4. **Define API hooks**
   - Create `src/features/<domain>/api/*.js` that fetches the mock JSON via `privateApi.get('/mock/<domain>.json')` (or `publicApi` for unauthenticated reads)
   - Wrap reads in TanStack React Query hooks with query key factories (e.g. `portfolioKeys`, `clientDetailKeys`)
   - Normalize or merge mock payloads in the API module when needed (see `clientDetail.js`, `portfolio.js`)
5. **Define state**
   - If global UI/session state is required, add a Redux slice, selectors, and listener middleware persistence if needed
6. **Compose page and feature UI**
   - `src/pages/<domain>/<Domain>Page.jsx` is a lean wrapper that renders the feature component and owns loading/error/not-found branching
   - Feature orchestrator/components consume React Query hooks; presentational children receive shaped data via props
7. **UI primitives**
   - Only after above, add/extend `src/components/ui/*` primitives if reuse is at least 2 places

**Mock API is required by default**: unless a real backend endpoint is already available and documented, every new data-driven feature must ship with a mock JSON file and a feature API module that reads it. Skipping the mock layer requires explicit user approval.

**Reference implementations**:
- Clients — list (`ClientsPage` → `Clients`) via `public/mock/clients.json`; detail (`ClientDetailPage` → `ClientDetail`) merging `clients.json` + `client-details.json`
- Portfolio — overview (`PortfolioPage` → `PortfolioOversight`) via `public/mock/portfolio.json`
- Dashboard — `public/mock/dashboard.json` via `src/features/dashboard/api/dashboard.js`

## 3) Boundary validation (must-check list)

Before finalizing:

- `components/ui/*` imports only React, utils, ui primitives, Radix/icons
- `utils/*` contains no React imports and no DOM writes except `localStorage` helpers
- `features/*` does not import from `pages/*` or `layouts/*`
- `pages/*` does not contain raw axios calls
- Any `localStorage` usage is in `utils/*` or store middleware only

## 4) Safe refactoring rules

- Prefer mechanical refactors:
  - rename file + update imports
  - extract component/hook with identical runtime behavior
- Do not combine refactor + new behavior unless the diff stays reviewable.

Rules:
- If a refactor changes public exports of a module used by router lazy imports, update router mapping in the same change.
- If changing auth/session shape, update:
  - `createAuthSession` in `authSlice`
  - `authUtils` storage contract
  - any selector usage

## 5) Verification steps (required)

### Always required

- `npm run build`
- `npm run lint`

### When routes change

- Verify navigation:
  - unauthenticated private route redirects to `/login`
  - authenticated `/login` redirects to `/dashboard`
  - route title updates in header

### When auth changes

- Verify:
  - token persistence in `localStorage`
  - 401 behavior: logout + redirect + toast (unless `skipToast`)

## 6) Documentation update rules

- Any new feature must:
  - document new env vars in `docs/project-overview.md` if introduced
  - include a mock JSON file under `public/mock/` when the feature is data-driven (unless a real API is already wired)
- Any new UI token must:
  - be added to `src/index.css`
  - be referenced via Tailwind alias in `tailwind.config.js` if used broadly
  - be documented in `docs/ui-context.md` (Color tokens section)
- Any new chart color palette must:
  - be defined in the parent feature/page and passed via `colors`, `bands`, or `branchColors`
  - optionally mirror suggested values from `--chart-*` CSS variables in `src/index.css`
  - be documented in `docs/chart-architecture.md` when introducing a reusable palette for a domain
- Any new UI layout, spacing, or typography pattern must:
  - follow `docs/ui-context.md` (Typography + Spacing, layout & density sections)
  - extend `docs/ui-context.md` if the pattern is reusable (do not leave one-off `gap-*` / `text-[Npx]` only in feature code)
- UI-only changes (no content/copy changes) must still use the canonical scale: default section `gap-5`, card grids `gap-4` or `gap-5`, paired cards `items-stretch` + shared height

## 7) When to split work (hard thresholds)

Split into smaller PRs/steps when any condition is true:

- >10 files touched
- introduces both new route(s) and new shared UI primitives
- changes `src/lib/axios.js` interceptors and any feature logic simultaneously

Splitting pattern:
- PR1: contracts + hooks + routing skeleton
- PR2: UI composition + polish

## 8) Context synchronization rules

AI must keep these in sync:

- Router paths (`src/routes/index.jsx`) and sidebar nav items (`src/components/layout/Sidebar/Sidebar.jsx`)
- Route titles (`handle.title`) and header title derivation (`getCurrentRouteTitle`) — detail pages: section title in app bar, entity name in page content only
- Session shape (`authSlice`), storage (`authUtils`), and guards (`useAuth`)

If any of the above changes, the change must include updates to all linked areas.
