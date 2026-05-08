import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { feedLoader } from '@ascorbic/feed-loader';
import { createAwsR2Client, r2MarkdownLoader } from '@/lib/r2-loader';

try {
  process.loadEnvFile('.env');
} catch {
  // .env absent (e.g. CI before direnv/dashboard env is wired) — fall through
  // to whatever process.env already has; the loader will throw with an
  // explicit message if the required R2 keys are missing.
}

const capitalizeTag = (slug: string) =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

function buildR2BlogLoader() {
  const required = {
    R2_ENDPOINT: process.env.R2_ENDPOINT,
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY
  };
  const missing = Object.entries(required)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length > 0) {
    throw new Error(
      `R2 content loader misconfigured: missing ${missing.join(', ')}. ` +
        `Populate .env (local, see .env.example) or the Workers Builds env (CI).`
    );
  }
  return r2MarkdownLoader({
    client: createAwsR2Client({
      endpoint: required.R2_ENDPOINT!,
      bucket: required.R2_BUCKET_NAME!,
      accessKeyId: required.R2_ACCESS_KEY_ID!,
      secretAccessKey: required.R2_SECRET_ACCESS_KEY!
    }),
    prefix: 'posts/'
  });
}

const blog = defineCollection({
  loader: buildR2BlogLoader(),
  schema: () =>
    z.object({
      title: z.string(),
      slug: z.string().optional(),
      date: z.coerce.date(),
      cover: z.string().optional(),
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
