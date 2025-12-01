import js from '@eslint/js';
import css from '@eslint/css';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        ignores: ['vite.config.ts'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            tseslint.configs.stylistic,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'error',
            'prefer-const': 'error',
            'comma-dangle': [
                'error',
                {
                    arrays: 'always-multiline',
                    objects: 'always-multiline',
                    imports: 'always-multiline',
                    exports: 'always-multiline',
                    functions: 'never',
                },
            ],
            'react-hooks/exhaustive-deps': 'warn',
            'no-console': 'warn',
        },
    },
    {
        files: ['**/*.{css,scss}'],
        plugins: {
            css: css,
        },
        language: 'css/css',
        rules: {
            'css/no-duplicate-imports': 'error',
            'css/no-empty-blocks': 'error',
            'css/no-invalid-at-rules': 'error',
            'css/no-invalid-properties': 'off',
        },
    },
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        plugins: {
            unicorn: eslintPluginUnicorn,
        },
        rules: {
            'unicorn/filename-case': [
                'error',
                {
                    case: 'kebabCase',
                },
            ],
        },
    },
    {
        files: ['vite.config.ts'],
        extends: [js.configs.recommended, tseslint.configs.recommended],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.node,
        },
    },
]);
