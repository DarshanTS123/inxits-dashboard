import { useMemo } from 'react';
import { Search } from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs/Tabs';
import { Input } from '@/components/ui/Input/Input';
import { DataTable } from '@/components/ui/Table/Table';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { useComplianceManager } from '../hooks/useComplianceManager';

const COMPLIANCE_TABS = [
  { value: 'kyc', label: 'KYC' },
  { value: 'kraFailed', label: 'KRA Failed' },
  { value: 'nominee', label: 'Nominee' },
  { value: 'uccMismatch', label: 'UCC Communication mismatch' }
];

export const ComplianceReport = () => {
  const {
    records,
    totalCount,
    counts,
    updatedAt,
    isLoading,
    activeTab,
    handleTabChange,
    query,
    handleQueryChange,
    page,
    handlePageChange,
    pageSize,
    handlePageSizeChange,
  } = useComplianceManager();

  const tabItems = useMemo(
    () =>
      COMPLIANCE_TABS.map((tab) => ({
        value: tab.value,
        label: tab.label,
        badge: counts[tab.value] ?? 0,
      })),
    [counts]
  );

  const columns = useMemo(
    () => [
      { id: 'name', accessorKey: 'name', header: 'Name' },
      { id: 'pan', accessorKey: 'pan', header: 'PAN' },
      { id: 'email', accessorKey: 'email', header: 'Email' },
      { id: 'mobile', accessorKey: 'mobile', header: 'Mobile' },
      { id: 'folio', accessorKey: 'folio', header: 'Folio' },
      { id: 'scheme', accessorKey: 'scheme', header: 'Scheme' },
      { id: 'holding', accessorKey: 'holding', header: 'Holding' },
      { id: 'jt1Name', accessorKey: 'jt1Name', header: 'JT1 Name' },
    ],
    []
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-normal text-heading">Missing Information Report</h1>
        <p className="mt-1 text-sm text-paragraph font-light">
          Some mandatory compliance details are missing, such as PAN or Aadhaar. Please review and update to proceed.
        </p>
      </div>

      {/* Tabs Container */}
      <div className="space-y-4">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          items={tabItems}
          contentClassName="p-0"
          listClassName="flex-wrap"
          containerClassName="border-b-0"
        >
          {/* Controls & Search Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex-1 max-w-sm">
              <Input
                placeholder="Search"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                leftIcon={Search}
                size="sm"
                className="w-full"
              />
            </div>
            
            {/* Dynamic update timestamp matching layout */}
            <div className="text-xs text-text-disabled font-normal">
              Data Updated as on:{' '}
              <span className="font-semibold text-text-enabled">Cams</span> :{' '}
              <span className="text-text-enabled">{updatedAt.cams}</span> |{' '}
              <span className="font-semibold text-text-enabled">KFintech</span> :{' '}
              <span className="text-text-enabled">{updatedAt.kfintech}</span>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-xl border border-stroke-divider bg-layer1">
            <DataTable
              columns={columns}
              data={records}
              isLoading={isLoading}
              getRowKey={(row) => row.id}
              emptyMessage="No records matching filter criteria found."
            />

            {/* Pagination Controls */}
            <div className="border-t border-stroke-divider bg-layer1 p-3">
              <Pagination
                page={page}
                pageSize={pageSize}
                total={totalCount}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[10, 25, 50]}
              />
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
