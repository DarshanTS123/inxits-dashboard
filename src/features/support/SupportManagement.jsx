import { useState } from 'react';
import { useSupportData } from './api/supportApi';
import { SupportStats } from './components/SupportStats';
import { SupportFilters } from './components/SupportFilters';
import { SupportTable } from './components/SupportTable';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { PageLoader } from '@/components/ui/PageLoader';

export const SupportManagement = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '' });
  const { data, isLoading } = useSupportData(filters);

  if (isLoading && !data) {
    return <PageLoader />;
  }

  const { stats = [], tickets = [], pagination = {} } = data || {};

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (limit) => {
    setFilters((prev) => ({ ...prev, limit: Number(limit), page: 1 }));
  };

  const handleSearch = (search) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
      <SupportStats stats={stats} loading={isLoading} />
      
      <div className="space-y-4">
        <SupportFilters 
          totalTickets={pagination.total || 0} 
          query={filters.search}
          onQueryChange={handleSearch}
        />
        
        <div className="overflow-hidden rounded-xl border border-stroke-divider bg-layer1">
          <SupportTable tickets={tickets} loading={isLoading} />
          
          <div className="border-t border-stroke-divider bg-layer1 p-3">
            <Pagination
              page={filters.page}
              pageSize={filters.limit}
              total={pagination.total || 0}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[5, 10, 25, 50]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
