import { defineCollection } from 'astro:content';
import { hashnodeLoader } from 'astro-loader-hashnode';
import { cloudflareR2Transform } from '@/lib/cloudflare-r2-loader';

const blog = defineCollection({
  loader: hashnodeLoader({
    publicationHost: 'mrugesh.hashnode.dev',
    maxPosts: 1000,
    // Transform Hashnode CDN images to R2 + optimize with Image Resizing
    // - Uploads to R2 bucket during build
    // - Serves optimized WebP/AVIF via Cloudflare Image Resizing
    // - Resizes: 1200px (cover), 800px (inline)
    // Requires: CF_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY in .env
    transformImage: cloudflareR2Transform
  })
});

export const collections = { blog };
