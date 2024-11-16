// https://umijs.org/config/
import { defineConfig } from "umi";

import proxy from "./config/proxy";
import routes from "./src/routes";
import px2vw from "postcss-px-to-viewport";
import CompressionPlugin from "compression-webpack-plugin";

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  npmClient: "npm",
  hash: true,
  // umi routes: https://umijs.org/docs/routing
  routes: routes,
  plugins: ["umi-plugin-keep-alive"],
  request: {},
  title: "yuligo",
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || "dev"],

  manifest: {
    basePath: "/",
  },
  // Fast Refresh 热更新
  fastRefresh: true,
  favicons: [`./favicon.ico`],
  define: {},
  model: {},
  jsMinifier: "terser",
});
