// src/hooks/useCategories.js

import { useQuery } from "@tanstack/react-query"; // React Query v5
import axios from "axios";

// Fetch categories function
const fetchCategories = async () => {
  try {
    // Use the relative URL here because Vite will proxy it to the correct server
    const response = await axios.get('/api/rest/default/V1/U/categories');
    console.log(response);
    return response.data; // Return the fetched categories data
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error('Error fetching categories');
  }
};

const useCategories = () => {
  return useQuery({
    queryKey: ["categories"], // Query key
    queryFn: fetchCategories, // Fetch function
    staleTime: Infinity, // Prevent automatic refetching
    refetchOnWindowFocus: false, // Do not refetch when window is focused
    retry: false, 
  });
};

export default useCategories;
