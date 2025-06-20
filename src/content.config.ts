import { defineCollection } from 'astro:content';
import { hashnodeLoader } from 'astro-loader-hashnode';

const blog = defineCollection({
  loader: hashnodeLoader({
    publicationHost: process.env.HASHNODE_PUBLICATION_HOST || '',
    token: process.env.HASHNODE_TOKEN,
    maxPosts: 100
  })
});

export const collections = {
  blog
};
