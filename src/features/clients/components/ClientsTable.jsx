import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, UserIcon } from 'lucide-react';

import { Button } from '@components/ui/Button/Button';
import { Modal } from '@components/ui/Modal/Modal';
import { DropdownMenuList } from '@components/ui/DropdownMenu/DropdownMenu';
import { DataTable } from '@components/ui/Table/Table';
import { Select } from '@components/ui/Select/Select';
import { cn } from '@utils/cn';

const RM_OPTIONS = [
  { label: 'Select rm', value: 'unassigned' },
  { label: 'Aarav Shah', value: 'aarav-shah' },
  { label: 'Kavya Mehta', value: 'kavya-mehta' },
  { label: 'Rohan Iyer', value: 'rohan-iyer' },
];

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
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <span className="font-semibold text-paragraph">{value}</span>
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Row actions"
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
                id: 'change-rm',
                label: 'Change RM',
                onSelect: (e) => { e.preventDefault(); setIsModalOpen(true); },
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
    <>
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(row) => row.id}
        emptyMessage={isLoading ? 'Loading clients...' : 'No clients found.'}
        stickyColumns={{ left: [{ index: 0, width: 180 }], right: [{ index: -1, width: 56 }] }}
        onRowClick={(row) => navigate(`/clients/${row.id}`)}
      />
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <div className="flex flex-col gap-6 p-2">
  {/* Title with user icon */}
  <div className="flex items-center gap-3">
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-900/40">
      <UserIcon className="h-6 w-6 text-primary" />
    </span>
    <h3 className="text-xl font-bold text-heading">Change RM</h3>
  </div>

  {/* Select RM dropdown */}
  <div className="flex flex-col gap-2">
    <label htmlFor="rm-select" className="text-sm font-medium text-paragraph">
      Select RM<span className="text-error">*</span>
    </label>
    <Select
      id="rm-select"
      placeholder="Select RM"
      options={RM_OPTIONS}
      triggerClassName="h-12 w-full rounded-xl bg-transparent text-sm border border-stroke-divider"
    />
  </div>

  {/* Reason for change dropdown */}
  <div className="flex flex-col gap-2">
    <label htmlFor="reason-select" className="text-sm font-medium text-paragraph">
      Reason for change<span className="text-error">*</span>
    </label>
    <Select
      id="reason-select"
      placeholder="Select Reason"
      options={[
        { label: 'On Notice Period', value: 'on-notice-period' },
        { label: 'Resigned', value: 'resigned' },
        { label: 'Performance Issue', value: 'performance-issue' },
        { label: 'Client Request', value: 'client-request' },
        { label: 'Other', value: 'other' },
      ]}
      triggerClassName="h-12 w-full rounded-xl bg-transparent text-sm border border-stroke-divider"
    />
  </div>

  {/* Change RM button */}
  <Button className="self-start mt-1 rounded-lg px-6 py-2.5" onClick={() => {
    // TODO: implement change RM logic
    setIsModalOpen(false);
  }}>
    Change RM
  </Button>
</div>
      </Modal>
    </>
  );

};
