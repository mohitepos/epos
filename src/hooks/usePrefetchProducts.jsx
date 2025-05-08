import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useProduct } from './useProduct'; // Assuming this is the hook to fetch products

const usePrefetchProducts = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch products data for the first two pages using correct query keys
    queryClient.prefetchQuery(['Products', 1, 40], () => useProduct(1, 40)); // Prefetch for page 1
    queryClient.prefetchQuery(['Products', 2, 40], () => useProduct(2, 40)); // Prefetch for page 2
  }, [queryClient]);

  // You can return the first page for display (or return null or undefined if you're just prefetching)
  return useProduct(1, 40); // Fetch data for page 1 (this can be used for the initial page display)
};

export default usePrefetchProducts;
