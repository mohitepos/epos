import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import axios from "axios";  // To make the HTTP request

// Function to fetch admin token dynamically
async function fetchAdminToken() {
  try {
    const response = await axios.post(
      "https://eposdirect.staging-01.eposdirect.net/rest/V1/integration/admin/token",
      {
        username: "EposGuru",    // Use your Magento admin username
        password: "GuruEpos$25@N", // Use your Magento admin password
      }
    );
    return response.data; // The token is in response.data
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://eposdirect.staging-01.eposdirect.net/", // Target your Magento API
        changeOrigin: true,  // Ensure the target domain is changed to match the proxy
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: async (proxy) => {
          // Fetch the token dynamically
          const token = await fetchAdminToken();
          if (token) {
            // Set the Authorization header dynamically if token is available
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("Authorization", `Bearer ${token}`);
            });
          } else {
            console.error("Unable to fetch token.");
          }
        },
      },
    },
  },
});
