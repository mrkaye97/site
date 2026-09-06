import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import ts from "typescript-eslint";
import astro from "eslint-plugin-astro";
import globals from "globals";

export default defineConfig(
  globalIgnores(["dist/**", ".astro/**", "node_modules/**"]),

  js.configs.recommended,
  ts.configs.recommended,
  astro.configs.recommended,

  {
    files: ["**/*.{js,mjs,ts}"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.astro"],
    languageOptions: { globals: globals.browser },
    rules: {
      "no-undef": "off",
    },
  },
);
