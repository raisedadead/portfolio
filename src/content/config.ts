import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { feedLoader } from '@ascorbic/feed-loader';

// Helper to capitalize tag slugs into display names
const capitalizeTag = (slug: string) =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string().optional(),
      date: z.coerce.date(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      brief: z.string().optional(),
      tags: z
        .array(
          z.union([
            z.string().transform((slug) => ({ name: capitalizeTag(slug), slug })),
            z.object({ name: z.string(), slug: z.string() })
          ])
        )
        .default([]),
      readingTime: z.number().optional(),
      draft: z.boolean().default(false),
      seo: z
        .object({
          title: z.string().optional(),
          description: z.string().optional()
        })
        .optional()
    })
});

const freecodecamp = defineCollection({
  loader: feedLoader({
    url: 'https://www.freecodecamp.org/news/author/mrugesh/rss/'
  })
});

export const collections = { blog, freecodecamp };
