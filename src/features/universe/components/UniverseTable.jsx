import { useMemo } from 'react';
import { StarRating } from '@components/ui/StarRating/StarRating';
import { DataTable } from '@components/ui/Table/Table';
import mstarLogo from '@/assets/mstar_logo.svg';

export const UniverseTable = ({ data, isLoading }) => {
  const columns = useMemo(
    () => [
      {
        id: 'particulars',
        header: 'Particulars',
        accessorKey: 'name',
        className: 'min-w-[300px]',
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="font-semibold text-heading">{row.name}</span>
            <div className="flex items-center gap-1 text-xs text-paragraph">
              <span>{row.subName}</span>
              <span className="text-paragraph/40">•</span>
              <span>{row.category}</span>
            </div>
          </div>
        ),
      },
      {
        id: 'rating',
        header: () => (
          <div className="flex items-center gap-1.5">
            <img src={mstarLogo} alt="Morningstar" className="h-5 w-auto shrink-0" />
            <span>Ratings</span>
          </div>
        ),
        accessorKey: 'rating',
        className: 'min-w-[150px]',
        headerClassName: 'normal-case',
        cell: ({ value }) => <StarRating value={value} />,
      },
      {
        id: 'fundSize',
        header: 'Fund Size',
        accessorKey: 'fundSize',
        className: 'min-w-[120px]',
        cellClassName: 'text-heading font-medium',
      },
      {
        id: 'returns1Y',
        header: '1Y Returns',
        accessorKey: 'returns1Y',
        className: 'min-w-[100px]',
        cellClassName: 'text-right pr-4',
        headerClassName: 'text-right pr-4',
      },
      {
        id: 'returns3Y',
        header: '3Y Returns',
        accessorKey: 'returns3Y',
        className: 'min-w-[100px]',
        cellClassName: 'text-right pr-4',
        headerClassName: 'text-right pr-4',
      },
      {
        id: 'returns5Y',
        header: '5Y Returns',
        accessorKey: 'returns5Y',
        className: 'min-w-[100px]',
        cellClassName: 'text-right pr-4',
        headerClassName: 'text-right pr-4',
      },
      {
        id: 'returns10Y',
        header: '10Y Returns',
        accessorKey: 'returns10Y',
        className: 'min-w-[100px]',
        cellClassName: 'text-right pr-4',
        headerClassName: 'text-right pr-4',
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowKey={(row) => row.id}
      emptyMessage={isLoading ? 'Loading universe...' : 'No funds found.'}
    />
  );
};
