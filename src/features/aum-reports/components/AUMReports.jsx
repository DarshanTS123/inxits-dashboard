import { useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs/Tabs';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { DataTable } from '@/components/ui/Table/Table';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { ChipGroup } from '@/components/ui/Chip/Chip';
import { useAUMManager } from '../hooks/useAUMManager';
import { AUMFilterModal } from './AUMFilterModal';

const AUM_TABS = [
  { value: 'amc', label: 'AMC' },
  { value: 'scheme', label: 'Scheme' },
  { value: 'client', label: 'Client' },
  { value: 'rm', label: 'Relationship Managers' },
];

export const AUMReports = () => {
  const {
    records,
    totalNormalCount,
    counts,
    updatedAt,
    isLoading,
    activeTab,
    handleTabChange,
    query,
    handleQueryChange,
    page,
    handlePageChange,
    pageSize,
    handlePageSizeChange,
    isFilterModalOpen,
    setIsFilterModalOpen,
    appliedFilters,
    handleApplyFilters,
    handleClearFilters,
    isFiltersActive,
    filterChips,
    handleRemoveFilter,
  } = useAUMManager();

  // Create standard data-driven tab items containing current record counts
  const tabItems = useMemo(
    () =>
      AUM_TABS.map((tab) => ({
        value: tab.value,
        label: tab.label,
        badge: counts[tab.value] ?? 0,
      })),
    [counts]
  );

  // Column definitions dynamically adapting based on active tab selection
  const columns = useMemo(() => {
    const currencyCell = ({ value }) => {
      if (value === 0 || value === undefined || value === null) return '0';
      return Number(value).toLocaleString('en-IN');
    };

    const nameHeader = {
      amc: 'AMC Name',
      scheme: 'Scheme Name',
      client: 'Client Name',
      rm: 'RM Name',
    }[activeTab];

    const cols = [
      {
        id: 'name',
        accessorKey: 'name',
        header: nameHeader,
        cellClassName: 'font-medium text-heading whitespace-nowrap',
      },
    ];

    if (activeTab === 'scheme') {
      cols.push({
        id: 'amcName',
        accessorKey: 'amcName',
        header: 'AMC Name',
        cellClassName: 'text-paragraph whitespace-nowrap',
      });
    } else if (activeTab === 'client') {
      cols.push(
        { id: 'pan', accessorKey: 'pan', header: 'PAN', cellClassName: 'text-paragraph font-mono' },
        { id: 'rmName', accessorKey: 'rmName', header: 'Relationship Manager', cellClassName: 'text-paragraph whitespace-nowrap' }
      );
    } else if (activeTab === 'rm') {
      cols.push(
        { id: 'type', accessorKey: 'type', header: 'RM Type', cellClassName: 'text-paragraph' },
        {
          id: 'clientCount',
          accessorKey: 'clientCount',
          header: 'Client Count',
          cell: ({ value, row }) => row.isTotal ? value : value,
          cellClassName: 'text-right font-medium',
          headerClassName: 'text-right',
        }
      );
    }

    cols.push(
      { id: 'equity', accessorKey: 'equity', header: 'Equity(₹)', cell: currencyCell, cellClassName: 'text-right', headerClassName: 'text-right' },
      { id: 'hybrid', accessorKey: 'hybrid', header: 'Hybrid(₹)', cell: currencyCell, cellClassName: 'text-right', headerClassName: 'text-right' },
      { id: 'arbitrage', accessorKey: 'arbitrage', header: 'Arbitrage(₹)', cell: currencyCell, cellClassName: 'text-right', headerClassName: 'text-right' },
      { id: 'debt', accessorKey: 'debt', header: 'Debt(₹)', cell: currencyCell, cellClassName: 'text-right', headerClassName: 'text-right' },
      { id: 'liquid', accessorKey: 'liquid', header: 'Liquid and Ultra Short(₹)', cell: currencyCell, cellClassName: 'text-right', headerClassName: 'text-right' },
      { id: 'other', accessorKey: 'other', header: 'Other(₹)', cell: currencyCell, cellClassName: 'text-right', headerClassName: 'text-right' },
      { id: 'total', accessorKey: 'total', header: 'Total(₹)', cell: currencyCell, cellClassName: 'text-right font-bold text-heading', headerClassName: 'text-right' },
      { id: 'allocation', accessorKey: 'allocation', header: 'Allocation(%)', cell: ({ value }) => `${value}%`, cellClassName: 'text-right', headerClassName: 'text-right' }
    );

    return cols;
  }, [activeTab]);

  const listHeader = {
    amc: 'List of AMC',
    scheme: 'List of Schemes',
    client: 'List of Clients',
    rm: 'List of Relationship Managers',
  }[activeTab];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Tabs Layout */}
      <div className="space-y-4">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          items={tabItems}
          contentClassName="p-0"
          listClassName="flex-wrap"
          containerClassName="border-b-0"
        >
          {/* Controls & Search Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-lg font-medium text-heading">{listHeader}</h2>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:w-64 max-w-sm">
                <Input
                  placeholder="Search"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  leftIcon={Search}
                  size="sm"
                  className="w-full"
                />
              </div>

              <Button
                variant="outline"
                size="md"
                leftIcon={SlidersHorizontal}
                onClick={() => setIsFilterModalOpen(true)}
                className={isFiltersActive ? 'border-primary text-primary hover:bg-primary/10' : 'border-stroke-divider'}
              >
                Filters
              </Button>

              {isFiltersActive && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="shrink-0 text-xs font-semibold uppercase tracking-wide text-primary hover:text-primary/80"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Applied Filter Chips Group */}
          {isFiltersActive && (
            <div className="flex flex-wrap items-center gap-2 mb-4 bg-layer1 border border-stroke-divider rounded-lg p-2 animate-in slide-in-from-top-1 duration-200">
              <span className="text-xs text-text-disabled uppercase tracking-wide font-semibold mr-1">Applied:</span>
              <ChipGroup items={filterChips} onRemove={handleRemoveFilter} />
            </div>
          )}

          {/* Table Container */}
          <div className="overflow-hidden rounded-xl border border-stroke-divider bg-layer1 shadow-lg">
            <DataTable
              columns={columns}
              data={records}
              isLoading={isLoading}
              getRowKey={(row) => row.id}
              rowClassName={(row) =>
                row.isTotal
                  ? 'font-bold bg-layer2/80 border-b-2 border-stroke-divider text-heading hover:bg-layer2'
                  : 'hover:bg-table-hover'
              }
              emptyMessage="No asset records matching search criteria or filters found."
            />

            {/* Pagination Controls */}
            {totalNormalCount > 0 && (
              <div className="border-t border-stroke-divider bg-layer1 p-3">
                <Pagination
                  page={page}
                  pageSize={pageSize}
                  total={totalNormalCount}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  pageSizeOptions={[10, 25, 50]}
                />
              </div>
            )}
          </div>
        </Tabs>
      </div>

      {/* Advanced Filters Overlay Modal */}
      {/* key={String(isFilterModalOpen)} remounts the modal on open so
          useState(appliedFilters) re-initialises from props cleanly. */}
      <AUMFilterModal
        key={String(isFilterModalOpen)}
        open={isFilterModalOpen}
        onOpenChange={setIsFilterModalOpen}
        activeTab={activeTab}
        appliedFilters={appliedFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
    </div>
  );
};
