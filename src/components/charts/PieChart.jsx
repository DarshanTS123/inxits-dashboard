import { useId, useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { cn } from "@/utils/cn";
import { Card } from "@/components/ui/Card/Card";

const DEFAULT_PIE_COLORS = [
  "#C06161", // red/coral
  "#7B94C9", // light blue
  "#E07B39", // orange
  "#619082", // teal
  "#8F9BCC", // lavender
];

const PieSkeleton = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="h-5 w-40 bg-slate-800 rounded mb-5" />
    <div className="flex flex-1 items-center gap-6">
      <div
        className="flex-shrink-0 rounded-full bg-slate-800"
        style={{ width: 150, height: 150 }}
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
 * PieChart
 *
 * @param {Array}   data      - [{ category: string, value: number }]
 * @param {string}  title     - Chart title (underlined)
 * @param {string[]} colors   - Optional color palette override
 * @param {boolean} loading   - Show skeleton loader
 * @param {string}  className - Extra Tailwind classes for the card
 * @param {number|string} height - Card height (default 300)
 *
 * Legend format: "Category : XX%"
 */
const PieChart = ({
  data = [],
  title,
  colors,
  loading = false,
  className,
  height = 300,
  legendValueText,
}) => {
  const chartId = `pie-chart-${useId().replaceAll(":", "")}`;

  useLayoutEffect(() => {
    if (loading || !data || data.length === 0) return;

    const root = am5.Root.new(chartId);
    if (root._logo) root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    // ── Chart ──────────────────────────────────────────────────────────────
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.horizontalLayout,
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
        legendValueText: legendValueText || ": {valuePercentTotal.formatNumber('#.##')}%",
      })
    );

    // Colors
    const palette = colors?.length ? colors : DEFAULT_PIE_COLORS;
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
        "{category}: [bold]{valuePercentTotal.formatNumber('0.00')}%[/] ({value})",
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

    // Labels inside slices
    series.labels.template.setAll({
      inside: true,
      radius: 40,
      fontSize: 14,
      fontWeight: "500",
      fill: am5.color("#ffffff"),
      text: "{value.formatNumber('#.##')}%", // Show decimals only if needed (up to 2)
      centerX: am5.percent(50),
      centerY: am5.percent(50),
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

    // Legend Label Text Configuration
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
  }, [data, loading, colors, legendValueText, chartId]);

  return (
    <Card
      padding="md"
      hoverable
      title={!loading ? title : undefined}
      loading={loading}
      loadingFallback={<PieSkeleton />}
      className={cn("flex flex-col", className)}
      contentClassName="flex-1 relative"
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      {!data || data.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm italic">
          No data available
        </div>
      ) : (
        <div id={chartId} className="w-full h-full" />
      )}
    </Card>
  );
};

export default PieChart;
