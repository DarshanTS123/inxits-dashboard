import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { cn } from "@/utils/cn";

const DEFAULT_DONUT_COLORS = [
  "#E07B39", // orange
  "#3598E4", // medium blue
  "#114F7E", // dark blue
  "#C96868", // rose/red
  "#7893CD", // light blue
];

const DonutSkeleton = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="h-5 w-52 bg-slate-800 rounded mb-5" />
    <div className="flex flex-1 items-center gap-6">
      <div
        className="flex-shrink-0 rounded-full border-[28px] border-slate-800 bg-transparent"
        style={{ width: 140, height: 140 }}
      />
      <div className="flex flex-col gap-3 flex-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700 shrink-0" />
            <div className="h-3 bg-slate-800 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * DonutChart
 *
 * @param {Array}   data      - [{ category: string, value: number }]
 * @param {string}  title     - Chart title (underlined)
 * @param {string[]} colors   - Optional color palette override
 * @param {boolean} loading   - Show skeleton loader
 * @param {string}  className - Extra Tailwind classes for the card
 * @param {number|string} height - Card height (default 300)
 *
 * Legend format: "Category - value"
 */
const DonutChart = ({
  data = [],
  title,
  colors,
  loading = false,
  className,
  height = 300,
}) => {
  const chartIdRef = useRef(
    `donut-chart-${Math.random().toString(36).substr(2, 9)}`
  );

  useLayoutEffect(() => {
    if (loading || !data || data.length === 0) return;

    const root = am5.Root.new(chartIdRef.current);
    if (root._logo) root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    // ── Chart ──────────────────────────────────────────────────────────────
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.horizontalLayout,
        innerRadius: am5.percent(70),
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
      })
    );

    // ── Series ─────────────────────────────────────────────────────────────
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false,
        legendLabelText: "{category}",
        legendValueText: "- {value.formatNumber('#.##')}",
      })
    );

    // Colors
    const palette = colors?.length ? colors : DEFAULT_DONUT_COLORS;
    series.get("colors").set(
      "colors",
      palette.map((c) => am5.color(c))
    );

    // Slices
    series.slices.template.setAll({
      strokeOpacity: 1,
      strokeWidth: 2,
      stroke: am5.color("#0d1526"),
      interactive: true,
      tooltipText:
        "{category}: [bold]{value}[/] ({valuePercentTotal.formatNumber('0.00')}%)",
    });

    series.slices.template.states.create("hover", {
      scale: 1.04,
      shiftRadius: 5,
    });

    // Tooltip
    const tooltip = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      autoTextColor: false,
    });
    tooltip.get("background").setAll({
      fill: am5.color("#0d1526"),
      fillOpacity: 0.95,
      stroke: am5.color("#2a3550"),
      strokeWidth: 1,
      cornerRadius: 8,
    });
    tooltip.label.setAll({ fill: am5.color("#ffffff"), fontSize: 12 });
    series.slices.template.set("tooltip", tooltip);

    // Labels inside the ring (Percentage)
    series.labels.template.setAll({
      inside: true,
      radius: 16,
      fontSize: 10,
      fontWeight: "500",
      fill: am5.color("#ffffff"),
      text: "{valuePercentTotal.formatNumber('#.##')}%", // Show decimals only if needed (up to 2)
    });
    series.ticks.template.setAll({ forceHidden: true });

    // ── Legend ─────────────────────────────────────────────────────────────
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerY: am5.percent(50),
        y: am5.percent(50),
        layout: root.verticalLayout,
        paddingLeft: 20,
      })
    );

    // Legend Markers (Rounded Squares)
    legend.markers.template.setAll({ 
      width: 18, 
      height: 18,
    });
    
    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 6,
      cornerRadiusTR: 6,
      cornerRadiusBL: 6,
      cornerRadiusBR: 6,
    });

    // Legend Label Text Configuration (Unified for tight spacing)
    legend.labels.template.setAll({
      fontSize: 14,
      fontWeight: "400",
      fill: am5.color("#cbd5e1"),
    });

    legend.valueLabels.template.setAll({
      fontSize: 14,
      fontWeight: "400",
      fill: am5.color("#cbd5e1"),
    });

    // ── Data (always last) ─────────────────────────────────────────────────
    series.data.setAll(data);
    legend.data.setAll(series.dataItems);

    series.appear(1000, 100);
    chart.appear(1000, 100);

    return () => root.dispose();
  }, [data, loading, colors]);

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-700/60 bg-[#0d1526] p-5 shadow-xl transition-all hover:border-slate-600/80",
        className
      )}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      {loading ? (
        <DonutSkeleton />
      ) : (
        <div className="flex flex-col h-full">
          {title && (
            <div className="mb-4">
              <h3 className="text-[17px] font-medium text-slate-300 underline underline-offset-[6px] decoration-slate-400/30 tracking-tight">
                {title}
              </h3>
            </div>
          )}
          <div className="flex-1 relative">
            {!data || data.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm italic">
                No data available
              </div>
            ) : (
              <div id={chartIdRef.current} className="w-full h-full" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonutChart;
