import { defineCollection } from 'astro:content';
import { hashnodeLoader } from 'astro-loader-hashnode';

const blog = defineCollection({
  loader: hashnodeLoader({
    publicationHost: 'hn.mrugesh.dev',
    maxPosts: 1000
  })
});

export const collections = { blog };
