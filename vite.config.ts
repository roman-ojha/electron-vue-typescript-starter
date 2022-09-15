import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

console.log(process.env.ELECTRON);

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.ELECTRON == "true" ? "./" : ".",
  plugins: [vue()],
});
