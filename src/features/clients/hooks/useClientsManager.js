import { useMemo, useState } from 'react';
import { useDebounce } from '@hooks/useDebounce';
import { usePagination } from '@hooks/usePagination';
import { useClients } from '../api/clients';

export const useClientsManager = () => {
  const { data, isLoading, error } = useClients();
  const clients = useMemo(() => data || [], [data]);

  const [activeTab, setActiveTab] = useState('all');
  const [searchColumn, setSearchColumn] = useState('all');
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 300);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const byTab = activeTab === 'all' ? clients : clients.filter((c) => c.state === activeTab);

    if (!q) return byTab;

    const matchers = {
      all: (c) =>
        [
          c.clientName,
          c.familyHead,
          c.email,
          c.pan,
          c.rm,
          c.invoice,
          c.onboardingStatus,
          c.aum,
        ]
          .join(' ')
          .toLowerCase()
          .includes(q),
      clientName: (c) => c.clientName.toLowerCase().includes(q),
      email: (c) => c.email.toLowerCase().includes(q),
      pan: (c) => c.pan.toLowerCase().includes(q),
      rm: (c) => String(c.rm || '').toLowerCase().includes(q),
    };

    const fn = matchers[searchColumn] || matchers.all;
    return byTab.filter(fn);
  }, [activeTab, clients, debouncedQuery, searchColumn]);

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    paginatedData,
    resetPage,
  } = usePagination(filtered);

  const counts = useMemo(() => {
    const all = clients.length;
    const invited = clients.filter((c) => c.state === 'invited').length;
    const ageing = clients.filter((c) => c.state === 'ageing').length;
    const inactive = clients.filter((c) => c.state === 'inactive').length;
    return { all, invited, ageing, inactive };
  }, [clients]);

  const handleTabChange = (v) => {
    setActiveTab(v);
    resetPage();
  };

  const handleQueryChange = (q) => {
    setQuery(q);
    resetPage();
  };

  return {
    clients: paginatedData,
    totalCount: filtered.length,
    counts,
    isLoading,
    error,
    activeTab,
    handleTabChange,
    searchColumn,
    setSearchColumn,
    query,
    handleQueryChange,
    page,
    setPage,
    pageSize,
    handlePageSizeChange: setPageSize,
  };
};
