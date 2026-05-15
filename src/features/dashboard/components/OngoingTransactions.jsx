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
      cell: ({ value }) => <span className="text-[13px] font-medium text-slate-300">{value || '-'}</span>,
    },
    {
      header: 'Order Date',
      accessorKey: 'orderDate',
      cell: ({ value }) => {
        if (!value) return <span className="text-[12px] text-slate-300">-</span>;
        const parts = value.split(' ');
        return (
          <div className="flex flex-col">
            <span className="text-[12px] text-slate-300">{parts[0]} {parts[1]}</span>
            <span className="text-[10px] text-slate-500">{parts.slice(2).join(' ')}</span>
          </div>
        );
      },
    },
    {
      header: 'Client Name',
      accessorKey: 'clientName',
      cell: ({ value }) => <span className="text-[13px] font-medium text-blue-400 cursor-pointer hover:underline">{value || '-'}</span>,
    },
    {
      header: 'Transaction ID',
      accessorKey: 'transactionId',
      cell: ({ value }) => <span className="text-[12px] text-slate-400">{value || '-'}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ value }) => {
        if (!value) return <span className="text-[12px] text-slate-300">-</span>;
        const getStatusStyles = (status) => {
          switch (status) {
            case 'Settled': return 'text-green-400';
            case 'In progress': return 'text-amber-400';
            case 'Failed': return 'text-red-400';
            case 'Order Placed': return 'text-slate-400';
            case 'Units Allotted': return 'text-cyan-400';
            default: return 'text-slate-400';
          }
        };
        const getDotStyles = (status) => {
          switch (status) {
            case 'Settled': return 'bg-green-400';
            case 'In progress': return 'bg-amber-400';
            case 'Failed': return 'bg-red-400';
            case 'Order Placed': return 'bg-slate-400';
            case 'Units Allotted': return 'bg-cyan-400';
            default: return 'bg-slate-400';
          }
        };

        return (
          <div className="flex items-center gap-2">
            <div className={cn("w-1.5 h-1.5 rounded-full", getDotStyles(value))} />
            <span className={cn("text-[12px] font-medium", getStatusStyles(value))}>{value}</span>
          </div>
        );
      },
    },
    {
      header: 'Scheme',
      accessorKey: 'scheme',
      cell: ({ value }) => <span className="text-[12px] text-slate-300">{value || '-'}</span>,
    },
    {
      header: 'Order Type',
      accessorKey: 'orderType',
      cell: ({ value }) => <span className="text-[12px] text-slate-400">{value || '-'}</span>,
    },
    {
      header: 'Units',
      accessorKey: 'units',
      cell: ({ value }) => <span className="text-[12px] text-slate-300">{value || '-'}</span>,
    },
    {
      header: 'Amount (₹)',
      accessorKey: 'amount',
      cell: ({ value }) => <span className="text-[12px] font-semibold text-slate-200">{value || '-'}</span>,
    },
    {
      header: 'NAV Date',
      accessorKey: 'navDate',
      cell: ({ value }) => <span className="text-[11px] text-slate-500">{value || '-'}</span>,
    },
    {
      header: 'Settlement Date',
      accessorKey: 'settlementDate',
      cell: ({ value }) => <span className="text-[11px] text-slate-500">{value || '-'}</span>,
    },
  ];

  return (
    <Card
      padding="lg"
      className="flex flex-col"
      title="Ongoing transactions (MTD)"
      headerClassName="mb-4"
      contentClassName="flex flex-col gap-4"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="p-0 font-semibold uppercase text-blue-400 hover:bg-transparent hover:text-blue-300"
        >
          View all
        </Button>
      }
    >
      <div className="overflow-hidden rounded-xl border border-slate-800/60">
        {loading ? (
          <div className="p-8 flex flex-col gap-4 animate-pulse">
            <div className="h-10 bg-slate-800 rounded w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-800/50 rounded w-full" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={paginatedData}
            tableClassName="border-none"
            containerClassName="max-h-[500px]"
            rowClassName="hover:bg-slate-800/30 transition-colors border-b border-slate-800/40 last:border-0"
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
