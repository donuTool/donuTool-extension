// background service worker와 content script를 각각 단일 파일로 번들링한다.
// (content script는 ES module을 쓸 수 없어 iife로 빌드)
import path from "path";
import { build, loadEnv } from "vite";

const env = loadEnv("production", process.cwd(), "");

const entries = [
  {
    entry: "src/background/background.js",
    fileName: "background/background.js",
    format: "es",
  },
  {
    entry: "src/content/index.js",
    fileName: "content/content.js",
    format: "iife",
  },
];

for (const { entry, fileName, format } of entries) {
  await build({
    configFile: false,
    logLevel: "warn",
    publicDir: false,
    resolve: {
      alias: { "@": path.resolve("./src") },
    },
    define: {
      __API_URL__: JSON.stringify(env.API_URL || "http://localhost:3001"),
    },
    build: {
      outDir: "dist",
      emptyOutDir: false,
      lib: {
        entry: path.resolve(entry),
        formats: [format],
        name: "donuTool",
        fileName: () => fileName,
      },
    },
  });
}
