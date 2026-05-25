import { useState, useCallback } from 'react';
import { useTransactions } from '../api/transactions';

export const useTransactionsManager = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 9, 1),
    to: new Date(2025, 9, 25),
  });

  const { data, isLoading } = useTransactions({
    tab: activeTab,
    query,
    page,
    pageSize,
    dateRange,
  });

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setPage(1);
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

  return {
    transactions: data?.transactions ?? [],
    totalCount: data?.totalCount ?? 0,
    counts: data?.counts ?? {},
    summary: data?.summary ?? {},
    isLoading,
    activeTab,
    handleTabChange,
    query,
    handleQueryChange,
    page,
    handlePageChange,
    pageSize,
    handlePageSizeChange,
    dateRange,
    setDateRange,
  };
};
