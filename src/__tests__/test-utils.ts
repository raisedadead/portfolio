import { expect } from 'vitest';

// Helper to test external links
export const testExternalLink = (link: HTMLAnchorElement) => {
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
};

// Helper to test internal links
export const testInternalLink = (link: HTMLAnchorElement) => {
  expect(link).not.toHaveAttribute('target', '_blank');
  expect(link).not.toHaveAttribute('rel', expect.stringContaining('noopener'));
};
