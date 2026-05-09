import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: import.meta.env.MODE === 'test' ? false : 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
