// src/hooks/useProductBySku.js
import { useQuery } from '@tanstack/react-query';
import apiClient from '../utils/axios'; // Import apiClient for centralized API management

// Function to fetch the product by SKU
const fetchProductBySku = async (sku) => {
  try {
    // Use apiClient for the request
    const response = await apiClient.get(`/rest/V1/U/products/${sku}`);

    // Check if the response is of type JSON
    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Expected JSON response, but received:', response.data);
      throw new Error('Invalid response type. Expected JSON.');
    }

    return response.data; // Return product data from the response
  } catch (error) {
    // Log and throw more descriptive error
    console.error('Error fetching product details:', error);
    throw new Error('Error fetching product details: ' + error.message);
  }
};

// Custom hook to use product data
const useProductBySku = (sku) => {
  return useQuery({
    queryKey: ['product', sku], // Query key to identify product data
    queryFn: () => fetchProductBySku(sku), // Fetch function using SKU
    staleTime: 600000, // Cache the data for 10 minutes
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    retry: 1, // Retry failed requests once
    onError: (error) => {
      console.error('Error in useProductBySku:', error.message);
    },
  });
};

export default useProductBySku;
