import { defineConfig } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierFlat from 'eslint-config-prettier/flat';

// Convert legacy shareable configs into flat config objects
const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

const tsTypeCheckingConfigs = compat
  .extends('plugin:@typescript-eslint/recommended-requiring-type-checking')
  .map((c) => ({ ...c, files: ['**/*.{ts,tsx}'] }));

export default defineConfig([
  // Use FlatCompat to include the recommended shareable configs (TypeScript + React + a11y)
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended'
  ),
  ...tsTypeCheckingConfigs,

  // Top-level ignore patterns migrated from .eslintignore
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'public/**', 'coverage/**', '.vscode/**', '*.min.js', '.github/**'],
  },

  // TypeScript files (parser + type-aware rules)
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // React / JSX
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',

      // React hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TypeScript rules
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
    settings: { react: { version: 'detect' } },
  },

  // JavaScript/JSX files
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    settings: { react: { version: 'detect' } },
  },


  // Prettier (flat) — must be last so stylistic rules are disabled
  prettierFlat,
]);
