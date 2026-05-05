import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/react-query';

export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};
