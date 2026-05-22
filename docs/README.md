# inXits Dashboard Docs

> ## CRITICAL AI EXECUTION CONTRACT
>
> If you are an AI assistant, coding agent, autonomous IDE, or implementation model reading this repository:
>
> You MUST treat this file as the documentation entry point, not as the
> complete documentation. Reading `docs/README.md` is only step zero.
>
> You MUST read and comply with EVERY `.md` file inside this `/docs`
> directory BEFORE:
>
> - proposing implementations
> - generating code
> - modifying existing files
> - refactoring architecture
> - introducing dependencies
> - restructuring folders
> - updating state management
> - changing UI patterns
>
> Do not ask the user to paste the other documentation files. Discover them
> from this folder, read them yourself, and follow the strict read order below.
> If new `.md` files are added to `/docs`, read them too before coding.
>
> Failure to follow documented rules invalidates the implementation.
>
> AI assistants MUST:
>
> - prefer existing patterns before creating new abstractions
> - reuse shared utilities/components/hooks whenever possible
> - preserve architectural boundaries
> - preserve feature isolation
> - avoid introducing duplicate logic
> - avoid assumptions about undocumented behavior
> - avoid inventing patterns not defined in this repository
> - keep implementation consistent with existing code style
> - update relevant documentation when patterns or architecture change
>
> AI assistants MUST NOT:
>
> - bypass architectural constraints for convenience
> - introduce unnecessary dependencies
> - duplicate business logic
> - place business logic directly inside presentation components
> - create large unstructured components
> - use `any` without explicit justification
> - introduce inconsistent naming conventions
> - bypass shared UI primitives/tokens
> - hardcode design values already available as tokens
> - create competing abstractions for existing solutions
>
> Before implementation, AI assistants should identify:
>
> - affected architectural layers
> - state ownership
> - data ownership and API/mock API source (create `public/mock/<domain>.json` + feature API module for new data-driven features)
> - reusable existing modules
> - validation requirements
> - accessibility implications
> - responsive behavior implications
> - performance implications
> - testing impact
> - documentation impact
>
> Before considering work complete, AI assistants MUST:
>
> - run `npm run lint`
> - run `npm run build`
> - ensure JavaScript runs without errors
> - ensure imports follow architecture rules
> - ensure screen data flows through the documented API/mock API pattern
> - ensure accessibility requirements are met
> - ensure responsive behavior works correctly
> - ensure loading/error/empty states are handled
> - update documentation if patterns changed

---

# Purpose

This folder is the **source of truth** for how this repository is designed, implemented, and evolved.

The documentation exists to:

- minimize implementation ambiguity
- enforce scalable architectural boundaries
- standardize engineering decisions
- maintain UI/UX consistency
- prevent architectural drift
- improve AI-assisted development reliability
- reduce implementation hallucinations
- preserve long-term maintainability

---

# Documentation Index

| File | Purpose |
|---|---|
| `docs/project-overview.md` | Product goals, scope, success criteria |
| `docs/architecture.md` | Architecture rules, module boundaries, invariants |
| `docs/code-standards.md` | Measurable engineering standards and anti-patterns |
| `docs/ui-context.md` | Design system, tokens, accessibility, UI patterns |
| `docs/form-design-guide.md` | Form architecture and validation standards |
| `docs/chart-architecture.md` | AmCharts integration and chart abstractions |
| `docs/ai-workflow-rules.md` | AI execution workflow and implementation contract |

---

# Required Read Order (STRICT)

AI assistants MUST read every documentation file in this directory before
coding. Start with this README, then read the files below in this exact order:

1. `docs/project-overview.md`
2. `docs/architecture.md`
3. `docs/code-standards.md`
4. `docs/ui-context.md`
5. `docs/form-design-guide.md`
6. `docs/ai-workflow-rules.md`
7. `docs/chart-architecture.md`

After these required files, read any additional `.md` files present in
`docs/`. This order matters because later documents depend on constraints
defined earlier.

Do not proceed to implementation until this read pass is complete.

---

# Rule Precedence

If documentation conflicts, follow this priority order:

1. `architecture.md`
2. `code-standards.md`
3. `ui-context.md`
4. feature-local conventions
5. implementation preference

AI assistants MUST NOT resolve conflicts by assumption.

---

# Standardized Technology Decisions

These technologies are considered canonical unless explicitly documented otherwise.

| Concern | Standard |
|---|---|
| Framework | React + JavaScript |
| Build Tool | Vite |
| Forms | React Hook Form |
| Validation | Zod |
| Server State | TanStack React Query |
| Client State | Redux Toolkit |
| UI Library | Tailwind CSS + shadcn/ui |
| Charts | AmCharts 5 |
| Styling | Tailwind utility classes + centralized index.css |
| Routing | React Router |

AI assistants should avoid introducing competing solutions unless explicitly required.

---

# Recommended Project Structure

```txt
src/
├── assets/           # static assets (images, icons, etc.)
├── components/       # reusable UI components (shadcn/ui, charts, etc.)
├── config/           # environment configurations
├── features/         # isolated business domains
├── hooks/            # reusable global hooks
├── layouts/          # wrapper layouts (Auth, Main)
├── lib/              # third-party library wrappers (axios, react-query)
├── pages/            # route-level composition
├── providers/        # context providers
├── routes/           # routing logic and guards
├── services/         # API calls and integrations
├── store/            # Redux toolkit store and slices
├── styles/           # global styles and theming
└── utils/            # pure reusable utilities
```

