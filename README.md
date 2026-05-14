# inXits Dashboard

Role-based internal dashboard for inXits reporting and operations workflows. The app is a React/Vite SPA with authenticated private routes, a reusable dashboard shell, and module pages for clients, portfolio oversight, transactions, compliance, AUM reports, and related operations screens.

The current implemented module is the Clients list surface, which uses local mock data with reusable table, tabs, select, dropdown, and pagination primitives. Other business modules are routed through the dashboard shell and still use placeholders until their backend contracts and workflows are defined.

## Stack

- React 19 + Vite 8
- React Router DOM 7 data router
- Redux Toolkit for session and layout UI state
- TanStack React Query for server state
- Axios with public/private API clients
- TailwindCSS, Radix primitives, lucide-react, Sonner

## Local Setup

```bash
npm install
npm run dev
```

Mock login users live in `public/mock/user.json`.

## Environment Configuration

The project uses environment variables for configuration. Create a `.env.local` file for your local overrides.

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for API requests | `/` |
| `VITE_APP_NAME` | Application name | `inXits Dashboard` |
| `VITE_PAGINATION_LIMIT` | Default items per page | `10` |

## Scripts

```bash
npm run dev       # start Vite dev server
npm run build     # production build
npm run lint      # run ESLint
npm run lint:fix  # run ESLint with fixes
npm run format    # format source files with Prettier
npm run preview   # preview production build
```

## Project Docs

The `docs/` folder is the source of truth for architecture, UI rules, coding standards, and feature status.

- `docs/project-overview.md` - product purpose, scope, workflows, and success criteria
- `docs/architecture.md` - boundaries, invariants, and import rules
- `docs/ui-context.md` - design tokens, component rules, accessibility, and UX patterns
- `docs/code-standards.md` - linting, React rules, naming, state, and forbidden patterns
- `docs/ai-workflow-rules.md` - required workflow for AI-assisted changes
- `docs/progress-tracker.md` - current implementation status, decisions, and next tasks

## Development Rules

- Keep route pages lazy-loaded from `src/routes/index.jsx`.
- Keep reusable UI primitives in `src/components/ui/*` presentational.
- Put API hooks under `src/features/<domain>/api/*`.
- Use React Query for server data and Redux only for session or app UI state.
- Keep client list filtering/pagination local only while the backend contract is missing; move it to `src/features/clients/api/*` when real data is added.
- Run `npm run build` and `npm run lint` before merging changes.
