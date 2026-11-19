// vp migrate: merged .oxlintrc.json (15e7e629c1c15a2008a88223d55cb7b8).
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    pool: 'forks',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.config.*',
        '**/*.setup.*',
        'src/__tests__/**',
        'src/__mocks__/**'
      ]
    },
    exclude: [
      '**/node_modules/**',
      '**/.claude/**',
      '**/.scratchpad/**',
      '**/dist/**',
      '**/.astro/**',
      '**/.cloudflare/**',
      '**/coverage/**',
      '**/e2e/**'
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src')
    }
  },
  fmt: {
    printWidth: 120,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    jsxSingleQuote: true,
    trailingComma: 'none',
    bracketSpacing: true,
    arrowParens: 'always',
    endOfLine: 'lf',
    ignorePatterns: [
      'node_modules/',
      'dist/',
      '.astro/',
      '.wrangler/',
      'coverage/',
      'pnpm-lock.yaml',
      '*.min.js',
      '*.min.css',
      '.specify/',
      'specs/',
      'CLAUDE.md',
      '*.astro',
      'emdash-env.d.ts'
    ],
    tailwindcss: {
      attributes: ['class', 'className'],
      functions: ['clsx', 'cn', 'twMerge']
    },
    overrides: [
      {
        files: ['*.md'],
        options: {
          printWidth: 320
        }
      }
    ]
  },
  lint: {
    plugins: ['react', 'jsx-a11y', 'import', 'unicorn'],
    env: {
      browser: true,
      node: true
    },
    globals: {
      React: 'readonly'
    },
    rules: {
      'prefer-const': 'error',
      'prefer-template': 'error',
      eqeqeq: 'warn',
      'no-alert': 'error',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error']
        }
      ],
      'no-unused-vars': [
        'warn',
        {
          ignoreRestSiblings: true
        }
      ],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-unescaped-entities': 'warn',
      'react/void-dom-elements-no-children': 'error',
      'react/rules-of-hooks': 'error',
      'react/exhaustive-deps': 'warn',
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/prefer-tag-over-role': 'off',
      'vite-plus/prefer-vite-plus-imports': 'error'
    },
    overrides: [
      {
        files: ['**/*.test.{ts,tsx,js,jsx}', '**/__tests__/**/*.{ts,tsx,js,jsx}'],
        env: {
          jest: true
        },
        rules: {
          'typescript/no-explicit-any': 'off',
          'react/no-unescaped-entities': 'off'
        }
      },
      {
        files: ['.github/**/*.js', 'src/lib/**/*.ts', 'scripts/**/*.mjs'],
        rules: {
          'no-console': 'off'
        }
      }
    ],
    ignorePatterns: [
      'node_modules/**',
      'dist/**',
      '.astro/**',
      '.wrangler/**',
      'pnpm-lock.yaml',
      '**/*.d.ts',
      'specs/**',
      '.specify/**'
    ],
    options: {
      typeAware: true
    },
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin'
      }
    ]
  },
  staged: {
    '**/*.{mjs,cjs,js,jsx,tsx}': ['vp lint --fix', 'vp fmt --write'],
    '**/!(*.d).ts': ['vp lint --fix', 'vp fmt --write'],
    '**/*.d.ts': ['vp fmt --write --no-error-on-unmatched-pattern'],
    '**/*.astro': ['vp lint --fix'],
    '**/*.{json,md}': ['vp fmt --write --no-error-on-unmatched-pattern']
  }
});
