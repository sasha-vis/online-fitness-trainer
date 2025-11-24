import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        ignores: ['build/**', 'node_modules/**', 'public/**'],
    },
    {
        files: ['**/*.ts'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            tseslint.configs.stylistic,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.node,
                ...globals.es2020,
            },
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
            'prefer-const': 'error',
            'no-debugger': 'error',

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

            // Специфичные для ESM + Node.js
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',

            // Для ESM модулей
            '@typescript-eslint/no-require-imports': 'error',
            '@typescript-eslint/no-import-type-side-effects': 'error',
        },
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.node,
        },
        rules: {
            'no-console': 'warn',
        },
    },
]);
