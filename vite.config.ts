import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import { defineConfig, loadEnv } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      tailwindcss(),
      svgr(),
      viteStaticCopy({
        targets: [
          {
            src: "src/background/*",
            dest: "background",
          },
          {
            src: "src/overlay/*",
            dest: "overlay",
          },
          {
            src: "src/assets/*",
            dest: "assets",
          },
        ],
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
        },
      },
      outDir: "dist",
      emptyOutDir: true,
    },
    define: {
      __GOOGLE_CLIENT_ID__: JSON.stringify(env.GOOGLE_CLIENT_ID),
    },
  };
});
