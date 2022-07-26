import colors from 'tailwindcss/colors';
import {theme as defaultTheme} from 'tailwindcss/defaultConfig';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  corePlugins: {
    // https://github.com/tailwindlabs/tailwindcss/issues/6602
    preflight: false,
  },
  safelist: [
    {
      pattern: /gap|color|text/,
    },
  ],
  // https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js
  theme: {
    dropShadow: {
      // TODO: use color from theme
      DEFAULT: ['0px 5px 20px rgba(87, 140, 219, 0.25)'], // #578cdb
      layout: ['-5px 0px 20px rgba(87, 140, 219, 0.25)'],
      sideBar: ['inset -20px 0px 20px -20px rgba(87, 140, 219, 0.25)'],
      positive: ['0px 5px 20px #d6f5df'], // colors.green.default
      negative: ['0px 5px 20px #fccfd2'], // colors.red.default
    },
    fontFamily: {
      // TODO: нужны ли тут остальные дефолтные шрифты
      sans: ['"Nunito"', ...defaultTheme.fontFamily.sans],
      heading: ['"Nunito"', ...defaultTheme.fontFamily.sans],
      serif: defaultTheme.fontFamily.serif,
      mono: defaultTheme.fontFamily.mono,
    },
    colors: {
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
      black: '#2B313B',
      white: colors.white,
      gray: '#8A96A8',
      green: {
        default: '#1EBA52',
        light: '#D6F5DF',
      },
      red: {
        default: '#D80A1F',
        light: '#FCCFD2',
      },
      blue: {
        default: '#A0C2F8',
        light: '#F0F6FF',
        dark: '#A6C8FF',
        textDefault: '#3E65F2',
        sat_1: '#D6E6FF',
      },
    },
    borderRadius: {
      none: '0px',
      sm: '0.125rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      '4xl': '2rem',
      full: '9999px',
    },
    gap: ({theme}) => ({
      ...theme('spacing'),
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      DEFAULT: '1rem', // 16px
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '4rem',
      '3xl': '5rem',
      '4xl': '6rem',
      '5xl': '7rem',
    }),
    screens: {
      mobile: '640px',
      tablet: '768px',
      laptop: '1024px',
      desktop: '1280px',
    },
  },
};
