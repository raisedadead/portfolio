// vp migrate: merged .oxlintrc.json (15e7e629c1c15a2008a88223d55cb7b8).
import path from 'node:path';
import cloudflare from '@cloudflare/oxlint-config';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

const presetRulesPendingMigration = [
  '@typescript-eslint/no-floating-promises',
  'typescript/no-floating-promises',
  '@typescript-eslint/no-misused-promises',
  '@typescript-eslint/no-misused-spread',
  'typescript/no-unnecessary-type-assertion',
  'typescript/no-unsafe-assignment',
  'typescript/no-unsafe-call',
  'typescript/no-unsafe-return',
  'typescript/no-unsafe-type-assertion',
  'typescript/unbound-method',
  'typescript/use-unknown-in-catch-callback-variable',
  'unicorn/consistent-function-scoping',
  'unicorn/prefer-set-has',
  'unicorn/prefer-structured-clone',
  'unicorn/prefer-top-level-await'
];
const presetRulesClashingWithWorkersTypes = ['unicorn/prefer-dom-node-append'];
const presetRulesOff = Object.fromEntries(
  [...presetRulesPendingMigration, ...presetRulesClashingWithWorkersTypes].map((rule) => [rule, 'off' as const])
);

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
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'vite-plus/prefer-vite-plus-imports': 'error',
      ...presetRulesOff
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
        files: ['**/*'],
        rules: presetRulesOff
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
