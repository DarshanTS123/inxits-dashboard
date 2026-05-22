import { useMemo, useState } from 'react';

import { Card } from '@/components/ui/Card/Card';

import { usePortfolioData } from './api/portfolio';
import { PortfolioAllocationCharts } from './components/PortfolioAllocationCharts';
import { PortfolioControls } from './components/PortfolioControls';
import { PortfolioHoldingsTable } from './components/PortfolioHoldingsTable';
import { PortfolioInvestmentSummary } from './components/PortfolioInvestmentSummary';
import { PortfolioMetricCards } from './components/PortfolioMetricCards';

const EMPTY_HOLDINGS = [];
const EMPTY_METRICS = [];
const EMPTY_CHARTS = [];

export function PortfolioOversight() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data: portfolioData, isLoading } = usePortfolioData();
  const holdings = portfolioData?.holdings?.items || EMPTY_HOLDINGS;
  const holdingsTotal = portfolioData?.holdings?.total || holdings.length;

  const pagedHoldings = useMemo(() => {
    const start = (page - 1) * pageSize;
    return holdings.slice(start, start + pageSize);
  }, [holdings, page, pageSize]);

  const handlePageSizeChange = (nextPageSize) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-5">
      <PortfolioControls />
      <PortfolioMetricCards
        metrics={portfolioData?.metrics || EMPTY_METRICS}
        loading={isLoading}
      />
      <PortfolioInvestmentSummary
        summary={portfolioData?.investmentSummary}
        loading={isLoading}
      />
      <PortfolioAllocationCharts
        charts={portfolioData?.allocationCharts || EMPTY_CHARTS}
        loading={isLoading}
      />

      <Card
        padding="lg"
        title="Holdings"
        titleUnderline={false}
        className="rounded-xl"
        contentClassName="overflow-hidden rounded-lg border border-stroke-divider"
      >
        <PortfolioHoldingsTable
          holdings={pagedHoldings}
          page={page}
          pageSize={pageSize}
          total={holdingsTotal}
          loading={isLoading}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </Card>
    </div>
  );
}
