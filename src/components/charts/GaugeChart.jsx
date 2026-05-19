import { memo, useId, useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { cn } from "@/utils/cn";

const GaugeSkeleton = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="h-5 w-52 bg-layer2 rounded mb-5" />
    <div className="flex flex-col items-center justify-center flex-1">
      <div
        className="w-48 h-24 bg-layer2 rounded-t-full relative overflow-hidden"
        style={{ borderBottom: "4px solid var(--bg-layer-3)" }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-layer3" />
      </div>
      <div className="h-6 w-32 bg-layer2 rounded mt-6" />
    </div>
  </div>
);

/**
 * GaugeChart
 *
 * @param {number}  value     - Current value (0-100)
 * @param {string}  title     - Chart title (underlined)
 * @param {string}  label     - Label displayed below the gauge (e.g. "Moderate : 65/100")
 * @param {Array}   bands     - [{ start: number, end: number, color: string }] (required)
 * @param {boolean} loading   - Show skeleton loader
 * @param {string}  className - Extra Tailwind classes for the card
 * @param {number|string} height - Card height (default 380)
 */
const GaugeChart = ({
  value = 0,
  title,
  label,
  bands = [],
  loading = false,
  className,
  height = 380,
}) => {
  const chartId = `gauge-chart-${useId().replaceAll(":", "")}`;

  useLayoutEffect(() => {
    if (loading || !bands?.length) return;

    const root = am5.Root.new(chartId);
    if (root._logo) root._logo.dispose();

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        startAngle: 180,
        endAngle: 360,
        innerRadius: am5.percent(65),
      })
    );

    // Create axis and its renderer
    const axisRenderer = am5radar.AxisRendererCircular.new(root, {
      innerRadius: -25,
      strokeOpacity: 0.1,
      minGridDistance: 1000,
    });

    axisRenderer.labels.template.set("visible", false);
    axisRenderer.grid.template.set("visible", false);

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        max: 100,
        strictMinMax: true,
        renderer: axisRenderer,
      })
    );

    // Add clock hand
    const axisDataItem = xAxis.makeDataItem({});
    axisDataItem.set("value", value);

    const clockHand = am5radar.ClockHand.new(root, {
      pinRadius: am5.percent(15),
      radius: am5.percent(95),
      bottomWidth: 15,
      topWidth: 1,
    });

    clockHand.pin.setAll({
      fill: am5.color(0x555555),
      strokeOpacity: 0,
    });

    clockHand.hand.setAll({
      fill: am5.color(0x555555),
      strokeOpacity: 0,
    });

    axisDataItem.set(
      "bullet",
      am5xy.AxisBullet.new(root, {
        sprite: clockHand,
      })
    );

    xAxis.createAxisRange(axisDataItem);

    // Bands data from design
    bands.forEach((seg) => {
      const rangeDataItem = xAxis.makeDataItem({});
      rangeDataItem.set("value", seg.start);
      rangeDataItem.set("endValue", seg.end);

      const range = xAxis.createAxisRange(rangeDataItem);

      range.get("axisFill").setAll({
        visible: true,
        fill: am5.color(seg.color),
        fillOpacity: 1,
        cornerRadius: 0,
        innerRadius: -25,
      });

      // Special styling for the active segment
      if (value >= seg.start && value < seg.end) {
        range.get("axisFill").setAll({
          innerRadius: -35, // Popped out
          stroke: am5.color(0xffffff),
          strokeWidth: 2,
          strokeOpacity: 0.8,
        });
      }
    });

    chart.appear(1000, 100);

    return () => root.dispose();
  }, [value, loading, bands, chartId]);

  return (
    <div
      className={cn(
        "rounded-2xl border border-stroke-divider bg-layer1 p-5 shadow-xl transition-all hover:border-outline-active/40",
        className
      )}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      {loading ? (
        <GaugeSkeleton />
      ) : (
        <div className="flex flex-col h-full">
          {title && (
            <div className="mb-4">
              <h3 className="text-[15px] font-semibold text-heading underline underline-offset-4 decoration-paragraph/50 tracking-tight">
                {title}
              </h3>
            </div>
          )}
          <div className="flex-1 relative flex flex-col items-center justify-center">
            <div id={chartId} className="w-full h-full max-h-[220px]" />
            {label && (
              <div className="mt-4 text-center">
                <span className="text-xl font-bold text-subheading tracking-wide">
                  {label}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(GaugeChart);
