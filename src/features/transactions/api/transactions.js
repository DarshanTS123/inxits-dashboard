import { useQuery } from '@tanstack/react-query';
import { privateApi } from '@/lib/axios';

export const transactionKeys = {
  all: ['transactions'],
  list: (filters) => [...transactionKeys.all, 'list', filters],
};

const fetchTransactions = async (filters) => {
  // In a real app, filters would be passed as query params
  const response = await privateApi.get('/mock/transactions.json');
  
  // Filtering logic for mock data
  let transactions = response.transactions;
  const counts = response.counts;
  const summary = response.summary;

  if (filters.tab && filters.tab !== 'all') {
    const statusMap = {
      'order-placed': 'Order Placed',
      'in-process': 'In process',
      'settled': 'Settled',
      'failed': 'Failed'
    };
    transactions = transactions.filter(t => t.status === statusMap[filters.tab]);
  }

  if (filters.query) {
    const q = filters.query.toLowerCase();
    transactions = transactions.filter(t => 
      t.orderId.toLowerCase().includes(q) ||
      t.clientName.toLowerCase().includes(q) ||
      t.transactionId.toLowerCase().includes(q) ||
      t.scheme.toLowerCase().includes(q)
    );
  }

  // Basic pagination for mock
  const total = transactions.length;
  const start = (filters.page - 1) * filters.pageSize;
  const paginatedTransactions = transactions.slice(start, start + filters.pageSize);

  return {
    transactions: paginatedTransactions,
    totalCount: total,
    counts,
    summary
  };
};

export const useTransactions = (filters) => {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => fetchTransactions(filters),
  });
};
