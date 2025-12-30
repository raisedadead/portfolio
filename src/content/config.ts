import { defineCollection } from 'astro:content';
import { hashnodeLoader } from 'astro-loader-hashnode';
import { feedLoader } from '@ascorbic/feed-loader';

const blog = defineCollection({
  loader: hashnodeLoader({
    publicationHost: 'mrugesh.hashnode.dev',
    maxPosts: 1000
  })
});

const freecodecamp = defineCollection({
  loader: feedLoader({
    url: 'https://www.freecodecamp.org/news/author/mrugesh/rss/'
  })
});

export const collections = { blog, freecodecamp };
