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
  // TODO: сделать так, чтобы vite собирался без mode под переменной окружения NODE_ENV
  // NODE_ENV строго равна production или development
  // а выбранная сеть часть рантайм конфига приложения. Т.е. на момент запуска, мы понимаем для
  // какой сети эта аппка. (Динамические переменные окружения)
  const isProd = env.mode === 'production';
  const envVariables = loadEnv(process.env.VITE_BUILD_MODE, process.cwd(), '');

  return {
    mode: process.env.VITE_BUILD_MODE,
    base: process.env.VITE_BASE_PUBLIC_PATH,
    css: {
      postcss,
    },
    define: defineEnv({
      ...envVariables,
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
  return Object.keys(env).reduce(
    (acc, key) => ((acc[`process.env.${key}`] = JSON.stringify(env[key])), acc),
    {},
  );
}
