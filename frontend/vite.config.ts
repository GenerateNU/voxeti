import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4000,
  },
  test: {
    include: ["unit-tests/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
