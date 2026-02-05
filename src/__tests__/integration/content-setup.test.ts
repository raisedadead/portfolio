import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ARTICLES_PATH = join(process.cwd(), 'src/content/articles');
const POSTS_PATH = join(ARTICLES_PATH, 'posts');

describe('Content Setup', () => {
  describe('Articles Submodule', () => {
    it('submodule directory exists', () => {
      expect(
        existsSync(ARTICLES_PATH),
        `Articles submodule not found at ${ARTICLES_PATH}. Run: git submodule update --init --recursive`
      ).toBe(true);
    });

    it('submodule is initialized (not empty)', () => {
      if (!existsSync(ARTICLES_PATH)) {
        throw new Error('Articles submodule not found. Run: git submodule update --init --recursive');
      }

      const contents = readdirSync(ARTICLES_PATH);
      expect(
        contents.length,
        `Articles submodule is empty. Run: git submodule update --init --recursive`
      ).toBeGreaterThan(0);
    });

    it('posts directory exists with markdown files', () => {
      if (!existsSync(POSTS_PATH)) {
        throw new Error(`Posts directory not found at ${POSTS_PATH}. Run: git submodule update --init --recursive`);
      }

      const posts = readdirSync(POSTS_PATH).filter((f) => f.endsWith('.md'));
      expect(
        posts.length,
        'No markdown files found in posts directory. Ensure submodule is properly initialized.'
      ).toBeGreaterThan(0);
    });
  });
});
