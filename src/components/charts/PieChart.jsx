import { useId, useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { cn } from "@/utils/cn";
import { Card } from "@/components/ui/Card/Card";

function readCssVar(name, fallback) {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

function getSliceLabelColor(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55
    ? readCssVar("--chart-label-dark", "#13172a")
    : readCssVar("--chart-label-light", "#ffffff");
}

const PieSkeleton = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="h-5 w-40 bg-layer2 rounded mb-5" />
    <div className="flex flex-1 items-center gap-6">
      <div
        className="flex-shrink-0 rounded-full bg-layer2"
        style={{ width: 150, height: 150 }}
      />
      <div className="flex flex-col gap-3 flex-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-layer3 shrink-0" />
            <div className="h-3 bg-layer2 rounded w-full" />
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
 * @param {string[]} colors   - Slice color palette (required when data is present)
 * @param {boolean} loading   - Show skeleton loader
 * @param {string}  className - Extra Tailwind classes for the card
 * @param {number|string} height - Card height (default 300)
 *
 * Legend format: "Category : XX%"
 */
const PieChart = ({
  data = [],
  title,
  colors = [],
  loading = false,
  className,
  height = 300,
  legendValueText,
  sliceLabelText,
  sliceLabelFontSize = 14,
  showLegend = true,
  embedded = false,
  action,
  headerClassName,
  actionClassName,
}) => {
  const chartId = `pie-chart-${useId().replaceAll(":", "")}`;

  useLayoutEffect(() => {
    if (loading || !data?.length || !colors?.length) return;

    const popupBg = readCssVar("--bg-popup", "#1a1f33");
    const legendText = readCssVar("--text-paragraph", "#c9c9c9");
    const divider = readCssVar("--stroke-divider", "#3a3a3a");

    const root = am5.Root.new(chartId);
    if (root._logo) root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: showLegend ? root.horizontalLayout : root.verticalLayout,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false,
        legendLabelText: "{category}",
        legendValueText: legendValueText || ": {valuePercentTotal.formatNumber('#.##')}%",
      })
    );

    series.get("colors").set(
      "colors",
      colors.map((c) => am5.color(c))
    );

    series.slices.template.setAll({
      strokeOpacity: 0,
      strokeWidth: 0,
      interactive: true,
      tooltipText:
        "{category}: [bold]{valuePercentTotal.formatNumber('0.00')}%[/] ({value})",
    });

    series.slices.template.states.create("hover", {
      scale: 1.04,
      shiftRadius: 5,
    });

    const tooltip = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      autoTextColor: false,
    });
    tooltip.get("background").setAll({
      fill: am5.color(popupBg),
      fillOpacity: 0.95,
      stroke: am5.color(divider),
      strokeWidth: 1,
      cornerRadius: 8,
    });
    tooltip.label.setAll({ fill: am5.color("#ffffff"), fontSize: 12 });
    series.slices.template.set("tooltip", tooltip);

    series.labels.template.setAll({
      inside: true,
      radius: 40,
      fontSize: sliceLabelFontSize,
      fontWeight: "500",
      text: sliceLabelText || "{value.formatNumber('#.##')}%",
      centerX: am5.percent(50),
      centerY: am5.percent(50),
    });

    if (!showLegend) {
      series.setAll({
        x: am5.percent(50),
        y: am5.percent(50),
        centerX: am5.percent(50),
        centerY: am5.percent(50),
      });
    }
    series.labels.template.adapters.add("fill", (_fill, target) => {
      const dataItem = target.dataItem;
      if (!dataItem) return am5.color("#ffffff");
      const index = series.dataItems.indexOf(dataItem);
      const sliceColor = colors[index % colors.length];
      return am5.color(getSliceLabelColor(sliceColor));
    });
    series.ticks.template.setAll({ forceHidden: true });

    series.data.setAll(data);

    if (showLegend) {
      const legend = chart.children.push(
        am5.Legend.new(root, {
          centerY: am5.percent(50),
          y: am5.percent(50),
          layout: root.verticalLayout,
          paddingLeft: 20,
        })
      );

      legend.itemContainers.template.setAll({
        interactive: true,
        cursorOverStyle: "pointer",
      });

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

      legend.labels.template.setAll({
        fontSize: 14,
        fontWeight: "400",
        fill: am5.color(legendText),
      });

      legend.valueLabels.template.setAll({
        fontSize: 14,
        fontWeight: "400",
        fill: am5.color(legendText),
      });

      legend.data.setAll(series.dataItems);
    }

    series.appear(1000, 100);
    chart.appear(1000, 100);

    return () => root.dispose();
  }, [
    data,
    loading,
    colors,
    legendValueText,
    sliceLabelText,
    sliceLabelFontSize,
    showLegend,
    chartId,
  ]);

  const hasChart = data?.length > 0 && colors?.length > 0;
  const resolvedHeight =
    typeof height === "number" ? `${height}px` : height;

  const chartContent = !hasChart ? (
    <div className="absolute inset-0 flex items-center justify-center text-paragraph/70 text-sm italic">
      No data available
    </div>
  ) : (
    <div id={chartId} className="h-full w-full" />
  );

  if (embedded) {
    const embeddedStyle = showLegend
      ? { height: resolvedHeight, width: "100%" }
      : { height: resolvedHeight, width: resolvedHeight };

    return (
      <div
        className={cn(
          "relative min-h-0",
          showLegend ? "w-full flex-1" : "shrink-0",
          className
        )}
        style={embeddedStyle}
      >
        {loading ? (
          <div
            className={cn(
              "h-full w-full animate-pulse bg-layer2",
              showLegend ? "rounded-lg" : "rounded-full"
            )}
          />
        ) : (
          chartContent
        )}
      </div>
    );
  }

  return (
    <Card
      padding="md"
      hoverable
      title={!loading ? title : undefined}
      action={!loading ? action : undefined}
      headerClassName={headerClassName}
      actionClassName={actionClassName}
      loading={loading}
      loadingFallback={<PieSkeleton />}
      className={cn("flex flex-col h-full", className)}
      contentClassName="flex-1 relative min-h-0"
      style={{ height: resolvedHeight }}
    >
      {chartContent}
    </Card>
  );
};

export default PieChart;
