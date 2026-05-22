import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs/Breadcrumbs';
import { Button } from '@/components/ui/Button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { DataTable } from '@/components/ui/Table/Table';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const ALERTS = [
  {
    id: 'alert-1',
    dateTime: '15 Dec, 2024\n11:11 am',
    alert: 'KYC',
    clientName: 'Aarav Mehta',
    rmName: 'Rishabh Utekar',
  },
  {
    id: 'alert-2',
    dateTime: '16 Dec, 2024\n02:30 pm',
    alert: 'UCC',
    clientName: 'Neha Sharma',
    rmName: 'Varun Khanna',
  },
  {
    id: 'alert-3',
    dateTime: '17 Dec, 2024\n09:45 am',
    alert: 'Elog',
    clientName: 'Sita Rao',
    rmName: 'Anil Joshi',
  },
  {
    id: 'alert-4',
    dateTime: '18 Dec, 2024\n01:15 pm',
    alert: 'Mandate',
    clientName: 'Raj Patel',
    rmName: 'Maya Singh',
  },
  {
    id: 'alert-5',
    dateTime: '19 Dec, 2024\n10:00 am',
    alert: 'Transaction',
    clientName: 'Pooja Agarwal',
    rmName: 'Deepak Verma',
  },
  {
    id: 'alert-6',
    dateTime: '20 Dec, 2024\n03:20 pm',
    alert: 'Nominee',
    clientName: 'Karan Desai',
    rmName: 'Aditi Iyer',
  },
  {
    id: 'alert-7',
    dateTime: '21 Dec, 2024\n04:05 pm',
    alert: 'KYC',
    clientName: 'Riya Mehta',
    rmName: 'Vikram Nair',
  },
  {
    id: 'alert-8',
    dateTime: '22 Dec, 2024\n11:30 am',
    alert: 'Mandate',
    clientName: 'Ananya Suresh',
    rmName: 'Kunal Malhotra',
  },
  {
    id: 'alert-9',
    dateTime: '23 Dec, 2024\n12:00 pm',
    alert: 'UCC',
    clientName: 'Sandeep Kaur',
    rmName: 'Neeraj Bansal',
  },
  {
    id: 'alert-10',
    dateTime: '24 Dec, 2024\n02:45 pm',
    alert: 'Elog',
    clientName: 'Ishaan Verma',
    rmName: 'Meera Joshi',
  },
];

const ALERT_ROWS = Array.from({ length: 56 }, (_, index) => {
  const source = ALERTS[index % ALERTS.length];

  return {
    ...source,
    id: `alert-${index + 1}`,
  };
});

export const Alerts = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo(
    () => [
      {
        id: 'dateTime',
        header: 'Date & time',
        accessorKey: 'dateTime',
        className: 'min-w-[220px]',
        cellClassName: 'whitespace-pre-line font-semibold text-paragraph',
      },
      {
        id: 'alert',
        header: 'Alert',
        accessorKey: 'alert',
        className: 'min-w-[220px]',
        cellClassName: 'font-semibold text-paragraph',
      },
      {
        id: 'clientName',
        header: 'Client Name',
        accessorKey: 'clientName',
        className: 'min-w-[220px]',
        cellClassName: 'font-semibold text-paragraph',
      },
      {
        id: 'rmName',
        header: 'RM Name',
        accessorKey: 'rmName',
        className: 'min-w-[220px]',
        cellClassName: 'font-semibold text-paragraph',
      },
    ],
    []
  );

  const visibleRows = useMemo(() => {
    const start = (page - 1) * pageSize;

    return ALERT_ROWS.slice(start, start + pageSize);
  }, [page, pageSize]);

  const handlePageSizeChange = (nextPageSize) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Alerts' },
        ]}
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-heading">Listing (10)</h1>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="border-stroke-divider bg-layer1 text-sm font-medium text-subheading hover:bg-layer2"
            >
              Filters
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              className="border-stroke-divider bg-layer1 text-sm font-medium text-subheading hover:bg-layer2"
            >
              Sort by
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-stroke-divider bg-layer1">
          <DataTable
            columns={columns}
            data={visibleRows}
            getRowKey={(row) => row.id}
            containerClassName="overflow-x-auto"
            tableClassName="[&_th]:h-14 [&_th]:bg-page [&_th]:px-6 [&_th]:font-normal [&_th]:normal-case [&_th]:tracking-normal [&_td]:bg-page [&_td]:px-6 [&_td]:py-4"
          />
          <Pagination
            page={page}
            pageSize={pageSize}
            total={ALERT_ROWS.length}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            className="bg-table-footer px-6 py-3"
          />
        </div>
      </div>
    </div>
  );
};
