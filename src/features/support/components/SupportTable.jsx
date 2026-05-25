import { DataTable } from '@/components/ui/Table/Table';
import { cn } from '@/utils/cn';

export const SupportTable = ({ tickets = [], loading }) => {
  const columns = [
    {
      id: 'id',
      header: 'Ticket ID',
      accessorKey: 'id',
      className: 'min-w-[120px]',
      cellClassName: 'text-paragraph',
    },
    {
      id: 'client',
      header: 'Client Name',
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-heading">{row.client.name}</span>
          <span className="text-xs text-paragraph/60">{row.client.email}</span>
        </div>
      ),
      className: 'min-w-[200px]',
    },
    {
      id: 'requestedOn',
      header: 'Requested on',
      accessorKey: 'requestedOn',
      className: 'min-w-[180px]',
    },
    {
      id: 'reason',
      header: 'Request reason',
      accessorKey: 'reason',
      className: 'min-w-[250px]',
    },
    {
      id: 'assignedRM',
      header: 'Assigned RM',
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-heading">{row.assignedRM.name}</span>
          <span className="text-xs text-paragraph/60">{row.assignedRM.role}</span>
        </div>
      ),
      className: 'min-w-[180px]',
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              row.status === 'Open' ? "bg-info" : "bg-success"
            )}
          />
          <span className="font-semibold text-paragraph">{row.status}</span>
        </div>
      ),
      className: 'min-w-[120px]',
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={tickets}
      getRowKey={(row) => row.id}
      emptyMessage={loading ? 'Loading tickets...' : 'No tickets found.'}
      className="text-[13px]"
    />
  );
};
