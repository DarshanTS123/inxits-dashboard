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
| **Shared Base Components** | `src/components/charts` | Generic, reusable chart types (e.g., `CommonPieChart`). |
| **Feature Components** | `src/features/dashboard/components` | Domain-specific wrappers (e.g., `RiskSegmentationChart`). |
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

### CommonPieChart (`src/components/charts/CommonPieChart.jsx`)
A generic Pie chart component that accepts data and configuration.

### CommonDonutChart (`src/components/charts/CommonDonutChart.jsx`)
Extends Pie chart with `innerRadius` configuration.

---

## Feature-Level Implementations

### RiskSegmentationChart (`src/features/dashboard/components/RiskSegmentationChart.jsx`)
Uses `CommonPieChart` or a custom implementation to show risk levels.

```javascript
import { CommonPieChart } from '@components/charts';

export const RiskSegmentationChart = ({ data }) => {
  const transformedData = transformRiskData(data);
  return (
    <div className="risk-chart-container">
      <h3>Risk Segmentation</h3>
      <CommonPieChart data={transformedData} />
    </div>
  );
};
```

---

## Implementation Examples

### 1. Reusable Chart Components

#### `src/components/charts/CommonPieChart.jsx`
```javascript
import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export const CommonPieChart = React.memo(({ 
  data, 
  chartId = "pie-chart",
  valueField = "value",
  categoryField = "category",
  innerRadius = 0 
}) => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    const root = am5.Root.new(chartId);
    
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(innerRadius)
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField,
        categoryField
      })
    );

    series.data.setAll(data);
    
    // Legend setup, tooltips, etc.
    
    chartRef.current = root;

    return () => root.dispose();
  }, [chartId, data, innerRadius, valueField, categoryField]);

  return <div id={chartId} style={{ width: "100%", height: "350px" }} />;
});
```

#### `src/components/charts/CommonDonutChart.jsx`
```javascript
import { CommonPieChart } from './CommonPieChart';

export const CommonDonutChart = (props) => (
  <CommonPieChart {...props} innerRadius={50} />
);
```

### 2. Dashboard Integration

#### `src/features/dashboard/components/DashboardCharts.jsx`
```javascript
import { RiskSegmentationChart } from './RiskSegmentationChart';
import { useDashboardData } from '../hooks/useDashboardData';

export const DashboardCharts = () => {
  const { data, isLoading } = useDashboardData();

  if (isLoading) return <ChartLoader />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RiskSegmentationChart data={data.riskSegments} />
      {/* Other charts */}
    </div>
  );
};
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
