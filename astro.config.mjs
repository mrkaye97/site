// @ts-check
import { defineConfig } from "astro/config";
import remarkDirective from "remark-directive";
import { remarkCallouts } from "./src/plugins/callouts.mjs";
import { rehypeCodeBlocks } from "./src/plugins/code-blocks.mjs";

export default defineConfig({
  site: "https://sn-p.sh",
  // Fully static: the build output is plain files, served by Caddy on the Pi
  // (see .github/workflows/publish.yml). Adding a server-rendered page would
  // mean bringing back an adapter such as @astrojs/node.
  output: "static",
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
