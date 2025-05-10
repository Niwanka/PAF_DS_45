import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    define: {
      "import.meta.env.VITE_GEMINI_API_KEY": JSON.stringify(
        env.VITE_GEMINI_API_KEY
      ),
    },
    server: {
      host: true,
      port: 3000,
      // Proxy API requests starting with "/api" to the backend server at http://localhost:9090.
      // Helps avoid CORS issues during local development. 
      proxy: {
        "/api": {
          target: "http://localhost:9090",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
