import { useMemo } from 'react';
import { DataTable } from '@/components/ui/Table/Table';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/date';
import { 
  TRANSACTION_STATUS_COLORS, 
  TRANSACTION_STATUS_DOTS 
} from '../constants/transactionConstants';

export const TransactionTable = ({ transactions, isLoading }) => {
  const columns = useMemo(
    () => [
      {
        header: 'Order ID',
        accessorKey: 'orderId',
        className: 'min-w-[100px]',
        cellClassName: 'font-medium text-heading',
      },
      {
        header: 'Order Date',
        accessorKey: 'orderDate',
        className: 'min-w-[150px]',
        cell: ({ value }) => (
          <div className="flex flex-col">
            <span>{formatDate(value, 'dd MMM, yyyy')}</span>
            <span className="text-xs text-paragraph/50">
              {formatDate(value, 'hh:mm a')}
            </span>
          </div>
        ),
      },
      {
        header: 'Client Name',
        accessorKey: 'clientName',
        className: 'min-w-[180px]',
        cellClassName: 'text-heading',
      },
      {
        header: 'Transaction ID',
        accessorKey: 'transactionId',
        className: 'min-w-[120px]',
      },
      {
        header: 'Scheme',
        accessorKey: 'scheme',
        className: 'min-w-[200px]',
        cell: ({ value }) => <span className="max-w-[200px] truncate block">{value}</span>,
      },
      {
        header: 'Order Type',
        accessorKey: 'orderType',
        className: 'min-w-[100px]',
      },
      {
        header: 'Units',
        accessorKey: 'units',
        className: 'min-w-[100px]',
        cell: ({ value }) => value?.toLocaleString(),
      },
      {
        header: 'Amount (₹)',
        accessorKey: 'amount',
        className: 'min-w-[120px]',
        cell: ({ value }) => (
          <span className="font-medium text-heading">
            {value?.toLocaleString('en-IN')}
          </span>
        ),
      },
      {
        header: 'NAV Date',
        accessorKey: 'navDate',
        className: 'min-w-[120px]',
        cell: ({ value }) => <span>{formatDate(value, 'dd MMM, yyyy')}</span>,
      },
      {
        header: 'Settlement Date',
        accessorKey: 'settlementDate',
        className: 'min-w-[140px]',
        cell: ({ value }) => <span>{formatDate(value, 'dd MMM, yyyy')}</span>,
      },
      {
        header: 'RM',
        accessorKey: 'rm',
        className: 'min-w-[150px]',
      },
      {
        header: 'Status',
        accessorKey: 'status',
        className: 'min-w-[140px]',
        cell: ({ value: status }) => {
          return (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  TRANSACTION_STATUS_DOTS[status] || 'bg-paragraph/40'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium',
                  TRANSACTION_STATUS_COLORS[status] || 'text-paragraph/70'
                )}
              >
                {status}
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={transactions}
      getRowKey={(row) => row.id}
      emptyMessage={isLoading ? 'Loading transactions...' : 'No transactions found.'}
      stickyColumns={{
        left: [
          { index: 0, width: 100 },
          { index: 1, width: 150 },
          { index: 2, width: 180 },
        ],
        right: [{ index: -1, width: 140 }],
      }}
      tableClassName="border-none"
      rowClassName="hover:bg-layer2/50 border-b border-stroke-divider last:border-0"
    />
  );
};
