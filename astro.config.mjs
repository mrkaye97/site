// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import remarkDirective from "remark-directive";
import { remarkCallouts } from "./src/plugins/callouts.mjs";
import { rehypeCodeBlocks } from "./src/plugins/code-blocks.mjs";

export default defineConfig({
  site: "https://sn-p.sh",
  // Pages are prerendered by default; anything that needs a request opts out
  // with `export const prerender = false`.
  output: "static",
  adapter: node({ mode: "standalone" }),
  server: { host: true, port: 3000 },
  markdown: {
    remarkPlugins: [remarkDirective, remarkCallouts],
    rehypePlugins: [rehypeCodeBlocks],
    shikiConfig: {
      // Two themes so code follows the page rather than burning a white
      // rectangle into the dark one. Muted palettes to sit with the serif.
      themes: { light: "vitesse-light", dark: "vitesse-dark" },
      // Long lines scroll instead of breaking mid-statement.
      wrap: false,
    },
  },
});
