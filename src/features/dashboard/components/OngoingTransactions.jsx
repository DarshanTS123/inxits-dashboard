import React from 'react';
import { Button } from '@/components/ui/Button/Button';
import { DataTable } from '@/components/ui/Table/Table';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Card } from '@/components/ui/Card/Card';
import { cn } from '@/utils/cn';
import { usePagination } from '@/hooks/usePagination';

export const OngoingTransactions = ({ data, loading }) => {
  const transactions = React.useMemo(() => data?.items || [], [data]);
  const total = data?.total || 0;

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    paginatedData,
  } = usePagination(transactions);

  const columns = [
    {
      header: 'Order ID',
      accessorKey: 'orderId',
      className: 'min-w-[120px]',
      cell: ({ value }) => <span className="font-medium text-subheading">{value || '-'}</span>,
    },
    {
      header: 'Order Date',
      accessorKey: 'orderDate',
      className: 'min-w-[170px]',
      cell: ({ value }) => {
        if (!value) return <span className="text-[12px] text-subheading">-</span>;
        const parts = value.split(' ');
        return (
          <div className="flex flex-col">
            <span className="text-subheading">{parts[0]} {parts[1]}</span>
            <span className="text-[12px] text-paragraph/70">{parts.slice(2).join(' ')}</span>
          </div>
        );
      },
    },
    {
      header: 'Client Name',
      accessorKey: 'clientName',
      className: 'min-w-[160px]',
      cell: ({ value }) => <span className="font-medium text-primary cursor-pointer hover:underline">{value || '-'}</span>,
    },
    {
      header: 'Transaction ID',
      accessorKey: 'transactionId',
      cell: ({ value }) => <span className="text-paragraph">{value || '-'}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ value }) => {
        if (!value) return <span className="text-[12px] text-subheading">-</span>;
        const getStatusStyles = (status) => {
          switch (status) {
            case 'Settled': return 'text-success';
            case 'In progress': return 'text-warning';
            case 'Failed': return 'text-error';
            case 'Order Placed': return 'text-paragraph';
            case 'Units Allotted': return 'text-info';
            default: return 'text-paragraph';
          }
        };
        const getDotStyles = (status) => {
          switch (status) {
            case 'Settled': return 'bg-success';
            case 'In progress': return 'bg-warning';
            case 'Failed': return 'bg-error';
            case 'Order Placed': return 'bg-paragraph/60';
            case 'Units Allotted': return 'bg-info';
            default: return 'bg-paragraph/60';
          }
        };

        return (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className={cn("w-1.5 h-1.5 rounded-full", getDotStyles(value))} />
            <span className={cn("font-medium", getStatusStyles(value))}>{value}</span>
          </div>
        );
      },
    },
    {
      header: 'Scheme',
      accessorKey: 'scheme',
      cell: ({ value }) => <span className="text-subheading whitespace-nowrap">{value || '-'}</span>,
    },
    {
      header: 'Order Type',
      accessorKey: 'orderType',
      cell: ({ value }) => <span className="text-paragraph">{value || '-'}</span>,
    },
    {
      header: 'Units',
      accessorKey: 'units',
      cell: ({ value }) => <span className="text-subheading">{value || '-'}</span>,
    },
    {
      header: 'Amount (₹)',
      accessorKey: 'amount',
      cell: ({ value }) => <span className="font-semibold text-heading">{value || '-'}</span>,
    },
    {
      header: 'NAV Date',
      accessorKey: 'navDate',
      cell: ({ value }) => <span className="text-paragraph/70 whitespace-nowrap">{value || '-'}</span>,
    },
    {
      header: 'Settlement Date',
      accessorKey: 'settlementDate',
      cell: ({ value }) => <span className="text-paragraph/70">{value || '-'}</span>,
    },
    {
      header: 'RM',
      accessorKey: 'rm',
      className: 'min-w-[160px]',
      cell: ({ value }) => <span className="text-subheading">{value || '-'}</span>,
    },
  ];

  return (
    <Card
      padding="lg"
      className="flex flex-col"
      title="Ongoing transactions (MTD)"
      headerClassName="mb-3"
      contentClassName="flex flex-col gap-3"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="p-0 font-semibold uppercase text-primary hover:bg-transparent hover:text-primary/80"
        >
          View all
        </Button>
      }
    >
      <div className="overflow-hidden rounded-xl border border-stroke-divider">
        {loading ? (
          <div className="p-8 flex flex-col gap-4 animate-pulse">
            <div className="h-10 bg-layer2 rounded w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-layer2/50 rounded w-full" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={paginatedData}
            stickyColumns={{ left: [{ index: 0, width: 120 }, { index: 1, width: 170 }, { index: 2, width: 160 }] }}
            tableClassName="border-none"
            containerClassName="max-h-[500px]"
            rowClassName="hover:bg-table-hover transition-colors border-b border-stroke-divider last:border-0"
            />
        )}
      </div>

      <div className="mt-2">
        <Pagination 
          page={page} 
          total={total || transactions.length} 
          pageSize={pageSize} 
          onPageChange={setPage} 
          onPageSizeChange={setPageSize}
        />
      </div>
    </Card>
  );
};
