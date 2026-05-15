import { useQuery } from '@tanstack/react-query';
import { privateApi } from '@/lib/axios';

export const dashboardKeys = {
  all: ['dashboard'],
  stats: () => [...dashboardKeys.all, 'stats'],
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: dashboardKeys.all,
    queryFn: async () => {
      const response = await privateApi.get('/mock/dashboard.json');
      return response;
    },
  });
};
