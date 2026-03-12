import { defineConfig, type UserConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import fs from "fs";

const config = defineConfig((config: UserConfig) => {
  const certPath = "./certs/server.cert";
  const keyPath = "./certs/server.key";
  const hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath);
  return {
    plugins: [
      devtools(),
      tsconfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),
      tanstackRouter({ target: "react", autoCodeSplitting: true }),
      viteReact(),
    ],
    server: {
      port: 3000,
      https:
        config.mode === "development" && hasCerts
          ? {
              key: fs.readFileSync("./certs/server.key"),
              cert: fs.readFileSync("./certs/server.cert"),
            }
          : undefined,
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});

export default config;
