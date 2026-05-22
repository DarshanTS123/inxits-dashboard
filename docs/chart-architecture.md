# Chart Architecture (AmCharts 5 Integration)

This document defines the architecture and implementation standards for data visualization within the `inxits-dashboard` application using **AmCharts 5**.

## Overview

The dashboard requires a high-performance, responsive, and visually consistent charting system. We use AmCharts 5 due to its enterprise-grade capabilities, Canvas-based rendering, and flexible JSON-based configuration which aligns with our data-driven architecture.

## Charts Identified from Dashboard UI

Based on the dashboard requirements, the following chart types are prioritized:
- **Risk Segmentation Chart**: A specialized visualization for risk analysis.
- **Pie Charts**: Distribution analysis (e.g., Client distribution).
- **Donut Charts**: Nested or summary distribution analysis.
- **Bar/Column Charts**: Comparative metrics.
- **Line/Area Charts**: Temporal trends.

## Why AmCharts 5?

1.  **Performance**: High-speed rendering for large datasets using HTML5 Canvas.
2.  **Accessibility**: Built-in support for screen readers and keyboard navigation.
3.  **Theming**: Robust theme engine that integrates with our CSS token system.
4.  **Flexibility**: Low-level API allowing for deep customization of every chart element.
5.  **Memory Management**: Predictable lifecycle for React integration (disposal mechanism).

---

## Recommended Architecture

We follow a **layered approach** to chart implementation to ensure reusability while allowing domain-specific customizations.

### Folder Structure & Ownership

| Component Type | Location | Description |
| :--- | :--- | :--- |
| **Shared Base Components** | `src/components/charts` | Purpose-built chart components (`DonutChart`, `PieChart`). |
| **Feature Components** | `src/features/*/components` | Domain-specific wrappers (e.g., `ChartsShowcase`, `PortfolioAllocationCharts`). |
| **Chart Utilities** | Parent feature/page files | Slice palettes, gauge bands, sunburst branch maps — passed as props. |
| **Chart Hooks** | `src/hooks` | Shared hooks for chart lifecycle, resizing, and data fetching. |

---

## Integration Strategy

### 1. Chart Lifecycle Handling
AmCharts 5 requires explicit disposal to prevent memory leaks in a SPA.

```javascript
// Pattern for React integration
useLayoutEffect(() => {
  const root = am5.Root.new(chartId);
  
  // Setup chart...
  
  return () => {
    root.dispose(); // CRITICAL: Prevent memory leaks
  };
}, [chartId]);
```

### 2. Theme & Color Management

**Parent-owned colors**: Chart slice/band colors are defined in the **parent feature or page** (e.g. `Dashboard.jsx`, `ClientDetailSummaryCards.jsx`) and passed via props. Chart components do not ship default palettes.

| Component | Prop | Shape | Required when |
| :--- | :--- | :--- | :--- |
| `DonutChart` | `colors` | `string[]` hex values | `data` is non-empty |
| `PieChart` | `colors` | `string[]` hex values | `data` is non-empty |
| `GaugeChart` | `bands` | `{ start, end, color }[]` | chart renders |
| `SunburstChart` | `branchColors` | `Record<string, string>` | `data` is present |

**Suggested default palette** (Figma-aligned — define in parent, optionally copy from `--chart-1` … `--chart-5` in `src/index.css`):

| Index | Hex | Use |
| :--- | :--- | :--- |
| 1 | `#124E7A` | Dark blue (largest slice) |
| 2 | `#6889C9` | Periwinkle |
| 3 | `#B85C5C` | Coral |
| 4 | `#D97A32` | Orange |
| 5 | `#2E8FD4` | Sky blue |

**Example — dashboard segmentation** (`src/features/dashboard/Dashboard.jsx`):

```javascript
const SEGMENTATION_COLORS = [
  '#124e7a',
  '#6889c9',
  '#b85c5c',
  '#d97a32',
  '#2e8fd4',
];

<DonutChart data={riskData} colors={SEGMENTATION_COLORS} ... />
<PieChart data={aumData} colors={SEGMENTATION_COLORS} ... />
```

**Chart chrome** (slice stroke, tooltip, legend text): read from CSS variables at runtime inside chart components (`--bg-page`, `--bg-popup`, `--text-paragraph`, `--stroke-divider`). Do not pass these from parents.

**Adaptive slice labels**: Donut/Pie charts compute label color from slice luminance using `--chart-label-light` / `--chart-label-dark` — parents only supply slice fill colors.