---

# Architectural Principles

## Mock API And Screen Data (mandatory for new features)

Every new **data-driven** feature must be implemented against the repository
mock API layer first. Do not wait for backend endpoints and do not inline
large static datasets in components.

### Required workflow

When creating a new feature, follow this order:

1. **Create mock payload** — `public/mock/<domain>.json`
   - One file per screen, or one file per domain with named sections (metrics, tables, charts, etc.)
   - Match the shape the UI will consume; use stable field names for future real-API swap
2. **Create feature API module** — `src/features/<domain>/api/<domain>.js`
   - Fetch with `privateApi.get('/mock/<domain>.json')` (or `publicApi` when unauthenticated)
   - Export query key factories and React Query hooks (`usePortfolioData`, `useClients`, etc.)
   - Normalize or merge payloads here when a screen combines multiple mock files
3. **Build feature UI** — hooks in orchestrators; props into presentational components
4. **Wire route page** — lean wrapper only; loading/error/empty states at page or feature root

### Rules

- Mock JSON lives under `public/mock/*.json` only (never in `src/`).
- All screen data flows through the feature API module + React Query — not through page JSX or UI primitives.
- Query keys stay in the API module so cache identity is explicit.
- Route pages render the feature component; they do not fetch data or hold large mock objects.
- Static arrays inside components are acceptable only for tiny UI config (select options, tabs, local labels).

### Examples in this repo

| Feature | Mock file | API module |
|---|---|---|
| Clients (list) | `public/mock/clients.json` | `src/features/clients/api/clients.js` |
| Client detail | `public/mock/client-details.json` (+ list row) | `src/features/clients/api/clientDetail.js` |
| Portfolio | `public/mock/portfolio.json` | `src/features/portfolio/api/portfolio.js` |
| Dashboard | `public/mock/dashboard.json` | `src/features/dashboard/api/dashboard.js` |
| Auth (demo) | `public/mock/user.json` | `src/features/auth/api/login.js` |

### When a real API exists

Replace the mock URL in the feature API module only. Keep the hook signature, query keys, and normalization layer unchanged so UI components do not need to change.

See also: `docs/ai-workflow-rules.md` §2 (feature development workflow).

---

## Feature Isolation

Features should remain isolated and self-contained.

Avoid:
- cross-feature imports
- hidden dependencies
- shared mutable state
- tightly coupled UI logic

---

## Separation of Concerns

Keep responsibilities separated:

| Layer | Responsibility |
|---|---|
| UI Components | presentation only |
| Hooks | orchestration and composition |
| Services | API communication |
| Store | application state |
| Utils | pure reusable logic |

---

## Reuse Before Creation

Before creating:
- components
- hooks
- utilities
- services
- chart wrappers
- validation helpers

AI assistants MUST first search for existing implementations.

Avoid duplicate abstractions.

---

# Forbidden Patterns

The following patterns are prohibited unless explicitly approved:

- business logic inside UI components
- direct API calls inside presentational components
- large monolithic components
- deeply nested prop drilling
- duplicated chart configuration
- duplicated validation logic
- magic numbers/colors/spacing
- uncontrolled form state patterns
- bypassing shared theme tokens
- excessive global state usage
- unnecessary `useEffect`
- `any` without documented reason
- silent error handling
- mutable shared utilities

---

# Performance Expectations

AI assistants should optimize for:

- minimal rerenders
- lazy loading where appropriate
- memoization of expensive computations
- virtualization for large datasets
- bundle size awareness
- stable dependency arrays
- avoiding unnecessary localStorage usage
- efficient chart rendering
- efficient table rendering

---

# Accessibility Requirements

All implementations should support:

- keyboard accessibility
- screen reader compatibility
- semantic HTML
- focus visibility
- sufficient contrast ratios
- accessible labels
- responsive layouts

Accessibility is required, not optional.

---

# Definition of Done

A task is complete only if:

- architecture rules are respected
- lint passes
- build passes
- accessibility requirements are satisfied
- loading/error/empty states exist
- for new data-driven features: `public/mock/<domain>.json` exists and screen data is fetched via the feature API module (React Query + `privateApi`/`publicApi`), not inline in components
- responsive behavior works
- duplicated logic is avoided
- documentation is updated if needed
- implementation aligns with existing patterns

---

# New to the Repository?

## Setup

```bash
npm install
npm run dev
```

---

## Mock Login

Mock users are located at:

```txt
public/mock/user.json
```

---

## Before Opening a PR

```bash
npm run lint
npm run build
```

Verify:
- no runtime JavaScript errors
- no console warnings
- no architecture violations
- no accessibility regressions

---

# Documentation Maintenance Rule

Documentation must evolve alongside implementation.

Any change affecting:
- architecture
- state management
- forms
- charts
- UI patterns
- shared abstractions
- folder structure

MUST include corresponding documentation updates.

---

# Final Principle

Consistency is more valuable than novelty.

AI assistants should prioritize:
- predictability
- maintainability
- reuse
- clarity
- architectural integrity

over unnecessary abstraction or reinvention.
