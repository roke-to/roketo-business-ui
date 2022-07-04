import {defineConfig} from 'vite';
import checker from 'vite-plugin-checker';
import htmlEnv from 'vite-plugin-html-env';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import {viteCommonjs} from '@originjs/vite-plugin-commonjs';
import babel from '@rollup/plugin-babel';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PUBLIC_PATH,
  plugins: [
    viteCommonjs(),
    react(),
    svgr(),
    babel({extensions: ['.ts', '.tsx'], babelHelpers: 'bundled'}),
    checker({typescript: true}),
    tsconfigPaths(),
    htmlEnv(),
  ],
});
