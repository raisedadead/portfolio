// vp migrate: merged .oxlintrc.json (15e7e629c1c15a2008a88223d55cb7b8).
import path from 'node:path';
import cloudflare from '@cloudflare/oxlint-config';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

const accessibilityRules = [
  'alt-text',
  'anchor-has-content',
  'anchor-is-valid',
  'aria-activedescendant-has-tabindex',
  'aria-props',
  'aria-proptypes',
  'aria-role',
  'aria-unsupported-elements',
  'autocomplete-valid',
  'click-events-have-key-events',
  'control-has-associated-label',
  'heading-has-content',
  'html-has-lang',
  'iframe-has-title',
  'img-redundant-alt',
  'interactive-supports-focus',
  'label-has-associated-control',
  'lang',
  'media-has-caption',
  'mouse-events-have-key-events',
  'no-access-key',
  'no-aria-hidden-on-focusable',
  'no-autofocus',
  'no-distracting-elements',
  'no-interactive-element-to-noninteractive-role',
  'no-noninteractive-element-interactions',
  'no-noninteractive-element-to-interactive-role',
  'no-noninteractive-tabindex',
  'no-redundant-roles',
  'no-static-element-interactions',
  'role-has-required-aria-props',
  'role-supports-aria-props',
  'scope',
  'tabindex-no-positive'
];

const filesWhereWorkersTypesBreakDomAppend = [
  'src/__tests__/unit/consent.test.ts',
  'src/components/blog/BentoGrid.tsx',
  'src/lib/utils.ts'
];

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
    ...cloudflare,
    globals: {
      React: 'readonly'
    },
    rules: {
      ...cloudflare.rules,
      'prefer-template': 'error',
      'no-alert': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-unused-vars': [
        'error',
        {
          args: 'none',
          fix: { imports: 'safe-fix', variables: 'off' },
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      ...Object.fromEntries(accessibilityRules.map((rule) => [`jsx-a11y/${rule}`, 'error' as const])),
      'vite-plus/prefer-vite-plus-imports': 'error'
    },
    overrides: [
      ...(cloudflare.overrides ?? []),
      {
        files: ['**/*.test.{ts,tsx,js,jsx}', '**/__tests__/**/*.{ts,tsx,js,jsx}'],
        env: {
          jest: true
        },
        rules: {
          'react/no-unescaped-entities': 'off'
        }
      },
      {
        files: ['.github/**/*.js', 'src/lib/**/*.ts', 'scripts/**/*.mjs'],
        rules: {
          'no-console': 'off'
        }
      },
      {
        files: ['**/*.astro'],
        globals: {
          Astro: 'readonly'
        }
      },
      {
        files: filesWhereWorkersTypesBreakDomAppend,
        rules: {
          'unicorn/prefer-dom-node-append': 'off'
        }
      }
    ],
    ignorePatterns: [
      ...(cloudflare.ignorePatterns ?? []),
      'node_modules/**',
      'dist/**',
      '.astro/**',
      '.wrangler/**',
      'pnpm-lock.yaml',
      '**/*.d.ts',
      'specs/**',
      '.specify/**'
    ],
    jsPlugins: [
      ...(cloudflare.jsPlugins ?? []),
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
