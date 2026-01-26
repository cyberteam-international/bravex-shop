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
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url;

          // Fallback для динамических маршрутов товаров: /catalog/product/{slug}
          if (url && url.match(/^\/catalog\/product\/[\w-]+\/?$/)) {
            req.url = "/catalog/product/index.html";
          }
          // Fallback для каталога: /catalog
          else if (url && url.match(/^\/catalog\/?$/)) {
            req.url = "/catalog/index.html";
          }
          // Fallback для динамических маршрутов категорий: /catalog/{category-slug}
          else if (
            url &&
            url.match(/^\/catalog\/[\w-]+\/?$/) &&
            !url.startsWith("/catalog/product")
          ) {
            req.url = "/catalog/index.html";
          }
          // Fallback для динамических маршрутов постов: /blog/post/{slug}
          else if (url && url.match(/^\/blog\/post\/[\w-]+\/?$/)) {
            req.url = "/blog/post/index.html";
          }
          // Fallback для blog: /blog
          else if (url && url.match(/^\/blog\/?$/)) {
            req.url = "/blog/index.html";
          }
          // Fallback для contacts: /contacts
          else if (url && url.match(/^\/contacts\/?$/)) {
            req.url = "/contacts/index.html";
          }
          // Fallback для cart: /cart
          else if (url && url.match(/^\/cart\/?$/)) {
            req.url = "/cart/index.html";
          }
          // Fallback для returns: /returns
          else if (url && url.match(/^\/returns\/?$/)) {
            req.url = "/returns/index.html";
          }

          next();
        });
      },
    },
  ],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    assetsDir: '',
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
      output: {
        entryFileNames: (chunkInfo) => {
          // Сохраняем структуру src/js/... для entry
          if (chunkInfo.facadeModuleId) {
            const relPath = chunkInfo.facadeModuleId.split('src/')[1];
            if (relPath && relPath.startsWith('js/')) {
              return relPath.replace(/\\/g, '/');
            }
          }
          return 'js/[name].js';
        },
        chunkFileNames: (chunkInfo) => {
          // Сохраняем структуру для чанков, если возможно
          if (chunkInfo.moduleIds && chunkInfo.moduleIds.length > 0) {
            const rel = chunkInfo.moduleIds[0].split('src/')[1];
            if (rel && rel.startsWith('js/')) {
              const dir = rel.substring(0, rel.lastIndexOf('/'));
              return dir + '/[name]-[hash].js';
            }
          }
          return 'js/[name]-[hash].js';
        },
        assetFileNames: (assetInfo) => {
          // Сохраняем структуру для ассетов из src
          if (assetInfo.name && assetInfo.name.startsWith('js/')) {
            return assetInfo.name.replace(/\\/g, '/');
          }
          if (assetInfo.name && assetInfo.name.startsWith('img/')) {
            return assetInfo.name.replace(/\\/g, '/');
          }
          if (assetInfo.name && assetInfo.name.startsWith('fonts/')) {
            return assetInfo.name.replace(/\\/g, '/');
          }
          if (assetInfo.name && assetInfo.name.startsWith('css/')) {
            return assetInfo.name.replace(/\\/g, '/');
          }
          // fallback: сохраняем структуру, если файл лежит в подпапке src
          if (assetInfo.name && assetInfo.name.includes('/')) {
            const rel = assetInfo.name.replace(/^src\//, '');
            return rel;
          }
          return '[name]-[hash][extname]';
        },
      },
    },
  },
});
