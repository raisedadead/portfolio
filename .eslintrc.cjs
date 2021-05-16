module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:jest/recommended',
    'plugin:cypress/recommended'
  ],
  plugins: [
    'svelte3',
    '@typescript-eslint',
    'prettier',
    'filenames',
    'jest',
    'cypress'
  ],
  ignorePatterns: ['*.cjs'],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.svelte']
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  globals: {
    before: true,
    spyOn: true,
    __PATH_PREFIX__: true,
    'jest/globals': true,
    'cypress/globals': true
  },
  rules: {
    'arrow-body-style': [
      'error',
      'as-needed',
      {
        requireReturnForObjectLiteral: true
      }
    ],
    'no-unused-expressions': [
      'error',
      {
        allowTaggedTemplates: true
      }
    ],
    semi: ['error', 'always'],
    'consistent-return': ['error'],
    'filenames/match-regex': ['error', '^[a-z-\\d\\.]+$', true],
    'no-console': 'off',
    'no-inner-declarations': 'off',
    'prettier/prettier': 'error',
    quotes: ['error', 'backtick'],
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off'
  },
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      env: {
        browser: true
      },
      globals: {
        ___loader: false,
        ___emitter: false
      }
    },
    {
      files: ['**/cypress/integration/**/*', '**/cypress/support/**/*'],
      globals: {
        cy: false,
        Cypress: false
      }
    }
  ],
  settings: {
    'svelte3/typescript': () => require('typescript')
  }
};
