import { useMemo, useState } from 'react';
import { useDebounce } from '@hooks/useDebounce';
import { usePagination } from '@hooks/usePagination';
import { useUniverse } from '../api/universeApi';

export const useUniverseManager = () => {
  const { data, isLoading, error } = useUniverse();
  const funds = useMemo(() => data || [], [data]);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return funds;

    return funds.filter((f) =>
      [f.name, f.subName, f.category].join(' ').toLowerCase().includes(q)
    );
  }, [funds, debouncedQuery]);

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    paginatedData,
    resetPage,
  } = usePagination(filtered);

  const handleQueryChange = (q) => {
    setQuery(q);
    resetPage();
  };

  return {
    funds: paginatedData,
    totalCount: filtered.length,
    isLoading,
    error,
    query,
    handleQueryChange,
    page,
    setPage,
    pageSize,
    handlePageSizeChange: setPageSize,
  };
};
