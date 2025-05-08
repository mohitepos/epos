// src/utils/axios.js

import axios from 'axios';
import { getApiUrl } from './api'; // Import the getApiUrl function

// Create a custom Axios instance
const apiClient = axios.create({
  baseURL: getApiUrl(), // Set base URL dynamically from environment variable
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient; // Export the custom Axios instance
