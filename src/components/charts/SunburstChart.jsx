import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { cn } from "@/utils/cn";

const SunburstSkeleton = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="h-5 w-52 bg-slate-800 rounded mb-5" />
    <div className="flex items-center justify-center flex-1">
      <div className="w-64 h-64 rounded-full border-[30px] border-slate-800 relative">
        <div className="absolute inset-0 m-auto w-32 h-32 rounded-full border-[20px] border-slate-700/50" />
      </div>
    </div>
  </div>
);

/**
 * SunburstChart
 *
 * @param {Object}  data      - Hierarchical data object { name: string, children: [] }
 * @param {string}  title     - Chart title (underlined)
 * @param {boolean} loading   - Show skeleton loader
 * @param {string}  className - Extra Tailwind classes for the card
 * @param {number|string} height - Card height (default 500)
 */
const SunburstChart = ({
  data,
  title,
  loading = false,
  className,
  height = 600,
}) => {
  const chartIdRef = useRef(
    `sunburst-chart-${Math.random().toString(36).substr(2, 9)}`
  );

  useLayoutEffect(() => {
    if (loading || !data) return;

    const root = am5.Root.new(chartIdRef.current);
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
      strokeOpacity: 1,
      strokeWidth: 1.5,
      stroke: am5.color("#000000"), // Pure black for sharp separation as in image
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
        switch (name) {
          case "Mutual Fund":
            return am5.color("#3598E4");
          case "Stock":
            return am5.color("#8B5CF6");
          case "Bonds":
            return am5.color("#D946EF");
          case "Insurance":
            return am5.color("#BEF264");
          case "NPS":
            return am5.color("#A8704B");
          case "AIF":
            return am5.color("#C2410C");
          case "PMS":
            return am5.color("#BE185D");
          default:
            return fill;
        }
      }
      return fill;
    });

    series.data.setAll([data]);
    series.set("selectedDataItem", series.dataItems[0]);

    series.appear(1000, 100);

    return () => root.dispose();
  }, [data, loading]);

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/5 bg-[#0d1526] p-5 shadow-xl transition-all hover:border-white/10",
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
              <h3 className="text-[17px] font-medium text-slate-300 underline underline-offset-[6px] decoration-slate-400/30 tracking-tight">
                {title}
              </h3>
            </div>
          )}
          <div className="flex-1 relative">
            {!data ? (
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

export default React.memo(SunburstChart);
