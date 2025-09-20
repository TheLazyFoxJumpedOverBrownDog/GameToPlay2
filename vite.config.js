import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  return {
    build: {
      outDir: "deploy/_site",
      rollupOptions: {
        input: {
          main: "index.html",
          awesometanks2: "awesometanks2/index.html",
          basketballstars: "basketball-stars/index.html",
          bitlife: "bitlife/bitlife.html",
          404: "404.html",
        },
      },
    },
    server: {
      headers: {
        // Unity WebGL often needs COOP/COEP for WASM
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
      },
    },
    plugins: [
      {
        name: "unity-br-middleware",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url.endsWith(".wasm")) {
              req.url += ".br";
              res.setHeader("Content-Encoding", "br");
              res.setHeader("Content-Type", "application/wasm");
            } else if (req.url.endsWith(".js")) {
              req.url += ".br";
              res.setHeader("Content-Encoding", "br");
              res.setHeader("Content-Type", "application/javascript");
            } else if (req.url.endsWith(".data")) {
              req.url += ".br";
              res.setHeader("Content-Encoding", "br");
              res.setHeader("Content-Type", "application/octet-stream");
            }
            next();
          });
        },
      },
    ],
  };
});
