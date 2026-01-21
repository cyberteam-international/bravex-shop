import { defineConfig } from "vite";
import { resolve } from "path";
import handlebars from "vite-plugin-handlebars";
import fs from "fs";

export default defineConfig({
  root: "src",
  base: "/",
  publicDir: "../public",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    open: true,
    port: 3004,
  },
  appType: "mpa",
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "src/components"),
    }),
    {
      name: "html-fallback",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Fallback для динамических маршрутов товаров: /catalog/product/{slug}
          if (req.url && req.url.match(/^\/catalog\/product\/[\w-]+\/?$/)) {
            req.url = "/catalog/product/";
          }
          // Fallback для динамических маршрутов категорий: /catalog/{category-slug}
          if (
            req.url &&
            req.url.match(/^\/catalog\/[\w-]+\/?$/) &&
            !req.url.startsWith("/catalog/product")
          ) {
            req.url = "/catalog/";
          }
          // Fallback для динамических маршрутов постов: /blog/post/{slug}
          if (req.url && req.url.match(/^\/blog\/post\/[\w-]+\/?$/)) {
            req.url = "/blog/post/";
          }
          // Redirect /path to /path/ for directory URLs
          if (req.url && !req.url.includes(".") && !req.url.endsWith("/")) {
            const dirPath = resolve(__dirname, "src", req.url.slice(1));
            const indexPath = resolve(dirPath, "index.html");
            if (fs.existsSync(indexPath)) {
              req.url = req.url + "/";
            }
          }
          next();
        });
      },
    },
  ],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/cart/checkout/index.html"),
        checkout2: resolve(__dirname, "src/cart/checkout2/index.html"),
        checkoutThanks: resolve(
          __dirname,
          "src/cart/checkout-thanks/index.html",
        ),
        catalog: resolve(__dirname, "src/catalog/index.html"),
        product: resolve(__dirname, "src/catalog/product/index.html"),
        category: resolve(__dirname, "src/category/index.html"),
        contacts: resolve(__dirname, "src/contacts/index.html"),
        blog: resolve(__dirname, "src/blog/index.html"),
        blogPost: resolve(__dirname, "src/blog/post/index.html"),
        returns: resolve(__dirname, "src/returns/index.html"),
      },
    },
  },
});
