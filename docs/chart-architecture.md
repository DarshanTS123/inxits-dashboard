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
| **Feature Components** | `src/features/dashboard/components` | Domain-specific wrappers (e.g., `ChartsShowcase`). |
| **Chart Utilities** | `src/utils/charts` | Data formatters, adapters, and AmCharts configuration helpers. |
| **Chart Hooks** | `src/hooks` | Shared hooks for chart lifecycle, resizing, and data fetching. |
| **Theme & Colors** | `src/styles` | Centralized AmCharts theme definitions and color palettes. |

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
Integrate AmCharts with our design tokens defined in `src/styles`.

- **Location**: `src/styles/chartTheme.js`
- **Pattern**: Use CSS variables (e.g., `var(--primary)`) or resolve tokens via a utility.

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
| `colors` | `string[]` | Built-in palette | Custom hex colors for slices |
| `loading` | `boolean` | `false` | Show skeleton loading state |
| `height` | `number \| string` | `300` | Card height in px |
| `className` | `string` | `undefined` | Tailwind overrides for the card |

#### DonutChart (`src/components/charts/DonutChart.jsx`)
- **Visuals**: Ring chart with `innerRadius: 70%` for a modern, thin profile.
- **Labels**: Smart integer formatting (`#.##%`) shown inside the ring.
- **Legend**: Unified format `Category - Value` (e.g., `Conservative - 78`).
- **Colors**: Vibrant risk-based palette (Orange, Blue, Dark Blue, Red, Steel Blue).

#### PieChart (`src/components/charts/PieChart.jsx`)
- **Visuals**: Full pie chart (`innerRadius: 0%`).
- **Labels**: Smart integer formatting (`#.##%`) shown inside slices.
- **Legend**: Specialized format `Category : Value%` (e.g., `Equity Fund : 30%`).
- **Colors**: Asset-based palette (Coral, Steel Blue, Amber, Sage, Lavender).

#### GaugeChart (`src/components/charts/GaugeChart.jsx`)
- **Visuals**: Semi-circular gauge chart for scores or risk levels.
- **Features**: Supports segmented colored bands (Low, Mid, High) and a dynamic pointer needle.
- **Usage**: Best for single-metric visualizations like "Portfolio Risk Score".

#### SunburstChart (`src/components/charts/SunburstChart.jsx`)
- **Visuals**: Hierarchical circular chart (Sunburst) for nested data structures.
- **Features**: Deeply nested data support, automatic branch-based coloring, and intelligent label fitting.
- **Usage**: Perfect for complex asset allocation or multi-level category distribution (e.g., "Mutual Fund > Equity > Large Cap").

> All chart components generate their own unique `chartId` internally via `useRef` — no external ID is needed.

---

## Feature-Level Implementations

### ChartsShowcase (`src/features/dashboard/components/ChartsShowcase.jsx`)
Demonstrates components side-by-side with data matching the high-fidelity design.

```javascript
import { DonutChart, PieChart } from '@components/charts';

export const ChartsShowcase = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0d1526]">
    <DonutChart
      title="Client Segmentation by Risk"
      data={riskData}
      height={380}
    />
    <PieChart
      title="AUM by category"
      data={aumData}
      height={380}
    />
  </div>
);
```

---

## Implementation Examples

### 1. Reusable Chart Components

#### `src/components/charts/DonutChart.jsx`
```javascript
const DonutChart = ({ data, title, colors, loading, height = 300 }) => {
  const chartIdRef = useRef(`donut-chart-${Math.random().toString(36).substr(2, 9)}`);

  useLayoutEffect(() => {
    if (loading || !data?.length) return;
    const root = am5.Root.new(chartIdRef.current);
    
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, { 
        innerRadius: am5.percent(70), 
        layout: root.horizontalLayout 
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false,
      })
    );

    // Labels inside the ring with smart decimal logic
    series.labels.template.setAll({
      inside: true,
      text: "{valuePercentTotal.formatNumber('#.##')}%",
      fill: am5.color("#ffffff"),
      fontSize: 14
    });

    // Unified legend format: "Category - Value"
    const legend = chart.children.push(am5.Legend.new(root, {
      layout: root.verticalLayout,
      paddingLeft: 20
    }));

    legend.labels.template.setAll({
      text: "{category} - {value.formatNumber('#.##')}",
      fill: am5.color("#cbd5e1")
    });

    series.data.setAll(data);
    legend.data.setAll(series.dataItems);
    
    return () => root.dispose();
  }, [data, loading]);

  return <div id={chartIdRef.current} className="w-full h-full" />;
};
```

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
