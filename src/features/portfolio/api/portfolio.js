import { useQuery } from '@tanstack/react-query';

import { privateApi } from '@/lib/axios';

export const portfolioKeys = {
  all: ['portfolio'],
  overview: () => [...portfolioKeys.all, 'overview'],
};

function normalizePortfolioData(data) {
  const holdings = data?.holdings;
  const items = holdings?.items || [];
  const total = holdings?.total || items.length;

  if (!items.length || items.length >= total) return data;

  return {
    ...data,
    holdings: {
      ...holdings,
      items: Array.from({ length: total }, (_, index) => ({
        ...items[index % items.length],
        id: `holding-${index + 1}`,
      })),
    },
  };
}

export const usePortfolioData = () => {
  return useQuery({
    queryKey: portfolioKeys.overview(),
    queryFn: async () => {
      const response = await privateApi.get('/mock/portfolio.json');
      return normalizePortfolioData(response);
    },
  });
};
