import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import react from 'eslint-plugin-react';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import nextOnPages from 'eslint-plugin-next-on-pages';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

const config = [
  {
    ignores: ['**/pnpm-lock.yaml', '.next/**', 'node_modules/**', '.turbo/**']
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:react/recommended',
      'next/core-web-vitals',
      'plugin:@typescript-eslint/recommended',
      eslintConfigPrettier,
      'plugin:next-on-pages/recommended'
    )
  ),
  {
    plugins: {
      react: fixupPluginRules(react),
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      'next-on-pages': fixupPluginRules(nextOnPages)
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },

    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'next-on-pages/no-unsupported-configs': 'warn'
    }
  }
];

export default config;