**Card containers**: Chart components use the shared `Card` primitive with `bg-layer1 border-stroke-divider`.

### 3. Responsive Design
- Use `am5.Percent(100)` for container dimensions.
- Implement `useResizeObserver` in a shared hook to trigger `root.container.set("width", ...)` if needed.

---

## Shared Reusable Components

### ChartWrapper (`src/components/charts/ChartWrapper.jsx`)
Standard container that handles loading states, error boundaries, and empty states.

```javascript
import React, { Suspense } from 'react';
import { PageLoader } from '@components/ui/PageLoader';

export const ChartWrapper = ({ children, title, subtitle, isLoading, isEmpty }) => {
  return (
    <div className="chart-wrapper p-4 bg-layer-1 border border-stroke-divider rounded-xl">
      {(title || subtitle) && (
        <div className="chart-header mb-4">
          {title && <h4 className="text-text-heading font-semibold">{title}</h4>}
          {subtitle && <p className="text-text-paragraph text-sm">{subtitle}</p>}
        </div>
      )}
      <div className="chart-content relative min-h-[350px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <PageLoader size="sm" />
          </div>
        ) : isEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center text-text-disabled">
            No data available
          </div>
        ) : (
          <Suspense fallback={<PageLoader size="sm" />}>
            {children}
          </Suspense>
        )}
      </div>
    </div>
  );
};
```

### Shared Reusable Components

#### Props API (Common for Pie & Donut)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `data` | `Array` | `[]` | `[{ category: string, value: number }]` |
| `title` | `string` | `undefined` | Card title (rendered with premium underline decoration) |
| `colors` | `string[]` | *(none — required from parent)* | Hex colors for slices |
| `legendValueText` | `string` | `": {valuePercentTotal.formatNumber('#.##')}%"` | AmCharts legend value template (`PieChart`) |
| `sliceLabelText` | `string` | `"{value.formatNumber('#.##')}%"` | AmCharts slice label template (`PieChart`) |
| `sliceLabelFontSize` | `number` | `14` | Slice label font size in px (`PieChart`) |
| `showLegend` | `boolean` | `true` | Toggle legend visibility (`PieChart`) |
| `embedded` | `boolean` | `false` | Render chart without `Card` wrapper — for nested layouts (`PieChart`) |
| `bands` | `Array` | *(none — required from parent)* | Gauge band segments (`GaugeChart` only) |
| `branchColors` | `Object` | *(none — required from parent)* | Top-level branch colors (`SunburstChart` only) |
| `loading` | `boolean` | `false` | Show skeleton loading state |
| `height` | `number \| string` | `300` | Card height in px |
| `className` | `string` | `undefined` | Tailwind overrides for the card |

#### DonutChart (`src/components/charts/DonutChart.jsx`)
- **Visuals**: Ring chart with `innerRadius: 70%` for a modern, thin profile.
- **Labels**: Percentage labels inside the ring with adaptive color from slice luminance.
- **Legend**: Unified format `Category - Value` (e.g., `Conservative - 78`).
- **Colors**: Parent passes `colors` prop.

#### PieChart (`src/components/charts/PieChart.jsx`)
- **Visuals**: Full pie chart (`innerRadius: 0%`).
- **Labels**: Percentage labels inside slices with adaptive color from slice luminance. Override via `sliceLabelText` and `sliceLabelFontSize`.
- **Legend**: Default format `Category : Value%`; override via `legendValueText`. Data rows may include extra fields (e.g. `displayValue`) referenced in custom templates.
- **Embedded mode**: Set `embedded={true}` to render without the outer `Card` — use inside parent cards or split layouts (see `PortfolioInvestmentSummary`).
- **Colors**: Parent passes `colors` prop.

#### GaugeChart (`src/components/charts/GaugeChart.jsx`)
- **Visuals**: Semi-circular gauge chart for scores or risk levels.
- **Features**: Segmented bands from parent `bands` prop and a dynamic pointer needle.
- **Usage**: Best for single-metric visualizations like "Portfolio Risk Score".

#### SunburstChart (`src/components/charts/SunburstChart.jsx`)
- **Visuals**: Hierarchical circular chart (Sunburst) for nested data structures.
- **Features**: Deeply nested data support, top-level colors from parent `branchColors`, child segments lighten automatically.
- **Usage**: Perfect for complex asset allocation or multi-level category distribution (e.g., "Mutual Fund > Equity > Large Cap").

> [!NOTE]
> All chart components now utilize the shared **`Card`** system for their outer containers. This ensures unified rounding, borders, and premium title underlining across all visualizations.

