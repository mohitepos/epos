// src/utils/api.js

// Helper function to get the API URL based on the environment variable
export const getApiUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL; // Access via import.meta.env
  
    if (!apiUrl) {
      throw new Error("API URL is not defined in environment variables");
    }
  
    return apiUrl; // Return the URL
  };
  