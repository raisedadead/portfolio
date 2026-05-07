import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { feedLoader } from '@ascorbic/feed-loader';
import { buildBlogLoader } from '@/lib/blog-loader-factory';

// Astro/Vite does not always populate `process.env` from `.env` at the moment
// the content config is evaluated (the build context is initialised before
// the dotenv hook runs). Use Node's built-in `loadEnvFile` so the R2 loader
// factory can see the build-time R2 credentials. Silent no-op if `.env` is
// absent (e.g. CI before secrets land).
try {
  process.loadEnvFile('.env');
} catch {
  // ignore — file missing or unreadable; factory will gracefully degrade
}

// Helper to capitalize tag slugs into display names
const capitalizeTag = (slug: string) =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const blog = defineCollection({
  // Branches on PUBLIC_USE_R2_LOADER (see src/lib/blog-loader-factory.ts).
  // Default path = local glob (preserves current behavior).
  loader: buildBlogLoader({ env: process.env }),
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
