import { PieChart } from '@/components/charts';
import { Card } from '@/components/ui/Card/Card';
import { DataTable } from '@/components/ui/Table/Table';

import { investmentSourceColumns, PLATFORM_COLORS } from '../portfolioConfig';

const DEFAULT_PLATFORM_SPLIT = [
  { label: 'Inxits', value: '₹1,29,50,000 (70%)', percent: 70 },
  { label: 'Finfactor', value: '₹5,55,000 (30%)', percent: 30 },
];

const PLATFORM_CHART_HEIGHT = 200;

/** Same { category, value } shape as allocation chart data, plus displayValue for labels/legend. */
function toPlatformChartData(platformSplit = []) {
  return platformSplit.map(({ label, percent, value }) => ({
    category: label,
    value: percent,
    displayValue: value,
  }));
}

export function PortfolioInvestmentSummary({ summary, loading = false }) {
  const platformSplit = summary?.platformSplit?.length
    ? summary.platformSplit
    : DEFAULT_PLATFORM_SPLIT;
  const platformChartData = toPlatformChartData(platformSplit);

  return (
    <Card
      padding="lg"
      className="rounded-xl"
      titleUnderline={false}
      loading={loading}
      skeletonRows={4}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(300px,380px)_1fr]">
        <div className="flex min-h-[200px] items-center border-stroke-divider py-4 lg:border-r">
          <PieChart
            embedded
            data={platformChartData}
            colors={PLATFORM_COLORS}
            loading={loading}
            height={PLATFORM_CHART_HEIGHT}
            legendValueText=": {displayValue}"
            sliceLabelText="{displayValue}"
            sliceLabelFontSize={10}
            className="px-2"
          />
        </div>

        <div className="rounded-lg bg-layer2 p-4">
          <h3 className="mb-4 text-xl font-semibold text-heading">
            Total Investment{' '}
            <span className="pl-2 text-base">
              : {summary?.totalInvestment || '₹15,50,000'}
            </span>
          </h3>
          <DataTable
            columns={investmentSourceColumns}
            data={summary?.sources || []}
            containerClassName="rounded-lg border border-stroke-divider"
            tableClassName="min-w-[620px]"
            rowClassName="[&_td]:bg-layer2"
          />
        </div>
      </div>
    </Card>
  );
}
