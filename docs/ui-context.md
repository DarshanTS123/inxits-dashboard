# UI context (design + implementation contract)

This document defines how UI is built in this repo: tokens, Tailwind usage, component conventions, and enforceable UX/accessibility rules.

### Quick reference (UI consistency)

| Topic | Section |
|-------|---------|
| Colors & tokens | [Design system foundation](#design-system-foundation) |
| Font sizes & weights | [Typography](#typography) |
| `gap`, page layout, card padding | [Spacing, layout & density](#spacing-layout--density) |
| Buttons, inputs, focus | [Interaction states](#interaction-states) |
| `Card`, `Badge`, tables, tabs | [Component conventions](#component-conventions-repo-patterns) |
| Forms | `docs/form-design-guide.md` |
| Charts | `docs/chart-architecture.md` |

**Default page rhythm**: `flex flex-col gap-5` inside `MainLayout`’s `p-6` main area. **Default card title**: `text-[18px] font-normal` via `Card`. **Default paired row**: `lg:grid-cols-2 gap-5 items-stretch`.

## Design system foundation

### Token source of truth

- Global design tokens are CSS variables defined in `src/index.css` under `:root`.
- Tailwind consumes tokens via `tailwind.config.js` color aliases (e.g. `primary: var(--primary)`).

**UI Invariant U0**: If a color/size must be reused, it must be a **token** (CSS variable + Tailwind alias if applicable), not a repeated literal.

### Color tokens (current)

Defined in `src/index.css`, aliased in `tailwind.config.js`. Values are aligned with the [inXits Figma design file](https://www.figma.com/design/SohL0RflyCWlI7UuQ6zscr/inXits--Copy-?node-id=2729-27754).

- **Brand accent** (links, icons, focus rings, active nav — not filled buttons)
  - `--primary` → `#46A8DC` → Tailwind `text-primary`, `border-primary`, `ring-primary`
- **Buttons**
  - `--btn-primary` → `#1E7AB0` → Tailwind `bg-btn-primary` (accessible white text, 4.70:1)
  - `--btn-secondary` → `#0C335D` → Tailwind `bg-btn-secondary`
  - `--btn-disabled` → `#A6A6A6`
- **Backgrounds**
  - `--bg-page` → `#13172A` → `bg-page`
  - `--bg-layer-1` → `rgba(255,255,255,0.04)` → `bg-layer1` (cards, tables)
  - `--bg-layer-2` → `rgba(255,255,255,0.08)` → `bg-layer2`
  - `--bg-layer-3` → `#25293B` → `bg-layer3` (drawer header/footer, nested panels)
  - `--bg-popup` → `#1A1F33` → `bg-popup`
  - `--bg-topnav` → `#151827` → `bg-topnav`
  - `--bg-helper` → `#1C2033` → `bg-helper` (table headers)
  - `--bg-table-hover` → `#1C213D` → `bg-table-hover`
  - `--bg-table-footer` → `#1D2135` → `bg-table-footer`
  - `--avatar-bg` → `#DFF3FB` → `bg-avatar`
- **Text**
  - `--text-heading` → `#FFFFFF` → `text-heading`
  - `--text-subheading` → `#E3E3E3` → `text-subheading`
  - `--text-paragraph` → `#C9C9C9` → `text-paragraph`
  - `--text-disabled` → `#878787` → `text-text-disabled`
  - `--text-enabled` → `#D4D2D2` → `text-text-enabled`
  - `--text-label` → `#EAEAEA` → `text-text-label`
  - `--text-on-primary` → `#FFFFFF` → `text-text-on-primary`
  - `--text-on-disabled` → `#F6F6F6`
- **Strokes / outlines**
  - `--stroke-divider` → `#3A3A3A` → `border-stroke-divider`
  - `--stroke-field-inactive` → `#383838` → `border-field-inactive`
  - `--btn-outline-secondary` → `#FFFFFF`
  - `--outline-active` → `#D8D8D8`
  - `--outline-disabled` → `#616060`
- **Icons**
  - `--icon-disabled` → `#B0B0B0` → `text-icon-disabled`
  - `--icon-active` → `#F2F1F1` → `text-icon-active`
  - `--icon-primary` → `#46A8DC` → `text-icon-primary`
- **Feedback**
  - `--success` → `#28C76F` → `text-success`, `bg-success`
  - `--warning` → `#EFBF00` → `text-warning`, `bg-warning`
  - `--error` → `#EA5758` → `text-error`, `bg-error`
  - `--info` → `#00CFE8` → `text-info`, `bg-info`
- **Charts** (see `docs/chart-architecture.md`)
  - `--chart-label-light` → `#FFFFFF`, `--chart-label-dark` → `#13172A` (adaptive slice labels inside chart components)
  - Optional reference palette in `index.css`: `--chart-1` … `--chart-5` — copy into parent `colors` arrays; not consumed by chart components directly
- **Sector colors** (sunburst / sector visualizations)
  - `--sector-it`, `--sector-banking`, `--sector-healthcare`, etc.
- **Sidebar**
  - `--sidebar-header-bg` → `#0C335D` → `bg-sidebar-header`
  - `--sidebar-bg`, `--sidebar-item-active-bg`, `--sidebar-item-active-text`, `--sidebar-item-text`
  - widths: `--sidebar-expanded-width`, `--sidebar-collapsed-width`, derived `--sidebar-width`

**UI Rule U2**: Use `--primary` / `text-primary` for accents and links. Use `--btn-primary` / `bg-btn-primary` for filled CTAs and pagination active states. Do not use `bg-primary` for button fills — white text on `#46A8DC` fails WCAG AA (2.66:1).

**UI Rule U3**: Do not use Tailwind `slate-*`, `green-*`, `amber-*`, `red-*`, or `blue-*` palette classes in feature or shared UI code. Use design tokens instead.

### CSS variable naming convention (enforced for new tokens)

New tokens must follow:

- **Base palette**: `--<category>-<name>` where category is one of `bg|text|icon|stroke|btn|sidebar|status`
  - Examples: `--bg-overlay`, `--text-muted`, `--stroke-subtle`
- **Status tokens**: `--status-<state>` (prefer over ad-hoc): `--status-success`, `--status-error`
- **Component-only tokens** are forbidden unless the token is used by at least 2 components.

**Forbidden**: `--blue-500`, `--color1`, `--buttonColor`.

## Typography

Use Tailwind utilities only. Do not add arbitrary `font-size` in CSS for app UI.

**Typeface**: Myriad Pro — self-hosted from `public/fonts/myriad-pro/` as OTF files, loaded via `@font-face` declarations in `src/index.css`.

### Font loading pipeline

1. **`@font-face` rules** in `src/index.css` register four weights of Myriad Pro from local OTF files:

   | Weight | File | CSS `font-weight` |
   |--------|------|-------------------|
   | Light | `MyriadPro-Light.otf` | `300` |
   | Regular | `MYRIADPRO-REGULAR.OTF` | `400` |
   | Semibold | `MYRIADPRO-SEMIBOLD.OTF` | `600` |
   | Bold | `MYRIADPRO-BOLD.OTF` | `700` |

   Additional weights (Condensed, Bold Condensed, Bold Condensed Italic, Bold Italic, Condensed Italic, Semibold Italic) are available in the same directory but not currently registered. Add `@font-face` rules as needed.

2. **`@layer base`** block in `src/index.css` applies `font-family: "Myriad Pro", system-ui, sans-serif` to both `html` and `body` with `!important`, overriding Tailwind's preflight default font stack.

3. **`tailwind.config.js`** extends `fontFamily.sans` to `['"Myriad Pro"', 'system-ui', 'sans-serif']`, ensuring Tailwind's `font-sans` utility class (and the implicit body default) resolves to Myriad Pro.

**UI Rule T0**: Do not link external font services (Google Fonts, Adobe Typekit). All fonts must be self-hosted under `public/fonts/` and loaded via `@font-face` in `src/index.css`.

**UI Rule T1**: Prefer the scale below. New screens must reuse an existing role before inventing a new size.

### Type scale (canonical)

| Role | Classes | Font Size | Weight |
|------|---------|-----------|--------|
| **h1** | `text-5xl` | 40px | Light, Regular, Semibold, Bold |
| **h2** | `text-4xl` | 32px | Light, Regular, Semibold, Bold |
| **h3** | `text-3xl` | 28px | Light, Regular, Semibold, Bold |
| **h4** | `text-2xl` | 24px | Light, Regular, Semibold, Bold |
| **Subheading 1** | `text-xl` | 20px | Light, Regular, Semibold, Bold |
| **Body 1** | `text-lg` | 18px | Light, Regular, Semibold, Bold |
| **Paragraph** | `text-base` | 16px | Light, Regular, Semibold, Bold |
| **Label** | `text-sm` | 14px | Light, Regular, Semibold, Bold |
| **Helper text** | `text-xs` | 12px | Light, Regular, Semibold, Bold |
| **Button Large** | `text-base font-semibold` | 16px | Semibold |
| **Button Medium** | `text-sm font-semibold` | 14px | Semibold |
| **Button Small** | `text-xs font-normal` | 12px | Regular |

### Font weight

| Weight | Tailwind class | CSS value | Use |
|--------|---------------|-----------|-----|
| Light | `font-light` | `300` | De-emphasized labels, subtle text |
| Regular | `font-normal` | `400` | Small buttons, standard text |
| Medium | `font-medium` | `500` | Titles, labels, default emphasis |
| Semibold | `font-semibold` | `600` | Buttons, "View all", KPI meta |
| Bold | `font-bold` | `700` | Page titles, metric values |

**UI Rule T2**: Shared `Card` section titles default to `text-[18px] font-normal`; shared read-only detail labels/values default to `14px` / `16px`, both regular weight. Prefer these defaults and use `titleClassName`, `labelClassName`, or `valueClassName` only for a documented design exception.

**UI Rule T3**: Uppercase is reserved for **metric labels**, **compact actions** (“View all”), and **table meta** (e.g. RM role). Body copy stays sentence case.

---

## Spacing, layout & density

Spacing uses the **Tailwind scale only**. Pick from the tables below; do not use one-off values (e.g. `gap-7`, `mb-5` on page shells) unless matching an existing documented pattern.

**UI Rule S1**: Page-level vertical rhythm uses **`gap-5`** between major sections (default). Use **`gap-8`** only when a design explicitly needs looser layout (avoid mixing both on one page).

**UI Rule S2**: Card grids use **`gap-4`** (dense KPI/metric rows) or **`gap-5`** (chart rows, equal-width pairs). Default sibling cards in a row: **`lg:grid-cols-2`** + **`items-stretch`**.

**UI Rule S3**: Prefer **shared height constants** for side-by-side cards/charts on one row (e.g. `const ROW_CARD_HEIGHT = 400`) so paired surfaces align.

### Spacing scale

| Token | Class | px | Use |
|-------|-------|-----|-----|
| **2xs** | `gap-1` / `gap-1.5` | 4–6 | Icon + label, tight form label stacks |
| **xs** | `gap-2` | 8 | Status dot + label, inline button groups |
| **sm** | `gap-3` | 12 | Card body stacks, filter groups, header actions |
| **md** | `gap-4` | 16 | KPI stat grids, detail card grids, breadcrumb follow-up |
| **lg** | `gap-5` | 20 | **Default** between dashboard sections; 2-column chart rows |
| **xl** | `gap-6` | 24 | Legacy / loose (prefer `gap-5` for new work) |
| **2xl** | `gap-8` | 32 | Avoid for new pages unless specified in design |

### Page & shell layout

| Surface | Classes | Notes |
|---------|---------|--------|
| **Main content** | `p-6` on `<main>` | `MainLayout.jsx` — do not add duplicate outer padding in pages |
| **Feature page stack** | `flex flex-col gap-5` | Dashboard, list pages (sections) |
| **Detail page stack** | `space-y-4` or `gap-4` after breadcrumbs | Client detail, settings |
| **2-column charts/cards** | `grid grid-cols-1 gap-5 lg:grid-cols-2 items-stretch` | Equal width + height siblings |
| **KPI / metric row** | `grid … gap-4 sm:grid-cols-2 lg:grid-cols-5` | `StatsGrid` pattern |
| **Detail summary cards** | `grid grid-cols-1 gap-4 md:grid-cols-2` | `ClientDetail` summary |

### Card spacing

| Concern | Value | Notes |
|---------|-------|--------|
| **Padding** `sm` / `md` / `lg` | `p-4` / `p-5` / `p-6` | Charts: `md`; KPI + tables: `lg` |
| **Header → body** | `mb-4` (Card default when `children` present) | Tables: `headerClassName="mb-4"` |
| **Tight header** | `mb-3` | Dense tables (e.g. ongoing transactions) |
| **Header alignment** | `headerClassName="items-center"` | When header has filters/actions beside title |
| **Body internal** | `contentClassName="flex flex-col gap-3"` | Scrollable table + pagination |
| **Default title type** | `text-[18px] font-normal` | Inherited from `Card`; avoid local title typography overrides |

**UI Rule C3**: Paired cards in one row must use the **same** `padding`, `hoverable`, and **explicit `height`** (via `style` or chart `height` prop) when designs show equal tiles.

### Radius & borders

| Element | Class |
|---------|--------|
| Buttons, inputs, small controls | `rounded-lg` |
| Inner table wrappers, list rows | `rounded-xl` |
| Outer `Card` | `rounded-2xl` |
| Global token | `--radius: 0.5rem` in `index.css` |

Card borders: `border-stroke-divider` on default surfaces; table containers use `border-stroke-divider bg-layer1` (see `SummaryTables.jsx`).

### Chart & visualization heights

| Context | Height | Reference |
|---------|--------|-----------|
| Dashboard chart row (2-up) | `380` | Risk donut + AUM pie |
| Dashboard paired row (chart + list) | `400` | Transaction status + regulatory announcements |
| Portfolio allocation grid (2-up) | `390` | `PortfolioAllocationCharts` |
| Portfolio embedded platform pie | `200` | `PortfolioInvestmentSummary` (card-less `embedded` mode) |
| Default `PieChart` / `DonutChart` | `300` | Component default when not specified |

Define row height once per row in the parent (`Dashboard.jsx`) and pass to children.

### Tables (spacing)

| Element | Classes |
|---------|---------|
| Header cell | `px-6 py-4` |
| Body cell | `px-6 py-5` |
| Row hover | `hover:bg-table-hover` |
| Container | `overflow-hidden rounded-xl border border-stroke-divider bg-layer1` |

### Links & header actions

“View all” and similar card actions:

```jsx
<Button
  type="button"
  variant="ghost"
  size="sm"
  className="p-0 text-[11px] font-semibold uppercase tracking-wide text-primary hover:bg-transparent hover:text-primary/80"
>
  View all
</Button>
```

Chart/card filters belong in the Card **`action`** slot (not absolutely positioned over the chart body).

### Dark surfaces (dashboard pattern)

Use design tokens — do not introduce new hex literals:

| Use | Token / class |
|-----|----------------|
| Page background | `bg-page` (`#13172A`) |
| Card background | `bg-layer1` (`Card` default variant) |
| Elevated / nested panel | `bg-layer3` (drawer header/footer) |
| Table surface | `bg-layer1` |
| Table header band | `bg-helper` |
| Table row hover | `bg-table-hover` |
| Table footer | `bg-table-footer` |
| Breadcrumb bar | `bg-table-hover` or `bg-layer3` |

**UI Rule U1**: All new surfaces must map to `--bg-*` tokens. Hardcoded `#0d1526`, `#171c2f`, and Tailwind `slate-*` classes are deprecated — migrate to tokens when touching a file.

### Responsive spacing

- Collapse multi-column grids to **`grid-cols-1`** below `lg` unless `md` breakpoint is required (detail cards use `md:grid-cols-2`).
- Do not reduce **horizontal** card padding on mobile below `Card` padding tokens; use scroll for wide tables instead.

**UI Rule SR1**: UI primitives expose spacing via `className` / `contentClassName` composition — not hardcoded one-off layout variants inside `components/ui/*`.

---

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
  - Radix-backed `DropdownMenu`, `Select`, `Tabs`, and `RadioGroup`
  - `Table`/`DataTable` and `Pagination` for dense list surfaces
  - `StarRating` for read-only numeric star displays (tables, summary surfaces)
  - `PageLoader` and `PagePlaceholder` for route states
  - `Card` system for unified container aesthetics
  - `Badge` for categorical and status indicators
  - `Breadcrumbs` for page hierarchy navigation

**UI Rule C1 (enforceable)**: A file under `components/ui/*` may import only:

- React
- `cn` util
- other `components/ui/*`
- third-party UI primitives (Radix via `radix-ui`, icons)

It may NOT import from `features/*`, `lib/*`, `store/*`, or `routes/*`.

### Interaction states

For interactive components (buttons, nav items, inputs):

- Use the shared `Button` component from `src/components/ui/Button/Button.jsx` for every button-like control in app code. Do not render raw `<button>` elements outside the `Button` primitive implementation.
- **Icons**: Use `leftIcon` and `rightIcon` props to pass icon components (e.g. `leftIcon={Search}`). Do not manually render icons inside the button children.
- Must include:
  - hover state
  - active state
  - disabled state
  - keyboard focus state (`focus-visible` or `focus` ring)

Examples:

- `Button` primary variant: `bg-btn-primary text-text-on-primary` (not `bg-primary`)
- `Button`: `focus:ring-2 focus:ring-primary/20`, `active:scale-[0.98]`
- `Input`: default `border-field-inactive`; focused `border-primary focus-within:ring-primary/20`. Supports `leftIcon` and `rightIcon` props for built-in icon placement.

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
- Desktop sidebar collapse/expand is toggled from the **header** (not inside the sidebar).
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
- For star-rating columns, use `cellType: 'rating'` instead of a custom `cell` renderer. Optional column fields: `maxStars`, `ratingClassName`, `filledStarClassName`, `emptyStarClassName`, `starIconClassName`. See `PortfolioHoldingsTable`.
- Use the lower-level `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` primitives only when `DataTable` cannot express the table behavior.
- Use `stickyColumns` only for dense horizontal tables where keeping identity/actions visible improves scanning.
- Pair paginated tables with `Pagination`, including page size options and a total row count.
- Row navigation to detail pages: pass `onRowClick` to `DataTable` and navigate via React Router (see `ClientsTable`).

### Star ratings

- Use `StarRating` from `src/components/ui/StarRating/StarRating.jsx` for read-only numeric ratings (not interactive input).
- Props: `value`, `max` (default 5), `filledClassName` (default `fill-warning text-warning`), `emptyClassName`, `iconClassName`.
- Includes `aria-label` for screen readers (e.g. `"4 out of 5 stars"`).
- In tables, prefer `cellType: 'rating'` on the column definition rather than importing `StarRating` in feature code.

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
- **Do not** compose `TabsList`, `TabsTrigger`, or `TabsContent` manually. The shared `Tabs` component is **data-driven only**: pass an `items` array from the parent.

  **Tab item shape**

  | Field | Type | Required | Description |
  |---|---|---|---|
  | `value` | `string` | yes | Unique tab id |
  | `label` | `string` \| `ReactNode` | yes | Trigger label |
  | `content` | `ReactNode` | no | Panel body for this tab |
  | `badge` | `ReactNode` | no | Count badge in trigger |
  | `disabled` | `boolean` | no | Disable trigger |
  | `contentClassName` | `string` | no | Panel class override |

  **Per-tab content** (detail pages, settings sections):

  ```jsx
  const tabs = useMemo(
    () => [
      {
        value: 'overview',
        label: 'Overview',
        content: <OverviewPanel data={data} />,
        contentClassName: 'space-y-4',
      },
      {
        value: 'activity',
        label: 'Activity',
        content: <ActivityPanel />,
        badge: 12,
      },
    ],
    [data]
  );

  <Tabs items={tabs} defaultValue="overview" listClassName="mb-4 flex-wrap" />;
  ```

  **Shared panel** (same body for every tab value, e.g. filtered list):

  ```jsx
  const tabItems = useMemo(
    () =>
      CLIENT_LIST_TABS.map((tab) => ({
        value: tab.value,
        label: tab.label,
        badge: counts[tab.value],
      })),
    [counts]
  );

  <Tabs
    value={activeTab}
    onValueChange={setActiveTab}
    items={tabItems}
    contentClassName="p-0"
  >
    <ClientsTable data={clients} />
  </Tabs>;
  ```

  **UI Rule T2**: `items` must be defined in the parent (feature/page). Do not import or use `TabsList`, `TabsTrigger`, or `TabsContent` outside `src/components/ui/Tabs/Tabs.jsx`.

  **Reference**: Client list uses the shared-panel pattern in `src/features/clients/index.jsx`; client detail uses per-tab content in `src/features/clients/components/ClientDetail.jsx`.

### Cards and Badges

- **Card**: Use the `Card` component for all primary layout containers. It is **props + children only** — do not import `CardHeader`, `CardTitle`, `CardContent`, or `CardFooter`.
- Define multiple cards as an **array of objects in the parent**, then map each entry to `<Card />`:

  **Card config shape (parent array)**

  | Field | Type | Description |
  |---|---|---|
  | `id` | `string` | Stable key for `.map()` |
  | `title` | `ReactNode` | Header title (`Card` `title` prop) |
  | `content` | `ReactNode` | Body passed as `children` |
  | `action` | `ReactNode` | Header action (button, status badge) |
  | `contentClassName` | `string` | Body wrapper classes |

  ```jsx
  const cards = useMemo(
    () => [
      {
        id: 'personal',
        title: 'Personal Details',
        content: <PersonalFields client={client} />,
        contentClassName: 'flex flex-col gap-6 sm:flex-row',
      },
      {
        id: 'kyc',
        title: 'KYC Status',
        action: <StatusBadge status={client.kyc.status} />,
        content: <KycFields kyc={client.kyc} />,
      },
    ],
    [client]
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {cards.map((card) => (
        <Card
          key={card.id}
          padding="lg"
          title={card.title}
          titleUnderline={false}
          action={card.action}
          contentClassName={card.contentClassName}
        >
          {card.content}
        </Card>
      ))}
    </div>
  );
  ```

  **Single metric card** (dashboard stats):

  ```jsx
  <Card
    padding="lg"
    label="Total Clients"
    value={stats.total}
    meta={<Button variant="ghost" size="sm">View</Button>}
    loading={isLoading}
  />
  ```

  **Card props reference**

  | Prop | Purpose |
  |---|---|
  | `title`, `subtitle`, `description` | Header text |
  | `action` | Header right slot |
  | `children` | Main body (required for section cards) |
  | `label`, `value`, `meta` | Metric layout (stats) |
  | `padding` | `none` \| `sm` \| `md` \| `lg` |
  | `titleUnderline` | Default `true`; set `false` for detail sections |
  | `loading`, `empty` | Loading skeleton / empty state |
  | `contentClassName`, `headerClassName`, `titleClassName` | Layout overrides |

  **UI Rule C2**: Do not import `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, or `CardFooter`. Use `Card` props and `children` only.

  **UI Rule C4**: Chart cards use `padding="md"` + `hoverable`; KPI and data tables use `padding="lg"`. Header filters/actions use the `action` prop — see [Spacing, layout & density](#spacing-layout--density).

**UI Rule C5**: Simplify `Card` `className` by avoiding manual border or background overrides. The `Card` component handles its own architectural styling; typically only `rounded-xl` or layout-specific classes (e.g. `col-span-*`) should be passed.

- **Badge**: Use for categorical labels (e.g., "Corporate", "Regulatory") or status pills.
  - Supports variants: `default`, `outline`, `success`, `warning`, `danger`, `info`.
  - All variants use feedback/background tokens (`bg-success/10 text-success`, etc.) — not Tailwind semantic color scales.

### Breadcrumbs

The `Breadcrumbs` component (`src/components/ui/Breadcrumbs/Breadcrumbs.jsx`) provides hierarchical page navigation.

- **Usage**: Use on detail and nested pages below the main header (e.g. Clients → Client Name).
- **Props**:
  - `items` (array): Array of objects with `label` (string) and optional `href` (string). The last item is automatically styled as the active, non-clickable current page (`aria-current="page"`).
- **Styling**: Sticky full-width bar spanning the main content area via negative margins (`bg-table-hover`, border-bottom). Parent page content should account for the bar with `space-y-*` spacing after it.
- **Accessibility**: Renders `<nav aria-label="Breadcrumb">` with an ordered list; intermediate items use React Router `Link`.

### Detail pages (read-only surfaces)

Use this layout for entity detail screens (reference: `src/features/clients/components/ClientDetail.jsx`):

1. **Breadcrumbs** linking back to the list route.
2. **Page title** (`h1`) with the entity name (the app bar keeps the section title from `handle.title`, e.g. **Clients** — do not show IDs or entity names there).
3. **Summary cards** in a responsive grid (`grid-cols-1 md:grid-cols-2`) built from a parent-defined card array mapped to `<Card />`.
  - Implementation note: For emphasis, a leading or featured summary card may span the full row on medium+ screens. Apply `md:col-span-2` to the featured card wrapper (or use a conditional class when mapping) so the primary card occupies both columns while remaining responsive.
4. **Tabs** with per-tab `content` for section-specific panels.

**Read-only fields**: Use `DetailField` / `DetailFieldGrid` from the feature's `components/` folder for label/value pairs. `DetailField` renders labels at `14px` and values at `16px`, both regular weight. Define field data as `{ label, value }[]` arrays in mock/API payloads rather than hardcoding JSX per field.

**Detail page states** (handled at the page layer, not inside the main detail component):

- Loading: `<PageLoader />`
- Not found: dedicated empty state with breadcrumb + back navigation
- Error: dedicated recovery state with retry/back actions

**UI Rule DP1**: Detail pages must not fetch data inside presentational sub-components; the page or feature orchestrator owns React Query hooks and passes shaped data down.

### Forms

- Use `react-hook-form` for non-trivial forms.
- Use shared UI form primitives for inputs. See `docs/form-design-guide.md` for component usage, validation, and accessibility rules.

### Modals

The `Modal` component (`src/components/ui/Modal/Modal.jsx`) is a centralized Dialog overlay backed by Radix UI. Use modals for localized tasks that require immediate user input or confirmation without losing the context of the underlying page (e.g., "Change RM" forms, destructive action confirmations).

#### Props

- `open` (boolean): Controls modal visibility; required
- `onOpenChange` (function): Called when open state changes
- `title` (string): Modal header title; required
- `description` (string, optional): Subtitle below title
- `children` (ReactNode): Main content area
- `footer` (ReactNode, optional): Action buttons footer
- `size` (string): One of `'sm'`, `'md'`, `'lg'`, `'xl'`, `'full'`. Controls `max-width`. The modal is naturally constrained vertically (e.g., `max-h-[90vh]`) so it doesn't render as full-screen inadvertently.

#### Best practices

1. **Form integration**: Place `<form>` inside modal content; use `form="form-id"` on footer buttons.
2. **Reset on close**: Always reset form states upon closing to avoid stale data on re-open.
3. **Focus management**: Handled automatically by the Radix Dialog primitive.

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

---

## Component Library Reference

This section provides a concise reference for the shared UI components in `src/components/ui/`. Use this guide to ensure correct property usage and adherence to design standards.

### Button Component

Used for primary, secondary, and functional actions.

**Import:** `import { Button } from '@/components/ui/Button/Button';`

#### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' \| 'link'` | `'primary'` | Visual style of the button. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the button padding and font. |
| `isLoading` | `boolean` | `false` | Shows a spinner and disables the button. |
| `disabled` | `boolean` | `false` | Disables the button. |
| `leftIcon` | `React.ElementType` | `-` | Icon component displayed to the left of text. |
| `rightIcon` | `React.ElementType` | `-` | Icon component displayed to the right of text. |
| `className` | `string` | `-` | Additional classes for customization. |
| `children` | `React.ReactNode` | `-` | Button label or nested content. |

### Input Component

Used for form fields.

**Import:** `import { Input } from '@/components/ui/Input/Input';`

#### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `-` | Input label text. |
| `error` | `string \| boolean` | `-` | Error message or error state. |
| `helperText` | `string` | `-` | Supporting text shown below input. |
| `size` | `'sm' \| 'lg'` | `'lg'` | Input height. |
| `leftIcon` | `React.ElementType` | `-` | Icon component displayed on the left. |
| `rightIcon` | `React.ElementType` | `-` | Icon component displayed on the right. |
| `disabled` | `boolean` | `-` | Disables the input. |
| `required` | `boolean` | `-` | Adds an asterisk to the label. |
| `className` | `string` | `-` | Container class. |
| `inputClassName` | `string` | `-` | CSS class for the `input` element. |
| `labelClassName` | `string` | `-` | CSS class for the label. |

---

### Pattern Guidelines

1. **Always use UI Primitives**: Avoid raw `<input>` or `<button>` elements.
2. **Prop Consistency**: Check this guide before implementing a wrapper around a UI component.
3. **Accessibility**: For inputs, `label`, `error`, and `helperText` handle IDs and ARIA attributes automatically.
