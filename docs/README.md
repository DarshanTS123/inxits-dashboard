# inXits Dashboard Docs

> ## CRITICAL AI EXECUTION CONTRACT
>
> If you are an AI assistant, coding agent, autonomous IDE, or implementation model reading this repository:
>
> You MUST read and comply with ALL relevant `.md` files inside this `/docs` directory BEFORE:
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

AI assistants MUST read files in the following order:

1. `docs/project-overview.md`
2. `docs/architecture.md`
3. `docs/code-standards.md`
4. `docs/ui-context.md`
5. `docs/form-design-guide.md`
6. `docs/ai-workflow-rules.md`
7. `docs/chart-architecture.md`

This order matters because later documents depend on constraints defined earlier.

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