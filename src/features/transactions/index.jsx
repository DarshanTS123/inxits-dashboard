import { useMemo } from 'react';
import { Tabs } from '@/components/ui/Tabs/Tabs';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { TransactionHeader } from './components/TransactionHeader';
import { TransactionSummaryCards } from './components/TransactionSummaryCards';
import { TransactionControls } from './components/TransactionControls';
import { TransactionTable } from './components/TransactionTable';
import { TRANSACTION_TABS } from './constants/transactionConstants';
import { useTransactionsManager } from './hooks/useTransactionsManager';

export const Transactions = () => {
  const {
    transactions,
    totalCount,
    counts,
    summary,
    isLoading,
    activeTab,
    handleTabChange,
    query,
    handleQueryChange,
    page,
    handlePageChange,
    pageSize,
    handlePageSizeChange,
    dateRange,
    setDateRange,
  } = useTransactionsManager();

  const tabItems = useMemo(
    () =>
      TRANSACTION_TABS.map((tab) => ({
        value: tab.value,
        label: tab.label,
        badge: counts[tab.value] ?? counts.all,
      })),
    [counts]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <TransactionHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <TransactionSummaryCards
        summary={summary}
        isLoading={isLoading}
      />

      <div className="space-y-4">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          items={tabItems}
          contentClassName="p-0"
          listClassName="flex-wrap"
          containerClassName="border-b-0"
          addon={<TransactionControls query={query} onQueryChange={handleQueryChange} />}
        >
          <div className="overflow-hidden rounded-xl border border-stroke-divider bg-layer1">
            <TransactionTable
              transactions={transactions}
              isLoading={isLoading}
            />

            <div className="border-t border-stroke-divider bg-layer1 p-3">
              <Pagination
                page={page}
                pageSize={pageSize}
                total={totalCount}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[10, 25, 50]}
              />
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
