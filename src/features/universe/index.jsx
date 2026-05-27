import { useMemo, useState } from 'react';
import { Pagination } from '@components/ui/Pagination/Pagination';
import { UniverseHeader } from './components/UniverseHeader';
import { UniverseTable } from './components/UniverseTable';
import { UniverseFiltersModal } from './components/UniverseFiltersModal';
import { useUniverseManager } from './hooks/useUniverseManager';
import {
  DEFAULT_FILTERS,
  getFilterChips,
  isDefaultFilters,
  removeFilterChip,
} from './utils/universeFilters';

export const Universe = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const filterChips = useMemo(
    () => (isDefaultFilters(appliedFilters) ? [] : getFilterChips(appliedFilters)),
    [appliedFilters]
  );
  const showClearAll = !isDefaultFilters(appliedFilters);
  const {
    funds,
    totalCount,
    isLoading,
    query,
    handleQueryChange,
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
  } = useUniverseManager();

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <UniverseHeader
        query={query}
        onQueryChange={handleQueryChange}
        onOpenFilters={() => setIsFiltersOpen(true)}
        lastUpdated="19 Sept 2025"
        filterChips={filterChips}
        showClearAll={showClearAll}
        onRemoveFilter={(chip) =>
          setAppliedFilters((prev) => removeFilterChip(prev, chip))
        }
        onClearFilters={() => setAppliedFilters(DEFAULT_FILTERS)}
      />

      <div className="overflow-hidden rounded-xl border border-stroke-divider bg-layer1">
        <UniverseTable data={funds} isLoading={isLoading} />

        <div className="border-t border-stroke-divider bg-layer1 p-3">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={totalCount}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[5, 10, 25, 50, 100]}
          />
        </div>
      </div>

      <UniverseFiltersModal
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        appliedFilters={appliedFilters}
        onApply={setAppliedFilters}
        onClear={() => setAppliedFilters(DEFAULT_FILTERS)}
      />
    </div>
  );
};
