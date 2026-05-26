import { useMemo } from 'react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@components/ui/Button/Button';
import { DropdownMenuList } from '@components/ui/DropdownMenu/DropdownMenu';
import { DataTable } from '@components/ui/Table/Table';
import { formatDate } from '@utils/date';
import { cn } from '@utils/cn';

const formatCreatedOn = (value) =>
  formatDate(value, 'dd MMM, yyyy h:mm aaa');

const formatRmAssignedCount = (row) => {
  if (row.rmType === 'Individual' || row.rmAssignedCount == null) {
    return '-';
  }

  return String(row.rmAssignedCount);
};

export const UserManagementTable = ({ data, isLoading, onEdit }) => {
  const columns = useMemo(
    () => [
      {
        id: 'userName',
        header: 'User Name',
        accessorKey: 'userName',
        cellClassName: 'font-semibold text-heading',
      },
      {
        id: 'userId',
        header: 'User ID',
        accessorKey: 'userId',
        cellClassName: 'text-paragraph/90',
      },
      {
        id: 'rmType',
        header: 'RM Type',
        accessorKey: 'rmType',
      },
      {
        id: 'password',
        header: 'Password',
        accessorKey: 'password',
        cellClassName: 'font-medium text-paragraph',
      },
      {
        id: 'roleAssigned',
        header: 'Role Assigned',
        accessorKey: 'roleAssigned',
      },
      {
        id: 'rmAssignedCount',
        header: 'No. of RM assigned',
        cell: ({ row }) => formatRmAssignedCount(row),
        cellClassName: 'text-center',
        headerClassName: 'text-center',
      },
      {
        id: 'createdByOn',
        header: 'Created by & on',
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-heading">{row.createdBy}</span>
            <span className="text-xs text-paragraph/70">
              {formatCreatedOn(row.createdOn)}
            </span>
          </div>
        ),
      },
      {
        id: 'actions',
        header: '',
        className: 'w-[56px]',
        cellClassName: 'text-right',
        cell: ({ row }) => (
          <DropdownMenuList
            variant="dark"
            contentClassName="min-w-[144px] p-0"
            itemClassName="rounded-none px-3.5 py-3 first:rounded-t-md last:rounded-b-md [&:not(:first-child)]:border-t [&:not(:first-child)]:border-stroke-divider"
            trigger={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Actions for ${row.userName}`}
                className={cn(
                  'h-9 w-9 border border-transparent bg-helper p-0',
                  'hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20'
                )}
              >
                <MoreVertical className="h-4 w-4 text-paragraph" />
              </Button>
            }
            items={[
              {
                id: 'edit',
                label: 'Edit',
                icon: Pencil,
                onSelect: () => onEdit?.(row),
              },
              {
                id: 'delete',
                label: 'Delete',
                icon: Trash2,
                variant: 'destructive',
                onSelect: () => {},
              },
            ]}
          />
        ),
      },
    ],
    [onEdit]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowKey={(row) => row.id}
      emptyMessage={isLoading ? 'Loading users...' : 'No users found.'}
    />
  );
};
