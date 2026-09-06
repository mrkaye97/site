import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    // Hidden posts are skipped everywhere, including the build, so they have
    // no page to stumble onto.
    hidden: z.boolean().default(false),
    // Set on crossposts: the page is built here and credits the original.
    original: z.string().url().optional(),
  }),
});

export const collections = { blog };
