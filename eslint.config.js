import { defineConfig } from '@mastondzn/eslint';

// if you wish to see what this config adds
// you can run `pnpx @eslint/config-inspector@latest`
export default defineConfig({
    stylistic: false,
    typescript: {
        tsconfigPath: ['./tsconfig.json'],
    },

    rules: {
        'unicorn/prevent-abbreviations': 'off',
        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',
    },
});
