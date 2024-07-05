import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

export default defineConfig({
    input: 'src/index.ts',
    output: [
        { format: 'esm', entryFileNames: '[name].js' },
        { format: 'cjs', entryFileNames: '[name].cjs' },
    ].map((output) => ({
        sourcemap: true,
        dir: 'dist',
        preserveModules: true,
        ...output,
    })),
    plugins: [
        typescript({
            exclude: ['./tests/**'],
        }),
    ],
});
