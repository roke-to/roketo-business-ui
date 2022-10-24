import {defineConfig, loadEnv} from 'vite';
import checker from 'vite-plugin-checker';
import htmlEnv from 'vite-plugin-html-env';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import {viteCommonjs} from '@originjs/vite-plugin-commonjs';
import babel from '@rollup/plugin-babel';
import react from '@vitejs/plugin-react';

import postcss from './postcss.config';

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const isProd = env.mode === 'production';
  return {
    base: process.env.VITE_BASE_PUBLIC_PATH,
    css: {
      postcss,
    },
    define: defineEnv({
      ...loadEnv(env.mode, process.cwd()),
      DEV: !isProd,
      PROD: isProd,
    }),
    plugins: [
      viteCommonjs(),
      react(),
      svgr(),
      babel({extensions: ['.ts', '.tsx'], babelHelpers: 'bundled'}),
      checker({typescript: true}),
      tsconfigPaths(),
      htmlEnv(),
    ],
  };
});

function defineEnv(env) {
  const isProd = process.env.NODE_ENV === 'production';
  const envKeys = Object.keys(env).reduce((prev, next) => {
    // eslint-disable-next-line no-param-reassign
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});
  return envKeys;
}
