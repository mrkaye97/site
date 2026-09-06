import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { renderCard } from "../../lib/og";

export const getStaticPaths = (async () => {
  const posts = await getCollection("blog", ({ data }) => !data.hidden);

  return [
    {
      params: { slug: "site" },
      props: {
        title: "sn-p.sh",
        description:
          "Writing, self-hosted projects, and photographs. A snapshot, more or less.",
        footnote: undefined as string | undefined,
      },
    },
    ...posts.map((post) => ({
      params: { slug: post.id },
      props: {
        title: post.data.title,
        description: post.data.description,
        footnote: post.data.date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        }),
      },
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderCard(props as Parameters<typeof renderCard>[0]);

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
