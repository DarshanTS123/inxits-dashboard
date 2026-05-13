import { useMemo, useState } from 'react';
import { useClients } from '../api/clients';

export const useClientsManager = () => {
  const { data, isLoading, error } = useClients();
  const clients = useMemo(() => data || [], [data]);

  const [activeTab, setActiveTab] = useState('all');
  const [searchColumn, setSearchColumn] = useState('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
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
  }, [activeTab, clients, query, searchColumn]);

  const counts = useMemo(() => {
    const all = clients.length;
    const invited = clients.filter((c) => c.state === 'invited').length;
    const ageing = clients.filter((c) => c.state === 'ageing').length;
    const inactive = clients.filter((c) => c.state === 'inactive').length;
    return { all, invited, ageing, inactive };
  }, [clients]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const startIdx = (safePage - 1) * pageSize;
  const pageRows = filtered.slice(startIdx, startIdx + pageSize);

  const handleTabChange = (v) => {
    setActiveTab(v);
    setPage(1);
  };

  const handlePageSizeChange = (n) => {
    setPageSize(n);
    setPage(1);
  };

  const handleQueryChange = (q) => {
    setQuery(q);
    setPage(1);
  };

  return {
    clients: pageRows,
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
    page: safePage,
    setPage,
    pageSize,
    handlePageSizeChange,
  };
};
