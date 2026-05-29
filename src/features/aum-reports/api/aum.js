import { useQuery } from '@tanstack/react-query';
import { privateApi } from '@/lib/axios';

export const aumKeys = {
  all: ['aum'],
  list: (filters) => [...aumKeys.all, 'list', filters],
};

const fetchAUMData = async (filters) => {
  const response = await privateApi.get('/mock/aum-reports.json');
  
  const updatedAt = response.updatedAt;
  const activeTab = filters.tab || 'amc';
  let categoryRecords = response[activeTab] || [];
  
  // Dynamic counts for all tabs in unfiltered state
  const counts = {
    amc: response.amc?.length || 0,
    scheme: response.scheme?.length || 0,
    client: response.client?.length || 0,
    rm: response.rm?.length || 0,
  };
  
  // 1. Text Search Filter
  if (filters.query) {
    const q = filters.query.toLowerCase();
    categoryRecords = categoryRecords.filter(r => {
      if (activeTab === 'amc') {
        return r.name.toLowerCase().includes(q);
      }
      if (activeTab === 'scheme') {
        return r.name.toLowerCase().includes(q) || r.amcName?.toLowerCase().includes(q);
      }
      if (activeTab === 'client') {
        return r.name.toLowerCase().includes(q) || r.pan?.toLowerCase().includes(q) || r.rmName?.toLowerCase().includes(q);
      }
      if (activeTab === 'rm') {
        return r.name.toLowerCase().includes(q) || r.type?.toLowerCase().includes(q);
      }
      return false;
    });
  }

  // 2. Advanced Filters Modal Application
  if (filters.appliedFilters) {
    const af = filters.appliedFilters;
    
    // Minimum AUM
    if (af.minAUM) {
      categoryRecords = categoryRecords.filter(r => r.total >= Number(af.minAUM));
    }
    // Maximum AUM
    if (af.maxAUM) {
      categoryRecords = categoryRecords.filter(r => r.total <= Number(af.maxAUM));
    }
    // Minimum Allocation
    if (af.minAllocation) {
      categoryRecords = categoryRecords.filter(r => r.allocation >= Number(af.minAllocation));
    }
    // Maximum Allocation
    if (af.maxAllocation) {
      categoryRecords = categoryRecords.filter(r => r.allocation <= Number(af.maxAllocation));
    }
    // Tab-specific filters:
    // RM Type (RM tab only)
    if (activeTab === 'rm' && af.rmType && af.rmType !== 'all') {
      categoryRecords = categoryRecords.filter(r => r.type === af.rmType);
    }
    // AMC Selection (Scheme or Client tab)
    if ((activeTab === 'scheme' || activeTab === 'client') && af.selectedAMCs && af.selectedAMCs.length > 0) {
      categoryRecords = categoryRecords.filter(r => {
        const itemAmc = activeTab === 'scheme' ? r.amcName : (r.name.includes('Mutual Fund') ? r.name : null);
        return af.selectedAMCs.includes(itemAmc) || (activeTab === 'client' && af.selectedAMCs.some(amc => r.name.toLowerCase().includes(amc.toLowerCase())));
      });
    }
  }

  // 3. Dynamic Calculation of Total AUM Row (on all matching/filtered records before pagination)
  const totalRow = {
    id: 'total-aum-row',
    name: 'Total AUM',
    amcName: 'All AMCs',
    pan: '-',
    rmName: '-',
    type: 'All RMs',
    clientCount: categoryRecords.reduce((sum, r) => sum + (r.clientCount || 0), 0),
    equity: categoryRecords.reduce((sum, r) => sum + (r.equity || 0), 0),
    hybrid: categoryRecords.reduce((sum, r) => sum + (r.hybrid || 0), 0),
    arbitrage: categoryRecords.reduce((sum, r) => sum + (r.arbitrage || 0), 0),
    debt: categoryRecords.reduce((sum, r) => sum + (r.debt || 0), 0),
    liquid: categoryRecords.reduce((sum, r) => sum + (r.liquid || 0), 0),
    other: categoryRecords.reduce((sum, r) => sum + (r.other || 0), 0),
    total: categoryRecords.reduce((sum, r) => sum + (r.total || 0), 0),
    allocation: 100, // Normalized to representing 100% total coverage
    isTotal: true,
  };

  // 4. Basic Pagination on filtered results
  const totalNormalCount = categoryRecords.length;
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const start = (page - 1) * pageSize;
  const paginatedRecords = categoryRecords.slice(start, start + pageSize);

  // Prepend the Total AUM summary row as row 0
  const recordsWithTotal = totalNormalCount > 0 ? [totalRow, ...paginatedRecords] : [];

  return {
    records: recordsWithTotal,
    totalNormalCount,
    counts,
    updatedAt,
  };
};

export const useAUMData = (filters) => {
  return useQuery({
    queryKey: aumKeys.list(filters),
    queryFn: () => fetchAUMData(filters),
  });
};
