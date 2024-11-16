export default {
  dev: {
    "/api": {
      target: "*******",
      changeOrigin: true,
      pathRewrite: { "^": "" },
    },
    "/tonApi": {
      target: "https://tonapi.io",
      changeOrigin: true,
      pathRewrite: { "^/tonApi": "" },
    },
  },
};
