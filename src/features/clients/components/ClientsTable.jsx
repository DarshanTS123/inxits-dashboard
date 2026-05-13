import { useMemo } from 'react';
import { MoreVertical } from 'lucide-react';

import { DropdownMenuList } from '@components/ui/DropdownMenu/DropdownMenu';
import { DataTable } from '@components/ui/Table/Table';
import { cn } from '@utils/cn';

function statusToDot(status) {
  switch (status) {
    case 'Completed':
      return 'bg-success';
    case 'Pending':
      return 'bg-warning';
    case 'Inactive':
      return 'bg-paragraph/40';
    default:
      return 'bg-info';
  }
}

export const ClientsTable = ({ data, isLoading }) => {
  const columns = useMemo(
    () => [
      {
        id: 'clientName',
        header: 'Client Name',
        accessorKey: 'clientName',
        className: 'min-w-[180px]',
        cellClassName: 'font-semibold text-heading',
      },
      {
        id: 'familyHead',
        header: 'Family Head',
        accessorKey: 'familyHead',
        className: 'min-w-[180px]',
      },
      {
        id: 'invoice',
        header: 'Invoice',
        accessorKey: 'invoice',
        className: 'min-w-[90px]',
      },
      {
        id: 'email',
        header: 'Email ID',
        accessorKey: 'email',
        className: 'min-w-[220px]',
        cellClassName: 'text-paragraph/90',
      },
      {
        id: 'pan',
        header: 'PAN Number',
        accessorKey: 'pan',
        className: 'min-w-[150px]',
        cellClassName: 'font-medium',
      },
      {
        id: 'rm',
        header: 'RM Assigned',
        accessorKey: 'rm',
        className: 'min-w-[170px]',
      },
      {
        id: 'onboardingStatus',
        header: 'Onboarding Status',
        accessorKey: 'onboardingStatus',
        className: 'min-w-[190px]',
        cell: ({ value }) => (
          <div className="flex items-center gap-2">
            <span className={cn('h-2 w-2 rounded-full', statusToDot(value))} />
            <span className="text-sm font-semibold text-paragraph">{value}</span>
          </div>
        ),
      },
      {
        id: 'aum',
        header: 'AUM',
        accessorKey: 'aum',
        className: 'min-w-[80px]',
        cellClassName: 'font-semibold',
      },
      {
        id: 'actions',
        header: '',
        className: 'w-[56px]',
        cellClassName: 'text-right',
        cell: () => (
          <DropdownMenuList
            variant="dark"
            contentClassName="min-w-[144px] p-0"
            itemClassName="rounded-none px-3.5 py-3 first:rounded-t-md last:rounded-b-md [&:not(:first-child)]:border-t [&:not(:first-child)]:border-stroke-divider"
            trigger={
              <button
                type="button"
                aria-label="Row actions"
                className={cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent bg-helper transition',
                  'hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20'
                )}
              >
                <MoreVertical className="h-4 w-4 text-paragraph" />
              </button>
            }
            items={[
              {
                id: 'change-rm',
                label: 'Change RM',
                onSelect: (e) => e.preventDefault(),
              },
              {
                id: 'mark-inactive',
                label: 'Mark Inactive',
                onSelect: (e) => e.preventDefault(),
              },
            ]}
          />
        ),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowKey={(row) => row.id}
      emptyMessage={isLoading ? 'Loading clients...' : 'No clients found.'}
      stickyColumns={{ left: [{ index: 0, width: 180 }], right: [{ index: -1, width: 56 }] }}
    />
  );
};
