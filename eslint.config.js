import js from '@eslint/js';
import globals from 'globals';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import jestPlugin from 'eslint-plugin-jest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  js.configs.recommended,
  ...compat.extends('airbnb-base'),
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      'func-names': 'off',
      'no-console': 'off',
      'no-alert': 'off',
      'no-plusplus': 'off',
      camelcase: 'off',
      'no-mixed-operators': 'off',
      'no-constant-binary-expression': 'off',
      'import/extensions': ['error', 'always', {
        ignorePackages: true,
      }],
    },
  },
  {
    files: ['*/**/pages/**/*.js'],
    rules: {
      indent: 'off',
      'comma-dangle': ['error', 'only-multiline'],
      'implicit-arrow-linebreak': 'off',
      'function-paren-newline': 'off',
    },
  },
];
