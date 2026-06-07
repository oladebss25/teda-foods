export default [
  {
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly',
        setTimeout: 'readonly',
        PaystackPop: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      semi: ['warn', 'always'],
      quotes: ['warn', 'single', { avoidEscape: true }],
      'no-console': 'warn',
    },
    ignores: ['dist/**', 'node_modules/**'],
  },
];
