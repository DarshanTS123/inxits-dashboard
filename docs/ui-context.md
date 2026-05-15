# UI context (design + implementation contract)

This document defines how UI is built in this repo: tokens, Tailwind usage, component conventions, and enforceable UX/accessibility rules.

## Design system foundation

### Token source of truth

- Global design tokens are CSS variables defined in `src/index.css` under `:root`.
- Tailwind consumes tokens via `tailwind.config.js` color aliases (e.g. `primary: var(--primary)`).

**UI Invariant U0**: If a color/size must be reused, it must be a **token** (CSS variable + Tailwind alias if applicable), not a repeated literal.

### Color tokens (current)

Defined in `src/index.css`:

- **Brand**
  - `--primary`
- **Backgrounds**
  - `--bg-page`, `--bg-layer-1`, `--bg-layer-2`, `--bg-popup`, `--bg-topnav`, `--bg-helper`
- **Text**
  - `--text-heading`, `--text-subheading`, `--text-paragraph`, `--text-disabled`, `--text-enabled`, `--text-label`, `--text-on-primary`, `--text-on-disabled`
- **Strokes / outlines**
  - `--stroke-divider`, `--btn-outline-secondary`, `--outline-active`, `--outline-disabled`
- **Icons**
  - `--icon-disabled`, `--icon-active`, `--icon-primary`
- **Feedback**
  - `--success`, `--warning`, `--error`, `--info`
- **Sidebar**
  - `--sidebar-header-bg`, `--sidebar-bg`, `--sidebar-item-active-bg`, `--sidebar-item-active-text`, `--sidebar-item-text`
  - widths: `--sidebar-expanded-width`, `--sidebar-collapsed-width`, derived `--sidebar-width`

### CSS variable naming convention (enforced for new tokens)

New tokens must follow:

- **Base palette**: `--<category>-<name>` where category is one of `bg|text|icon|stroke|btn|sidebar|status`
  - Examples: `--bg-overlay`, `--text-muted`, `--stroke-subtle`
- **Status tokens**: `--status-<state>` (prefer over ad-hoc): `--status-success`, `--status-error`
- **Component-only tokens** are forbidden unless the token is used by at least 2 components.

**Forbidden**: `--blue-500`, `--color1`, `--buttonColor`.

## Typography

- Use Tailwind utility classes for sizing and weight.
- Prefer semantic mappings:
  - page titles: `text-3xl font-bold tracking-tight text-text-heading` (see `PagePlaceholder`)
  - section titles: `text-base font-semibold text-subheading` (see `Header`)

**UI Rule T1**: Do not introduce custom `font-size` literals in CSS for app UI. Use Tailwind text utilities.

## Spacing & radius

- Spacing via Tailwind scale (`p-4`, `gap-3`, etc.).
- Radius: prefer `rounded-lg` and `rounded-xl` in components; global radius token exists (`--radius: 0.5rem`).

**UI Rule SR1**: New UI primitives must expose spacing via composition (className) rather than hardcoding multiple layout variants unless explicitly needed.

## Component conventions (repo patterns)

### UI primitives

Location: `src/components/ui/*`

Rules:

- **Forward refs** for input-like or clickable primitives (`React.forwardRef`), as done in `Button` and `Input`.
- Use `cn()` from `src/utils/cn` to merge classes.
- Must support `className` and spread props (`...props`) so pages/features can extend behavior.
- Must be **presentational** (no API calls, no React Query, no Redux).
- Existing primitives include:
  - `Button`, `Input`, `Tooltip`
  - Radix-backed `DropdownMenu`, `Select`, and `Tabs`
  - `Table`/`DataTable` and `Pagination` for dense list surfaces
  - `PageLoader` and `PagePlaceholder` for route states
  - `Card` system for unified container aesthetics
  - `Badge` for categorical and status indicators

**UI Rule C1 (enforceable)**: A file under `components/ui/*` may import only:

- React
- `cn` util
- other `components/ui/*`
- third-party UI primitives (Radix via `radix-ui`, icons)

It may NOT import from `features/*`, `lib/*`, `store/*`, or `routes/*`.

### Interaction states

For interactive components (buttons, nav items, inputs):

- Use the shared `Button` component from `src/components/ui/Button/Button.jsx` for every button-like control in app code. Do not render raw `<button>` elements outside the `Button` primitive implementation.
- Must include:
  - hover state
  - active state
  - disabled state
  - keyboard focus state (`focus-visible` or `focus` ring)

