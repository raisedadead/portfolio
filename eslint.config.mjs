// import globals from 'globals';
import ts from 'typescript-eslint';

import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-plugin-prettier/recommended';

import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: [
      '**/dist',
      '**/node_modules',
      '**/.astro',
      '**/.github',
      '**/packages',
      '**/coverage',
      '**/public',
      '**/*.min.js',
      '**/*.min.css',
      '**/worker-configuration.d.ts',
      '**/pnpm-lock.yaml',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/.cache',
      '**/tmp',
      '**/temp',
      '**/.next',
      '**/.nuxt',
      '**/.parcel-cache',
      '**/storybook-static'
    ]
  },

  // Global config
  // {
  //   languageOptions: {
  //     globals: {
  //       ...globals.browser,
  //       ...globals.node
  //     },

  //     parser: ts.parser,
  //     ecmaVersion: 'latest',
  //     sourceType: 'module'
  //   }
  // },

  // JavaScript
  js.configs.recommended,

  // TypeScript
  ...ts.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  // Allow triple-slash references in `*.d.ts` files.
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off'
    }
  },
  // Test files specific rules
  // {
  //   files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
  //   rules: {
  //     '@typescript-eslint/no-unused-vars': [
  //       'error',
  //       {
  //         argsIgnorePattern: '^_',
  //         varsIgnorePattern: '^(container|_)'
  //       }
  //     ]
  //   }
  // },

  // Prettier -- THIS SHOULD BE LAST
  prettier,

  // Astro
  ...astro.configs.recommended
]);
