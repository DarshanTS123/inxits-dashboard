import { useMemo, useState } from 'react';

import { useDebounce } from '@hooks/useDebounce';
import { usePagination } from '@hooks/usePagination';

import { useUsers } from '../api/userManagement';

const DEFAULT_PAGE_SIZE = 8;

export const useUserManagement = () => {
  const { data, isLoading, error, refetch } = useUsers();
  const users = useMemo(() => data || [], [data]);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return users;

    return users.filter((user) =>
      [
        user.userName,
        user.userId,
        user.rmType,
        user.roleAssigned,
        user.createdBy,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [debouncedQuery, users]);

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    paginatedData,
    resetPage,
  } = usePagination(filtered, DEFAULT_PAGE_SIZE);

  const handleQueryChange = (nextQuery) => {
    setQuery(nextQuery);
    resetPage();
  };

  return {
    users: paginatedData,
    totalCount: filtered.length,
    isLoading,
    error,
    refetch,
    query,
    handleQueryChange,
    page,
    setPage,
    pageSize,
    handlePageSizeChange: setPageSize,
  };
};
