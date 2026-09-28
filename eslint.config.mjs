import { defineConfig } from 'typescript-eslint';

export default defineConfig({
  extends: [
    ...defineConfig({
      extends: ['plugin:@typescript-eslint/strict'],
      files: ['src/**/*.ts', 'src/**/*.tsx'],
    }),
  ],
});