> All chart components generate their own unique `chartId` internally via `useRef` — no external ID is needed.

---

## Feature-Level Implementations

### ChartsShowcase (`src/features/dashboard/components/ChartsShowcase.jsx`)
Demonstrates components side-by-side with data matching the high-fidelity design.

```javascript
import { DonutChart, PieChart } from '@components/charts';

export const ChartsShowcase = () => {
  const segmentationColors = ['#124e7a', '#6889c9', '#b85c5c', '#d97a32', '#2e8fd4'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <DonutChart
        title="Client Segmentation by Risk"
        data={riskData}
        colors={segmentationColors}
        height={380}
      />
      <PieChart
        title="AUM by category"
        data={aumData}
        colors={segmentationColors}
        height={380}
      />
    </div>
  );
};
```

### Portfolio allocation (`src/features/portfolio/components/PortfolioAllocationCharts.jsx`)

Domain-owned palettes per chart come from `public/mock/portfolio.json` (`allocationCharts[].colors`). Parent grid uses `height={390}` and passes mock `title`, `data`, and `colors` to each `PieChart`.

### Portfolio platform split (`src/features/portfolio/components/PortfolioInvestmentSummary.jsx`)

Uses `PieChart` in **embedded** mode inside a parent `Card`. Platform split data includes `displayValue` for formatted legend/slice labels:

```javascript
const platformChartData = platformSplit.map(({ label, percent, value }) => ({
  category: label,
  value: percent,
  displayValue: value,
}));

<PieChart
  embedded
  data={platformChartData}
  colors={PLATFORM_COLORS}
  height={200}
  legendValueText=": {displayValue}"
  sliceLabelText="{displayValue}"
  sliceLabelFontSize={10}
/>
```

Palette `PLATFORM_COLORS` is defined in `src/features/portfolio/portfolioConfig.js`.

---

## Implementation Examples

### 1. Reusable Chart Components

#### `src/components/charts/DonutChart.jsx`
```javascript
// Parent (feature/page) owns the palette
const SEGMENTATION_COLORS = ['#124e7a', '#6889c9', '#b85c5c', '#d97a32', '#2e8fd4'];

<DonutChart data={riskData} colors={SEGMENTATION_COLORS} title="Client Segmentation by Risk" />
```

Chart components read chrome colors from CSS variables at runtime and compute adaptive slice label colors internally — parents only pass `colors`, `bands`, or `branchColors`.

#### `src/components/charts/PieChart.jsx`
Same pattern as `DonutChart` but without `innerRadius` and with `legendValueText: ': {valuePercentTotal.formatNumber(\'0.00\')}%'`.

### 2. Barrel Export

#### `src/components/charts/index.js`
```javascript
export { default as DonutChart } from './DonutChart';
export { default as PieChart }   from './PieChart';
export { default as GaugeChart } from './GaugeChart';
```

---

## Technical Standards & Best Practices

### Performance Optimization
- **React.memo**: Wrap all chart components in `React.memo` to prevent re-renders when parent state changes unrelated to chart data.
- **Lazy Loading**: Use `React.lazy` for chart components to reduce initial bundle size.
- **Data Transformation**: Perform heavy data mapping in `src/utils/charts` to keep components clean.

### Memory Leak Prevention
- **Always** call `root.dispose()` in the cleanup function of `useLayoutEffect`.
- Avoid storing large AmCharts object instances in React state; use `useRef`.

### Accessibility (chart labels)

- Parents must choose slice/band colors with sufficient contrast; Donut/Pie adapt label text color (light vs dark) from slice luminance.
- Tooltip backgrounds use `--bg-popup`; slice strokes use `--bg-page`.

### Dark Theme Support
- Detect theme changes via global state (Redux) or CSS classes.
- Use `am5.Color.filter` or update themes dynamically when the `dark` class is toggled on `document.body`.

### Enterprise Standards
- **Prop Validation**: Use TypeScript (if introduced) or PropTypes for all chart configurations.
- **Accessibility**: Ensure `series.set("tooltipText", ...)` provides meaningful information.
- **Error Boundaries**: Wrap charts in an `ErrorBoundary` to prevent a single visualization failure from crashing the entire dashboard.

## Future Scalability
- **Plugin Architecture**: As complexity grows, move specific AmCharts logic (like specialized axes or custom bullets) into a plugin-like helper system in `src/utils/charts`.
- **Dynamic Imports**: Consider dynamically importing `@amcharts/amcharts5` only when the first chart is mounted to optimize TTI (Time to Interactive).