Examples:

- `Button`: `focus:ring-2 focus:ring-primary/20`, `active:scale-[0.98]`
- `Input`: `focus-within:ring-1 focus-within:ring-primary/20`, error and disabled variants

**UI Rule I1**: Any clickable element must have a visible focus indicator (ring or outline) in keyboard navigation.

## Accessibility rules (non-negotiable)

- Inputs must expose:
  - `aria-invalid` when error
  - `aria-describedby` linking to helper/error elements (pattern already implemented in `Input`)
- Buttons must have:
  - `type="button"` unless they submit a form
  - `aria-label` when icon-only
  - shared behavior through the `Button` component
- Navigation toggles must have `aria-label` (see sidebar/menu close buttons).

**UI Rule A11Y1**: Any icon-only `Button` must have `aria-label`.
**UI Rule A11Y2**: Form validation errors must be rendered in the DOM and referenced via `aria-describedby`.

## Responsive breakpoints

We use Tailwind defaults:

- `sm` >= 640px
- `md` >= 768px
- `lg` >= 1024px
- `xl` >= 1280px

Patterns used:

- Sidebar is **sticky** on desktop, **overlay** on mobile (`md:hidden` toggles).
- Auth layout shows brand panel at `lg` and above.

**UI Rule R1**: Any new layout must be mobile-usable; if a panel is hidden on mobile, it must have an alternative access path.

## Animation guidelines

- Use Tailwind animation utilities (`animate-in`, `fade-in`, `slide-in-*`) consistently (already used in pages/components).
- Avoid continuous animations except subtle decorative ones (AuthLayout has a slow spin background).

**UI Rule AN1**: Continuous animations must be at least 30s duration and must not be used for essential UI affordances.

## Loading / error / empty state patterns

### Loading

- Route-level loading uses `<Suspense fallback={<PageLoader />}>` in layouts.
- For component-level loading, prefer:
  - skeleton blocks using tokenized backgrounds (`bg-layer1`, `bg-layer2`, `bg-white/10` only if justified)
  - button-level spinners (`Button` supports `isLoading`)

**UI Rule LE1**: Any async action button must show a disabled/loading state (use `Button isLoading`).

### Error

- Use Sonner toast for global errors (already integrated in axios interceptors).
- Inline errors in forms (LoginForm pattern: error banner + field errors).

**UI Rule LE2**: If an error is actionable in-context (e.g. invalid credentials), it must be shown inline and not only as a toast.

### Empty

- For lists/tables with no data: show a dedicated empty state block with action (e.g. "Create New").

## Tables / forms / modals (standards)

### Tables

