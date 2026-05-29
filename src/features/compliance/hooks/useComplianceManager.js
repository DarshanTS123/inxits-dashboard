import { useState, useCallback } from 'react';
import { useComplianceData } from '../api/compliance';

export const useComplianceManager = () => {
  const [activeTab, setActiveTab] = useState('kyc');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useComplianceData({
    tab: activeTab,
    query,
    page,
    pageSize,
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
    records: data?.records ?? [],
    totalCount: data?.totalCount ?? 0,
    counts: data?.counts ?? { kyc: 0, kraFailed: 0, nominee: 0, uccMismatch: 0 },
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
  };
};
