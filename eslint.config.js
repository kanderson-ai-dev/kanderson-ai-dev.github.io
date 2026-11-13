import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      'video-studio/**',
      '_video/**',
      '_raw/**',
      'public/**',
      'brand/**',
      'projects/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['scripts/**/*.{ts,mjs}', 'eslint.config.js', 'vite.config.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // page.evaluate callbacks run in the browser context
    files: ['scripts/qa-*.mjs'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    // mockup runner: node script whose page.evaluate runs in the browser
    files: ['tools/mockups/render.mjs'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    // mockup template helpers run as plain browser scripts; exported helpers
    // are consumed by inline <script> blocks in the templates
    files: ['tools/mockups/templates/**/*.js'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
);
