import { PieChart } from '@/components/charts';

const ALLOCATION_CHART_HEIGHT = 390;

export function PortfolioAllocationCharts({ charts = [], loading = false }) {
  const chartCards = loading
    ? Array.from({ length: 4 }, (_, index) => ({ id: index }))
    : charts;

  return (
    <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
      {chartCards.map((chart) => (
        <PieChart
          key={chart.id}
          title={chart.title}
          data={chart.data || []}
          colors={chart.colors || []}
          loading={loading}
          height={ALLOCATION_CHART_HEIGHT}
          className="rounded-xl"
        />
      ))}
    </div>
  );
}
