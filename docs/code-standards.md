# Code standards (enforceable)

This is a **ruleset**, not advice. New code must comply. Deviations must be documented in the relevant PR description or inline code comment.

## Language & TypeScript rules

This repo is currently **JavaScript/JSX** (no `tsconfig.json` present). We still enforce "type discipline" via patterns.

- **TS introduction policy**
  - Do not add TypeScript "piecemeal" (random `.ts/.tsx` files) without adding a `tsconfig.json` + updating lint/build pipeline in the same PR.
  - If TypeScript is introduced, it must be introduced **module-by-module** (a folder at a time), not file-by-file across the app.

Measurable:
- **No `.ts/.tsx` files** may be added until `tsconfig.json` exists and `npm run build` passes.

## Formatting & linting

- **Prettier** is the formatter. Config is `.prettierrc` (semi, single quotes, printWidth 80).
- **ESLint** uses `eslint.config.js` (flat config) with:
  - `@eslint/js` recommended
  - `react-hooks` recommended
  - `react-refresh` Vite config
  - `eslint-config-prettier`

Measurable:
- `npm run lint` must pass before merging.
- New/edited files must match Prettier output (run `npm run format` for `src/**/*.{js,jsx,css}`).

## React rules (project-specific)

- **Route pages** must export a **named export** used by router lazy imports.
  - Example pattern in router: `.then((m) => ({ default: m.ClientsPage }))`
- **Buttons must use the shared primitive**
  - App, layout, feature, page, and UI composition code must import and render `Button` from `src/components/ui/Button/Button.jsx` for every button-like control.
  - Raw `<button>` is allowed only inside the shared `Button` primitive implementation.
  - Icon-only buttons must pass `aria-label`; form-submit buttons must explicitly use `type="submit"`.
- **Forms must follow the form design guide**
  - See `docs/form-design-guide.md` for comprehensive form patterns, validation, accessibility, and state management.
  - Use `react-hook-form` for all non-trivial forms (more than 2 fields).
  - Use shared UI form primitives as defined in `docs/form-design-guide.md`.
  - Forms in drawers must reset state on close.
- **No derived state in `useEffect`**
  - If you can compute it from props/state, use `useMemo` or inline computation.
- **No side effects in render**
  - No `localStorage` writes, navigation, or API calls directly in render path.
- **Suspense usage**
  - Route-level loading is owned by layouts (`MainLayout`, `AuthLayout`). Do not add additional Suspense boundaries per page without a reason.

Measurable:
- Any new page must have a router entry with `handle.title`.
- Any useEffect added must be justified as a true side effect (not derivation).
- `rg "<button|</button>" src` should only match `src/components/ui/Button/Button.jsx`.

## Naming & file conventions

- Components: `PascalCase.jsx`
- Pages: `SomethingPage.jsx` inside `src/pages/<module>/`
- Hooks: `useXxx.js` and must export **functions only** (no JSX exports)
- Redux slices: `xxxSlice.js`
- Utility modules: `camelCase.js` in `src/utils`

Measurable:
- Hooks files contain no JSX (`<` tokens in exportable code) and no React component exports.

## Import boundaries (must follow)

See `docs/architecture.md` for the full matrix.

Hard rules:
- `src/components/ui/*` may not import from `src/features/*` or `src/lib/*`.
- `src/features/*` may not import from `src/pages/*` or `src/layouts/*`.
- `src/utils/*` may not import React/Redux/Router/React Query/Axios.

Measurable:
- Any PR introducing a forbidden import must be rejected.

## State management standards

### Redux (client/UI state)

- Redux is for:
  - auth session data (token/role/user)
  - UI state (sidebar collapse, mobile sidebar open)
- Redux listener middleware persists:
  - auth session via `authUtils`
  - layout preferences via `layoutPreferences`

Rules:
- Do not store React Query responses in Redux.
- Do not store ephemeral form state in Redux.

Measurable:
- Any new "API data" reducer in Redux is not allowed.

### React Query (server state)

Rules:
- Queries/mutations must live under `src/features/<domain>/api/*` (or an equivalent domain module), not inside pages.
- Must use `publicApi` for unauthenticated endpoints and `privateApi` for authenticated endpoints.
- **No hardcoded base URLs**: API endpoints in features must be relative (e.g., `/clients`) and rely on the instance `baseURL` configured via environment variables.

Measurable:
- No direct `axios.get(...)` calls inside `src/pages/*` or `src/components/*`.
- No `baseURL` property overrides inside individual feature API hooks.

## API response format expectations

Current axios interceptors in `src/lib/axios.js` return `response.data`.

Rules:
- API hooks must treat the returned value as the final payload.
- Do not rely on `response.status` or axios response headers in features unless you explicitly bypass interceptors in a dedicated client.

Measurable:
- If a hook needs headers/status, it must use a separate axios instance or disable the interceptor pattern for that call explicitly (documented in the hook).

## Error handling rules

- Global HTTP error handling:
  - `privateApi` 401: dispatch logout + redirect to `/login` + toast (unless `skipToast`)
  - `publicApi`: toast + throw enriched error containing `message`
- Feature-level error handling:
  - Use inline errors for form validation/business errors (LoginForm pattern).

Measurable:
- Any `catch` that swallows errors (empty catch) is forbidden.
- Any mutation that can fail must either:
  - surface an inline error state, or
  - rethrow and rely on global handling (documented).

## Async handling (deterministic)

- For React Query mutations, always provide:
  - `onSuccess` path that updates UI/session deterministically
  - `onError` path that sets UI error state for expected errors
- Never trigger navigation in `finally`.

Measurable:
- Mutation handlers must not navigate on error.

## Form handling standards

- Non-trivial forms use `react-hook-form`.
- Use shared `Input` component for consistent labels/a11y.
- Validation rules must be co-located with field registration (LoginForm pattern).

Measurable:
- Any new form field must have:
  - `required` semantics if required
  - validation error message (string)

## Performance rules

- **Lists/tables**:
  - >100 rendered rows must implement pagination and/or virtualization.
- **Component size limits**:
  - UI primitive components: **200 lines or fewer**
  - Page components: **300 lines or fewer**
  - If exceeded, split into smaller components or feature modules.

Measurable:
- Files exceeding limits must be refactored before adding more logic.

## Security rules (frontend)

- Never log tokens to console.
- Never store secrets beyond the existing mock token mechanism.
- Do not put credentials in code; mock users belong in `public/mock/user.json` only for local demo.

Measurable:
- Any `console.log` of auth/session is forbidden.

## Forbidden patterns (reject on review)

- Direct network calls in UI primitives/pages (`axios.*` or `fetch`).
- `localStorage` access outside `src/utils/*` or store middleware.
- `window.location.href = ...` usage except inside centralized auth failure handling (`axios.js`).
- Hardcoded hex colors in JSX classnames (e.g. `bg-[#123456]`) except for **explicitly documented** cases (currently header avatar uses `bg-[#dff3fb]`; do not copy this pattern).
- Deep relative imports when alias `@` is available for cross-cutting code.

- Use specific aliases for cross-module imports:
  - `@features/*` for feature modules
  - `@components/*` for shared UI
  - `@utils/*` for helpers
  - `@lib/*` for infrastructure
  - `@store/*` for Redux
  - `@hooks/*` for global hooks
- Keep route titles in router `handle.title` and rely on `getCurrentRouteTitle`.
