# sn-p.sh

Personal site: landing page plus the blog archive, served from the Pi.

Astro with the Node adapter. Pages are prerendered by default; `/running`
opts out with `export const prerender = false` and reads the metrics
exporter on each request.

Posts live in `src/content/blog` as markdown. Frontmatter carries an explicit
`slug`, so URLs survive a file rename.

```sh
pnpm install
pnpm dev            # localhost:4321
pnpm build && pnpm start
```

Pushes to `main` build `mrkaye97/site:latest` (arm64) and push it to Docker
Hub; the Pi picks it up via the `site` service in the `pi` repo's compose.
