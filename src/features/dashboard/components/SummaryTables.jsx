import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';
import { DataTable } from '@/components/ui/Table/Table';

const tableClassName = 'min-w-[720px] bg-layer1';
const containerClassName =
  'overflow-hidden rounded-xl border border-stroke-divider bg-layer1';
const headerClassName =
  'bg-helper border-b border-stroke-divider px-6 py-4 font-medium normal-case tracking-normal text-subheading';
const cellClassName =
  'border-b border-stroke-divider px-6 py-5 text-paragraph';
const rowClassName = 'group hover:bg-table-hover transition-colors';

const loadingCell = (width = 'w-20') => (
  <div className={`h-4 rounded bg-layer2 ${width}`} />
);

const createLoadingRows = (count) =>
  Array.from({ length: count }, (_, index) => ({
    id: `loading-${index}`,
    __loading: true,
  }));

const withColumnStyles = (columns) =>
  columns.map((column) => ({
    ...column,
    headerClassName: `${headerClassName} ${column.headerClassName || ''}`,
    cellClassName: `${cellClassName} ${column.cellClassName || ''}`,
  }));

const TableWrapper = ({ title, subtitle, children, viewAll }) => (
  <Card
    padding="lg"
    className="overflow-hidden"
    title={title}
    subtitle={subtitle}
    headerClassName="mb-4"
    action={viewAll && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="p-0 text-[11px] font-semibold uppercase tracking-wide text-primary hover:bg-transparent hover:text-primary/80"
        >
          View all
        </Button>
      )}
  >
    {children}
  </Card>
);

export const BusinessUpdateTable = ({ data = [], loading }) => {
  const columns = withColumnStyles([
    {
      header: 'Particulars',
      accessorKey: 'particulars',
      cellClassName: 'font-semibold text-subheading',
      cell: ({ row, value }) =>
        row.__loading ? loadingCell('w-24') : value || '-',
    },
    {
      header: 'Debt',
      accessorKey: 'debt',
      cell: ({ row, value }) =>
        row.__loading ? loadingCell('w-16') : value || '-',
    },
    {
      header: 'Equity',
      accessorKey: 'equity',
      cell: ({ row, value }) =>
        row.__loading ? loadingCell('w-16') : value || '-',
    },
    {
      header: 'Hybrid',
      accessorKey: 'hybrid',
      cell: ({ row, value }) =>
        row.__loading ? loadingCell('w-16') : value || '-',
    },
    {
      header: 'Cash',
      accessorKey: 'cash',
      cell: ({ row, value }) =>
        row.__loading ? loadingCell('w-16') : value || '-',
    },
    {
      header: 'Other',
      accessorKey: 'other',
      cell: ({ row, value }) =>
        row.__loading ? loadingCell('w-16') : value || '-',
    },
    {
      header: 'Total',
      accessorKey: 'total',
      cellClassName: 'font-medium text-heading',
      cell: ({ row, value }) =>
        row.__loading ? loadingCell('w-16') : value || '-',
    },
  ]);

  return (
    <TableWrapper title="Business Update" subtitle="- Current Month">
      <DataTable
        columns={columns}
        data={loading ? createLoadingRows(3) : data}
        tableClassName={tableClassName}
        containerClassName={containerClassName}
        rowClassName={loading ? 'animate-pulse' : rowClassName}
      />
    </TableWrapper>
  );
};

export const RMPerformanceTable = ({ data = [], loading }) => {
  const columns = withColumnStyles([
    {
      header: 'RM Name',
      accessorKey: 'name',
      cell: ({ row, value }) =>
        row.__loading ? (
          loadingCell('w-24')
        ) : (
          <div className="flex flex-col">
            <span className="font-semibold text-subheading group-hover:text-primary transition-colors cursor-pointer">
              {value || '-'}
            </span>
            <span className="text-xs font-medium uppercase tracking-wide text-paragraph/70">
              {row.role || ''}
            </span>
          </div>
        ),
    },
    {
      header: 'Client Managed',
      accessorKey: 'clients',
      cellClassName: 'font-semibold',
      cell: ({ row, value }) =>
        row.__loading ? loadingCell('w-20') : (value ?? '-'),
    },
    {
      header: 'AUM (₹ Cr)',
      accessorKey: 'aum',
      cellClassName: 'font-semibold',
      cell: ({ row, value }) =>
        row.__loading ? loadingCell('w-20') : (value ?? '-'),
    },
    {
      header: 'Leads In-progress',
      accessorKey: 'leadsProgress',
      cellClassName: 'font-semibold',
      cell: ({ row, value }) =>
        row.__loading ? loadingCell('w-20') : (value ?? '-'),
    },
    {
      header: 'Leads Closed',
      accessorKey: 'leadsClosed',
      cellClassName: 'font-semibold',
      cell: ({ row, value }) =>
        row.__loading ? loadingCell('w-20') : (value ?? '-'),
    },
  ]);

  return (
    <TableWrapper title="RM Performance" subtitle="(Current Month)" viewAll>
      <DataTable
        columns={columns}
        data={loading ? createLoadingRows(5) : data}
        tableClassName={tableClassName}
        containerClassName={containerClassName}
        rowClassName={loading ? 'animate-pulse' : rowClassName}
      />
    </TableWrapper>
  );
};
