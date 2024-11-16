import { defineConfig } from "umi";

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  plugins: ["@umijs/plugins/dist/request", "@umijs/plugins/dist/model", "umi-plugin-keep-alive"],
});
