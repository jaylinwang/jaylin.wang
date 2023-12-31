import { defineCollection, z } from 'astro:content';

const post = defineCollection({
  type: 'content',
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { post };
