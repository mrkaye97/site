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
    // Astro config, plugins, and anything else that runs at build time.
    files: ["**/*.{js,mjs,ts}"],
    languageOptions: { globals: globals.node },
  },
  {
    // The islands of client-side script in .astro files.
    files: ["**/*.astro"],
    languageOptions: { globals: globals.browser },
    rules: {
      // Astro's ambient types (ImageMetadata and friends) are invisible to
      // eslint's scope analysis; `astro check` is what type-checks these.
      "no-undef": "off",
    },
  },
);
