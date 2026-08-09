import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    // The last three: non-app project content living alongside the React
    // app at repo root (migration research, audit docs, project tooling) —
    // never part of this app's lint scope, before or after the client/
    // root migration.
    ignores: [
      'dist/**',
      '.react-router/**',
      'node_modules/**',
      'docs/**',
      'research/**',
      'tools/**',
      // Git-ignored scratch: implementation-plan working files and throwaway
      // scripts. Not app code, and lint errors from it were masking the real
      // repo-wide count.
      '.superpowers/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // eslint-plugin-react-hooks@7 still ships `plugins` as a string array in
  // every one of its exported configs, including configs.flat — which ESLint
  // 10 flat config rejects. Registering the plugin object here and taking only
  // its rule map is the supported way to consume it until that is fixed.
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.flat['recommended-latest'].rules,
  },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    rules: {
      // Unused code is a migration smell: master.md phase 5 forbids leaving it
      // behind. Underscore prefix is the documented escape hatch for the
      // deliberately-unused route args React Router passes.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },

  {
    files: ['scripts/**/*.mjs', '*.config.{js,ts}'],
    languageOptions: { globals: { ...globals.node } },
  },

  // Must stay last: turns off every rule that would fight Prettier.
  prettier,
);
