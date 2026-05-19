import { useDashboardData } from './api/dashboard';
import { StatsGrid } from './components/StatsGrid';
import { DonutChart, PieChart } from '@/components/charts';
import { RegulatoryAnnouncements } from './components/RegulatoryAnnouncements';
import { BusinessUpdateTable, RMPerformanceTable } from './components/SummaryTables';
import { OngoingTransactions } from './components/OngoingTransactions';
import { Select } from '@/components/ui/Select/Select';
import { Button } from '@/components/ui/Button/Button';

const THIRD_ROW_CARD_HEIGHT = 400;

const SEGMENTATION_COLORS = [
  '#124e7a',
  '#6889c9',
  '#b85c5c',
  '#d97a32',
  '#2e8fd4',
];

const TRANSACTION_STATUS_COLORS = ['#ea5758', '#28c76f', '#efbf00', '#6889c9'];

export const Dashboard = () => {
  const { data: dashboardData, isLoading } = useDashboardData();

  const aumData = [
    { category: 'Equity Fund', value: 30 },
    { category: 'Debt Fund', value: 20 },
    { category: 'Hybrid Fund', value: 20 },
    { category: 'Cash', value: 30 },
    { category: 'Other', value: 30 },
  ];

  const riskData = [
    { category: 'Conservative', value: 78 },
    { category: 'Moderately Conservative', value: 42 },
    { category: 'Moderate', value: 42 },
    { category: 'Moderately Aggressive', value: 42 },
    { category: 'Aggressive', value: 24 },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Top Section: Alerts */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="md"
          className="border-stroke-divider bg-layer2 font-semibold text-subheading hover:bg-layer1"
        >
          Alerts(10)
        </Button>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={dashboardData?.stats} loading={isLoading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <DonutChart
          title="Client Segmentation by Risk"
          data={riskData}
          colors={SEGMENTATION_COLORS}
          loading={isLoading}
          height={380}
        />
        <PieChart
          title="AUM by category"
          data={aumData}
          colors={SEGMENTATION_COLORS}
          loading={isLoading}
          height={380}
        />
      </div>

      {/* Third Row: Transaction Status & Announcements */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
        <PieChart
          title="Transaction Status"
          data={dashboardData?.transactionStatus}
          loading={isLoading}
          height={THIRD_ROW_CARD_HEIGHT}
          headerClassName="items-center"
          colors={TRANSACTION_STATUS_COLORS}
          legendValueText=": {value}"
          action={
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4">
                <label className="group flex cursor-pointer items-center gap-1.5">
                  <input
                    type="radio"
                    name="tx-type"
                    className="h-3 w-3 accent-primary"
                    defaultChecked
                  />
                  <span className="text-[11px] font-medium text-paragraph/70 group-hover:text-subheading">
                    Lumpsum
                  </span>
                </label>
                <label className="group flex cursor-pointer items-center gap-1.5">
                  <input type="radio" name="tx-type" className="h-3 w-3 accent-blue-500" />
                  <span className="text-[11px] font-medium text-paragraph/70 group-hover:text-subheading">
                    SIP
                  </span>
                </label>
              </div>
              <Select
                options={[{ label: 'MTD', value: 'mtd' }]}
                defaultValue="mtd"
                className="h-7 min-w-[70px] border-stroke-divider bg-layer2 text-[10px]"
              />
            </div>
          }
        />
        <RegulatoryAnnouncements
          announcements={dashboardData?.announcements}
          loading={isLoading}
          height={THIRD_ROW_CARD_HEIGHT}
        />
      </div>

      {/* Fourth Row: Business Update */}
      <BusinessUpdateTable data={dashboardData?.businessUpdate} loading={isLoading} />

      {/* Fifth Row: RM Performance */}
      <RMPerformanceTable data={dashboardData?.rmPerformance} loading={isLoading} />

      {/* Bottom Row: Ongoing Transactions */}
      <OngoingTransactions data={dashboardData?.transactions} loading={isLoading} />
    </div>
  );
};
