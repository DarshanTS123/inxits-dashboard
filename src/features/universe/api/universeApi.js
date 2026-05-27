import { useQuery } from '@tanstack/react-query';
import { privateApi } from '@lib/axios';

const fetchUniverse = async () => {
  return privateApi.get('/mock/universe.json');
};

export const useUniverse = () => {
  return useQuery({
    queryKey: ['universe'],
    queryFn: fetchUniverse,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
