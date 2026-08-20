import { defineCollection } from 'astro:content';
import { feedLoader } from '@ascorbic/feed-loader';

const freecodecamp = defineCollection({
  loader: feedLoader({
    url: 'https://www.freecodecamp.org/news/author/mrugesh/rss/'
  })
});

export const collections = { freecodecamp };
