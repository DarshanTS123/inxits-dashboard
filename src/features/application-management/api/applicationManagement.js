import { useQuery } from '@tanstack/react-query';
import { privateApi } from '@/lib/axios';

export const applicationManagementKeys = {
  all: ['application-management'],
};

export const useApplicationManagementData = () => {
  return useQuery({
    queryKey: applicationManagementKeys.all,
    queryFn: async () => {
      const response = await privateApi.get('/mock/application-management.json');
      return response;
    },
  });
};
