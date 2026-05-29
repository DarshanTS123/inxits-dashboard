import { useState, useCallback, useMemo } from 'react';
import { useAUMData } from '../api/aum';

const DEFAULT_FILTERS = {
  minAUM: '',
  maxAUM: '',
  minAllocation: '',
  maxAllocation: '',
  rmType: 'all',
  selectedAMCs: [],
};

export const useAUMManager = () => {
  const [activeTab, setActiveTab] = useState('amc');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  const queryParams = useMemo(() => ({
    tab: activeTab,
    query,
    page,
    pageSize,
    appliedFilters,
  }), [activeTab, query, page, pageSize, appliedFilters]);

  const { data, isLoading } = useAUMData(queryParams);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setPage(1);
    setQuery('');
    setAppliedFilters(DEFAULT_FILTERS);
  }, []);

  const handleQueryChange = useCallback((q) => {
    setQuery(q);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p) => {
    setPage(p);
  }, []);

  const handlePageSizeChange = useCallback((s) => {
    setPageSize(s);
    setPage(1);
  }, []);

  const handleApplyFilters = useCallback((filters) => {
    setAppliedFilters(filters);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  // Compute if filters are currently active (non-default state)
  const isFiltersActive = useMemo(() => {
    return (
      appliedFilters.minAUM !== '' ||
      appliedFilters.maxAUM !== '' ||
      appliedFilters.minAllocation !== '' ||
      appliedFilters.maxAllocation !== '' ||
      appliedFilters.rmType !== 'all' ||
      appliedFilters.selectedAMCs.length > 0
    );
  }, [appliedFilters]);

  // Compute filter chips for UI presentational dismiss pills
  const filterChips = useMemo(() => {
    const chips = [];
    if (appliedFilters.minAUM) {
      chips.push({ id: 'minAUM', label: `Min AUM: ₹${Number(appliedFilters.minAUM).toLocaleString('en-IN')}`, filterKey: 'minAUM' });
    }
    if (appliedFilters.maxAUM) {
      chips.push({ id: 'maxAUM', label: `Max AUM: ₹${Number(appliedFilters.maxAUM).toLocaleString('en-IN')}`, filterKey: 'maxAUM' });
    }
    if (appliedFilters.minAllocation) {
      chips.push({ id: 'minAllocation', label: `Min Allocation: ${appliedFilters.minAllocation}%`, filterKey: 'minAllocation' });
    }
    if (appliedFilters.maxAllocation) {
      chips.push({ id: 'maxAllocation', label: `Max Allocation: ${appliedFilters.maxAllocation}%`, filterKey: 'maxAllocation' });
    }
    if (appliedFilters.rmType !== 'all') {
      chips.push({ id: 'rmType', label: `RM: ${appliedFilters.rmType}`, filterKey: 'rmType' });
    }
    if (appliedFilters.selectedAMCs.length > 0) {
      appliedFilters.selectedAMCs.forEach(amc => {
        chips.push({ id: `amc-${amc}`, label: amc, filterKey: 'selectedAMCs', value: amc });
      });
    }
    return chips;
  }, [appliedFilters]);

  const handleRemoveFilter = useCallback((chip) => {
    setAppliedFilters((prev) => {
      const next = { ...prev };
      if (chip.filterKey === 'selectedAMCs') {
        next.selectedAMCs = prev.selectedAMCs.filter(item => item !== chip.value);
      } else if (chip.filterKey === 'rmType') {
        next.rmType = 'all';
      } else {
        next[chip.filterKey] = '';
      }
      return next;
    });
    setPage(1);
  }, []);

  return {
    records: data?.records ?? [],
    totalNormalCount: data?.totalNormalCount ?? 0,
    counts: data?.counts ?? { amc: 0, scheme: 0, client: 0, rm: 0 },
    updatedAt: data?.updatedAt ?? { cams: '-', kfintech: '-' },
    isLoading,
    activeTab,
    handleTabChange,
    query,
    handleQueryChange,
    page,
    handlePageChange,
    pageSize,
    handlePageSizeChange,
    isFilterModalOpen,
    setIsFilterModalOpen,
    appliedFilters,
    handleApplyFilters,
    handleClearFilters,
    isFiltersActive,
    filterChips,
    handleRemoveFilter,
  };
};
