// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import axios from "axios";

async function fetchAdminToken() {
  try {
    const response = await axios.post(
      "http://aws.magento.com/rest/V1/integration/admin/token",
      {
        username: "Admin",
        password: "Admin@123",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching token:", error.message);
    return null;
  }
}

export default defineConfig(async () => {
  const token = await fetchAdminToken();

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: "http://aws.magento.com/",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (token) {
                proxyReq.setHeader("Authorization", `Bearer ${token}`);
              } else {
                console.warn("No admin token set — requests may fail.");
              }
            });
          },
        },
      },
    },
  };
});
