import { defineCollection, z } from 'astro:content';
import { hashnodeLoader } from 'astro-loader-hashnode';

// Zod schema for blog post content collection
const blogSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  brief: z.string(),
  coverImage: z
    .object({
      url: z.string().url()
    })
    .optional(),
  publishedAt: z.date(),
  updatedAt: z.date().optional(),
  readTimeInMinutes: z.number().optional(),
  views: z.number().optional(),
  reactionCount: z.number().optional(),
  replyCount: z.number().optional(),
  author: z.object({
    id: z.string(),
    username: z.string(),
    name: z.string(),
    bio: z.string().optional(),
    profilePicture: z.string().url().optional(),
    socialMediaLinks: z
      .object({
        website: z.string().url().optional(),
        twitter: z.string().url().optional(),
        facebook: z.string().url().optional()
      })
      .optional(),
    location: z.string().optional()
  }),
  tags: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string()
      })
    )
    .optional(),
  content: z.object({
    html: z.string(),
    markdown: z.string().optional()
  })
});

// Infer TypeScript type from Zod schema for type exports
export type BlogPost = z.infer<typeof blogSchema>;

const blog = defineCollection({
  loader: hashnodeLoader({
    publicationHost: 'hn.mrugesh.dev',
    maxPosts: 100
  }),
  schema: blogSchema
});

export const collections = { blog };
