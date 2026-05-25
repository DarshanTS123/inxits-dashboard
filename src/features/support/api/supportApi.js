import { useQuery } from '@tanstack/react-query';
import { privateApi } from '@/lib/axios';

export const supportKeys = {
  all: ['support'],
  stats: () => [...supportKeys.all, 'stats'],
  tickets: (filters) => [...supportKeys.all, 'tickets', filters],
};

export const fetchSupportData = async () => {
  const response = await privateApi.get('/mock/support.json');
  return response;
};

export const useSupportData = (filters = {}) => {
  return useQuery({
    queryKey: supportKeys.tickets(filters),
    queryFn: fetchSupportData,
  });
};
