const { defineConfig } = require("@vue/cli-service");
const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    proxy: {
      "/api": {
        target: "https://api.openai-proxy.org",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    },
  },
});
