import { useQuery } from '@tanstack/react-query';
import { privateApi } from '@/lib/axios';

export const complianceKeys = {
  all: ['compliance'],
  list: (filters) => [...complianceKeys.all, 'list', filters],
};

const fetchComplianceData = async (filters) => {
  const response = await privateApi.get('/mock/compliance.json');
  
  const updatedAt = response.updatedAt;
  const records = response.records;
  
  // Tab/category mapping
  const activeTab = filters.tab || 'kyc';
  let categoryRecords = records[activeTab] || [];
  
  // Dynamic counts for all tabs
  const counts = {
    kyc: records.kyc?.length || 0,
    kraFailed: records.kraFailed?.length || 0,
    nominee: records.nominee?.length || 0,
    uccMismatch: records.uccMismatch?.length || 0,
  };
  
  // Search query filter
  if (filters.query) {
    const q = filters.query.toLowerCase();
    categoryRecords = categoryRecords.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.pan.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.mobile.toLowerCase().includes(q) ||
      r.folio.toLowerCase().includes(q) ||
      r.scheme.toLowerCase().includes(q)
    );
  }
  
  // Basic pagination
  const total = categoryRecords.length;
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const start = (page - 1) * pageSize;
  const paginatedRecords = categoryRecords.slice(start, start + pageSize);
  
  return {
    records: paginatedRecords,
    totalCount: total,
    counts,
    updatedAt
  };
};

export const useComplianceData = (filters) => {
  return useQuery({
    queryKey: complianceKeys.list(filters),
    queryFn: () => fetchComplianceData(filters),
  });
};
