import { useQuery } from '@tanstack/react-query';
import { privateApi } from '@lib/axios';

// Simulated API fetcher
const fetchClients = async () => {
  return privateApi.get('/mock/clients.json');
};

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
