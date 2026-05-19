import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';
import { DataTable } from '@/components/ui/Table/Table';

const tableClassName = 'min-w-[720px] bg-[#171c2f]';
const containerClassName =
  'overflow-hidden rounded-xl border border-slate-600/70 bg-[#171c2f]';
const headerClassName =
  'bg-[#1a2033] border-b border-slate-600/70 px-6 py-4 text-[13px] font-medium normal-case tracking-normal text-slate-300';
const cellClassName =
  'border-b border-slate-600/60 px-6 py-5 text-slate-400';
const rowClassName = 'group hover:bg-slate-800/30 transition-colors';

const loadingCell = (width = 'w-20') => (
  <div className={`h-4 rounded bg-slate-800 ${width}`} />
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
          className="p-0 font-semibold uppercase text-blue-400 hover:bg-transparent hover:text-blue-300"
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
      cellClassName: 'font-semibold text-slate-300',
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
      cellClassName: 'font-medium text-slate-200',
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
            <span className="font-semibold text-slate-300 group-hover:text-blue-400 transition-colors cursor-pointer">
              {value || '-'}
            </span>
            <span className="text-[12px] text-slate-500 font-medium uppercase tracking-tighter">
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
