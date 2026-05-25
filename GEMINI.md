# Project Rules & Guidelines

This project follows a strict set of architectural and workflow rules documented in the `docs/` directory. All changes must adhere to these rules.

## Primary Documentation

The AI assistant has read and understood the following documents in the required order:

1. [docs/project-overview.md](docs/project-overview.md) - Purpose, major workflows, and business goals.
2. [docs/architecture.md](docs/architecture.md) - Tech stack, folder ownership, dependency rules, and invariants.
3. [docs/code-standards.md](docs/code-standards.md) - Naming conventions, React rules, and state management standards.
4. [docs/ui-context.md](docs/ui-context.md) - Design tokens, typography, and spacing.
5. [docs/form-design-guide.md](docs/form-design-guide.md) - Comprehensive form patterns and shared primitives.
6. [docs/ai-workflow-rules.md](docs/ai-workflow-rules.md) - AI execution workflow and implementation contract.
7. [docs/chart-architecture.md](docs/chart-architecture.md) - AmCharts 5 implementation and color palettes.

## Mandatory Execution Contract

- **Feature-First Orchestration**: Move domain-specific composition and state management from `src/pages` into `src/features`. Pages must be lean targets for the router.
- **Mock API Layer**: New data-driven features MUST use mock JSON served from `public/mock/` and fetch via feature API modules (React Query + `privateApi`/`publicApi`). Do not inline datasets.
- **Dependency Rules**: Follow the import boundary matrix. No imports from `pages` or `layouts` into `features`.
- **UI Primitives**: Always use shared primitives from `src/components/ui/*`. Raw `<button>` or custom styled buttons are forbidden.
- **No Derived State in Effects**: Use `useMemo` for derived state.
- **Async Handling**: Use React Query for all server state. No API calls in render path.
- **Verification**: `npm run build` and `npm run lint` are required for every PR.

## Memory & Context Management

As per user directive, the `.md` files in the `docs/` directory are the primary source of truth for managing context and memory. The AI assistant will update these files (or create new ones in `docs/`) when patterns or architecture change.
