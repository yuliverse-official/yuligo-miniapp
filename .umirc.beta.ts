// https://umijs.org/config/
import { defineConfig } from "umi";

export default defineConfig({
  plugins: ["@umijs/plugins/dist/request", "@umijs/plugins/dist/model", "umi-plugin-keep-alive"],
  define: {
    "process.env": {},
  },
});
