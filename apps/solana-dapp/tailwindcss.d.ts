declare module 'tailwindcss/resolveConfig' {
  // eslint-disable-next-line import/no-self-import
  import type {Config} from 'tailwindcss';

  declare function resolveConfig(config: Config): Config;
  export = resolveConfig;
}
