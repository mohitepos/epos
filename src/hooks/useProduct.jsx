// src/hooks/useProduct.js

import { useQuery } from '@tanstack/react-query';
import apiClient from '../utils/axios'; // Import the apiClient instance

// Fetch product data
const fetchProduct = async () => {
  try {
    // Make the API call using apiClient (no need to specify full URL anymore)
    const response = await apiClient.get('/rest/default/V1/U/products?searchCriteria[pageSize]=40');
    console.log("Fetch Product Data", response);

    // Filter out products where visibility is 1 (hidden)
    const visibleProducts = response.data.items.filter(product => product.visibility === 4);

    // Return filtered products
    return { ...response.data, items: visibleProducts };
  } catch (error) {
    // Detailed error handling
    const errorMessage = error?.response?.data?.message || "Error fetching products";
    throw new Error(errorMessage); // Provide a detailed error message
  }
};

// Custom hook to fetch products
const useProduct = () => {
  return useQuery({
    queryKey: ['Products'], // Query key to cache the data
    queryFn: fetchProduct, // The function that fetches data
    staleTime: Infinity, // Prevent refetching by default
    refetchOnWindowFocus: false, // Disable refetching when window is focused
    retry: false, // Disable retries for failed requests
  });
};

export default useProduct;
