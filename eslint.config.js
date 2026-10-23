import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist/"]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        __GOOGLE_CLIENT_ID__: "readonly",
        __API_URL__: "readonly",
        __DASHBOARD_URL__: "readonly",
        chrome: "readonly",
      },
    },
  },
  {
    // 빌드 스크립트와 설정 파일은 Node 환경에서 실행된다
    files: ["*.config.{js,ts}", "build-*.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  { settings: { react: { version: "detect" } } },

  {
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
]);
