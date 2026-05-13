# inXits Dashboard Docs

This folder is the **source of truth** for how we build and evolve this repo.

It is optimized for **AI-assisted development**:
- reducing ambiguity
- enforcing architectural boundaries
- preventing bad patterns
- keeping implementation + docs in sync

## Quick links

- **Project overview (purpose/scope/success criteria)**: `docs/project-overview.md`
- **Architecture constraints (import boundaries, invariants)**: `docs/architecture.md`
- **UI context (tokens, a11y, patterns)**: `docs/ui-context.md`
- **Code standards (measurable rules + anti-patterns)**: `docs/code-standards.md`
- **AI workflow rules (execution contract)**: `docs/ai-workflow-rules.md`
- **Chart architecture (AmCharts 5 integration)**: `docs/chart-architecture.md`
- **Progress tracker (living status + decisions)**: `docs/progress-tracker.md`

## Required read order (for AI agents)

1. `docs/project-overview.md`
2. `docs/architecture.md`
3. `docs/code-standards.md`
4. `docs/ui-context.md`
5. `docs/ai-workflow-rules.md`
6. `docs/chart-architecture.md`
7. `docs/progress-tracker.md` (update on every feature change)

## New to the repo?

1. Start the app: `npm install` then `npm run dev`
2. Login (mock): users live in `public/mock/user.json`
3. Before implementing a feature:
   - read the docs above
   - run `npm run build` and `npm run lint` before merging changes

