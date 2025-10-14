import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  base: "/",
  plugins: [react(), tailwind()],
  build: {
    outDir: "dist",
    sourcemap: true
  }
});
