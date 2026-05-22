import { Pagination } from '@/components/ui/Pagination/Pagination';
import { DataTable } from '@/components/ui/Table/Table';
import { cn } from '@/utils/cn';

const statusClass = {
  BUY: 'text-success',
  SELL: 'text-error',
  HOLD: 'text-warning',
};

const holdingsColumns = [
  {
    accessorKey: 'name',
    header: 'Scheme Name',
    cell: ({ row }) => (
      <div className="min-w-[190px]">
        <p className="text-base font-normal text-heading">{row.name}</p>
        <span
          className={cn(
            'text-xs font-semibold uppercase',
            statusClass[row.status]
          )}
        >
          {row.status}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'rating',
    header: 'Inxits rating',
    cellType: 'rating',
  },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'clients', header: 'No. of Clients' },
  { accessorKey: 'units', header: 'Units' },
  { accessorKey: 'avgCost', header: 'Avg Cost (₹)' },
  { accessorKey: 'current', header: 'Current Value' },
  { accessorKey: 'gain', header: 'Gain/Loss' },
  { accessorKey: 'weight', header: 'Weight %' },
];

export function PortfolioHoldingsTable({
  holdings,
  page,
  pageSize,
  total,
  loading = false,
  onPageChange,
  onPageSizeChange,
}) {
  const tableData = loading ? [] : holdings;

  return (
    <>
      <DataTable
        columns={holdingsColumns}
        data={tableData}
        emptyMessage={loading ? 'Loading holdings...' : 'No holdings found.'}
        containerClassName="rounded-t-lg"
        tableClassName="min-w-[1180px]"
        rowClassName="[&_td]:bg-page"
      />
      <div className="border-t border-stroke-divider bg-table-footer p-3">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          pageSizeOptions={[5, 10, 25, 50]}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </>
  );
}
