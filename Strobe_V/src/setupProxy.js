const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    
    createProxyMiddleware({
      target: "http://167.172.164.218/",
      changeOrigin: true,
      secure: false, // If the API is HTTP and not HTTPS
    })
  );
};
