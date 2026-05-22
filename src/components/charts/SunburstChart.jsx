import { memo, useId, useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { cn } from "@/utils/cn";

const SunburstSkeleton = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="h-5 w-52 bg-layer2 rounded mb-5" />
    <div className="flex items-center justify-center flex-1">
      <div className="w-64 h-64 rounded-full border-[30px] border-layer2 relative">
        <div className="absolute inset-0 m-auto w-32 h-32 rounded-full border-[20px] border-layer3/50" />
      </div>
    </div>
  </div>
);

/**
 * SunburstChart
 *
 * @param {Object}  data          - Hierarchical data object { name: string, children: [] }
 * @param {string}  title         - Chart title (underlined)
 * @param {Object}  branchColors  - Top-level branch name → hex color map (required)
 * @param {boolean} loading       - Show skeleton loader
 * @param {string}  className     - Extra Tailwind classes for the card
 * @param {number|string} height  - Card height (default 500)
 */
const SunburstChart = ({
  data,
  title,
  branchColors = {},
  loading = false,
  className,
  height = 600,
}) => {
  const chartId = `sunburst-chart-${useId().replaceAll(":", "")}`;

  useLayoutEffect(() => {
    if (loading || !data || !Object.keys(branchColors).length) return;

    const root = am5.Root.new(chartId);
    if (root._logo) root._logo.dispose();

    root.setThemes([am5themes_Animated.new(root)]);

    const container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout,
      })
    );

    const series = container.children.push(
      am5hierarchy.Sunburst.new(root, {
        singleBranchOnly: false,
        downDepth: 10,
        initialDepth: 10,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
      })
    );

    // Styling the segments (nodes)
    series.nodes.template.setAll({
      strokeOpacity: 0,
      strokeWidth: 0,
      tooltipText: "{category}: [bold]{sum.formatNumber('#.##')}[/]",
    });

    // Label styling
    series.labels.template.setAll({
      fontSize: 10,
      fill: am5.color("#ffffff"),
      centerX: am5.percent(50),
      centerY: am5.percent(50),
      oversizedBehavior: "fit",
      minScale: 0.5,
    });

    // Custom colors for branches
    series.slices.template.adapters.add("fill", (fill, target) => {
      const dataItem = target.dataItem;
      if (dataItem) {
        // Inherit color from parent if available, or use specific branch colors
        const parent = dataItem.get("parent");
        if (parent && parent.get("fill")) {
          // Slightly lighten children for depth
          return am5.Color.lighten(parent.get("fill"), 0.05);
        }

        const name = dataItem.get("category");
        if (branchColors[name]) {
          return am5.color(branchColors[name]);
        }
        return fill;
      }
      return fill;
    });

    series.data.setAll([data]);
    series.set("selectedDataItem", series.dataItems[0]);

    series.appear(1000, 100);

    return () => root.dispose();
  }, [data, loading, branchColors, chartId]);

  return (
    <div
      className={cn(
        "rounded-2xl border border-stroke-divider bg-layer1 p-5 shadow-xl transition-all hover:border-outline-active/40",
        className
      )}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      {loading ? (
        <SunburstSkeleton />
      ) : (
        <div className="flex flex-col h-full">
          {title && (
            <div className="mb-4">
              <h3 className="text-base font-medium text-heading underline underline-offset-[6px] decoration-paragraph/30 tracking-tight">
                {title}
              </h3>
            </div>
          )}
          <div className="flex-1 relative">
            {!data ? (
              <div className="absolute inset-0 flex items-center justify-center text-paragraph/70 text-sm italic">
                No data available
              </div>
            ) : (
              <div id={chartId} className="w-full h-full" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(SunburstChart);