- Use the shared table system from `src/components/ui/Table/Table.jsx` for every table surface. Do not render native `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, or `<td>` directly in feature/page components.
- If a table renders >100 rows, implement pagination and/or virtualization.
- Table actions (row menus) must use `DropdownMenu` primitives.
- Prefer `DataTable` for simple column definitions, including custom cells and loading skeleton rows. Columns may define `accessorKey`, `header`, `cell`, `className`, `headerClassName`, and `cellClassName`.
- Use the lower-level `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` primitives only when `DataTable` cannot express the table behavior.
- Use `stickyColumns` only for dense horizontal tables where keeping identity/actions visible improves scanning.
- Pair paginated tables with `Pagination`, including page size options and a total row count.

### Selects and tabs

- Use `Select` for option sets such as search scope, page size, status, and ownership filters.
- The `Select` component supports an `options` prop for data-driven rendering:

  ```jsx
  const options = [
    { label: 'All Columns', value: 'all' },
    { label: 'Client Name', value: 'clientName' },
  ];

  <Select
    options={options}
    placeholder="Select column"
    value={val}
    onValueChange={setVal}
    align="end"
  />;
  ```

- Use `Tabs` for mutually exclusive views of the same data surface, not for main navigation.
- The `Tabs` component supports an `items` prop for data-driven rendering:

  ```jsx
  const tabs = [
    { label: 'Overview', value: 'overview', content: <Overview /> },
    { label: 'Activity', value: 'activity', content: <Activity />, badge: 12 },
  ];

  <Tabs items={tabs} defaultValue="overview" />;
  ```

- Tab labels may include count badges using a child with `data-slot="tabs-badge"` or the `badge` property in the `items` array.

### Cards and Badges

- **Card**: Use the `Card` component for all primary layout containers.
  - Supports `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`.
  - `CardTitle` includes a premium underline variant (on by default) to match the project's design language.
- **Badge**: Use for categorical labels (e.g., "Corporate", "Regulatory") or status pills.
  - Supports variants: `default`, `outline`, `success`, `warning`, `danger`, `info`.

### Forms

- Use `react-hook-form` for non-trivial forms.
- Inputs must use `components/ui/Input/Input.jsx` (keeps consistent labeling and a11y).

### Modals

- If modals are introduced, they must be built on Radix primitives for focus management and keyboard handling.

### Drawers

The `Drawer` component (`src/components/ui/Drawer/Drawer.jsx`) is a **full-height or full-width slide-out panel** backed by Radix UI's Dialog primitive. Use drawers for:

- **Creation/editing flows** (CreateClientDrawer pattern)
- **Secondary actions** (e.g., bulk operations, detailed forms)
- **Mobile-friendly modals** that preserve context by sliding in from the edge

#### Props

- `open` (boolean): Controls drawer visibility; required
- `onOpenChange` (function): Called when open state changes (e.g., on close button click)
- `title` (string): Drawer header title; required
- `description` (string, optional): Subtitle below title
- `children` (ReactNode): Main content area
- `footer` (ReactNode, optional): Action buttons footer (typically Cancel/Submit pair)
- `headerAction` (ReactNode, optional): Additional control in header (right of title, left of close)
- `side` (string): One of `'right'` (default), `'left'`, `'bottom'`
- `size` (string): One of `'sm'`, `'md'`, `'lg'` (default), `'xl'`, `'full'`
  - Maps to max widths: `sm:max-w-md`, `md:max-w-2xl`, `lg:max-w-4xl`, `xl:max-w-6xl`
- `closeLabel` (string): Screen reader label for close button; default `'Close drawer'`
- `className` (string): Custom outer wrapper class
- `contentClassName` (string): Custom class for scrollable content area
- `footerClassName` (string): Custom class for footer wrapper

#### Features

- **Backdrop overlay** with blur effect; clicking closes the drawer
- **Header**: Contains title, description, optional header action, and close button
- **Scrollable content**: Uses custom scrollbar with `overflow-y-auto`
- **Footer slot**: Sticky at bottom; typically contains action buttons
- **Animations**: Slide-in/out transitions; overlay fade animations
- **Mobile responsive**:
  - Full viewport height/width on mobile
  - `side=bottom` useful for mobile breakdowns
  - Rounded corners on desktop (`sm:rounded-l-[20px]` for right-side, etc.)
- **Focus management**: Dialog primitive handles focus trap

#### Usage pattern

```jsx
import { Drawer } from '@components/ui/Drawer/Drawer';
import { Button } from '@components/ui/Button/Button';

export const MyFeatureDrawer = ({ open, onOpenChange }) => {
  const handleSubmit = (data) => {
    // perform action
    onOpenChange(false);
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Item"
      description="Fill in the form below to create a new item"
      size="lg"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="my-form">
            Create
          </Button>
        </>
      }
    >
      <form id="my-form" onSubmit={handleSubmit}>
        {/* form fields */}
      </form>
    </Drawer>
  );
};
```

#### Best practices

1. **Header actions**: Use `headerAction` for secondary controls (e.g., a help icon).
2. **Form integration**: Place `<form>` inside drawer content; use `form="form-id"` on footer buttons to link them to the form.
3. **Reset on close**: If using `react-hook-form`, call `reset()` when drawer closes to clear state:
   ```jsx
   const handleOpenChange = (nextOpen) => {
     if (!nextOpen) reset();
     onOpenChange(nextOpen);
   };
   ```
4. **Size selection**:
   - `sm`: For simple 1-2 field forms
   - `md`/`lg`: For multi-field forms (default choice)
   - `xl`: For complex multi-step or wide content
   - `full`: Rare; use only for full-width content
5. **Side placement**:
   - `right` (default): Intuitive for form entry
   - `left`: Use for filter panels or secondary contexts
   - `bottom`: Excellent for mobile; full-width slides up
6. **Mobile-first**: Test all drawers at mobile breakpoint; consider switching `side` via responsive utilities if needed.

**UI Rule D1**: Drawers containing forms must reset `react-hook-form` state on close to avoid stale data on re-open.
