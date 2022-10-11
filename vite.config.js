import {defineConfig, loadEnv} from 'vite';
import checker from 'vite-plugin-checker';
import EnvironmentPlugin from 'vite-plugin-environment';
import htmlEnv from 'vite-plugin-html-env';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import {viteCommonjs} from '@originjs/vite-plugin-commonjs';
import babel from '@rollup/plugin-babel';
import react from '@vitejs/plugin-react';

import postcss from './postcss.config';

// https://vitejs.dev/config/
export default defineConfig(({mode, command}) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  const processEnvValues = Object.entries(env).reduce(
    (prev, [key, val]) => {
      return {
        ...prev,
        [key]: val,
      };
    },
    {MODE: mode},
  );

  return {
    base: process.env.VITE_BASE_PUBLIC_PATH,
    css: {
      postcss,
    },
    define: mode === 'development' && {
      'META_VITE.env': JSON.stringify(processEnvValues),
    },
    plugins: [
      EnvironmentPlugin('all'),
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
