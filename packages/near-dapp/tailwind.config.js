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
      sans: ['"Nunito Sans"', ...defaultTheme.fontFamily.sans],
      heading: ['"Nunito"', ...defaultTheme.fontFamily.sans],
      serif: defaultTheme.fontFamily.serif,
      mono: defaultTheme.fontFamily.mono,
    },
    fontSize: {
      heading: ['1.5rem', {lineHeight: '2rem', fontWeight: 600}],
      xs: ['0.75rem', {lineHeight: '1rem'}],
      sm: ['0.875rem', {lineHeight: '1.5rem'}],
      base: ['1rem', {lineHeight: '1.5rem'}],
      lg: ['1.125rem', {lineHeight: '1.75rem'}],
      xl: ['1.25rem', {lineHeight: '1.75rem'}],
      '2xl': ['1.5rem', {lineHeight: '2rem'}],
      '3xl': ['1.875rem', {lineHeight: '2.25rem'}],
      '4xl': ['2.25rem', {lineHeight: '2.5rem'}],
      '5xl': ['3rem', {lineHeight: '1'}],
      '6xl': ['3.75rem', {lineHeight: '1'}],
      '7xl': ['4.5rem', {lineHeight: '1'}],
      '8xl': ['6rem', {lineHeight: '1'}],
      '9xl': ['8rem', {lineHeight: '1'}],
    },
    colors: {
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
      black: '#2B313B',
      white: colors.white,
      gray: '#8A96A8',
      orange: {
        default: '#E87C4C',
        light: '#FFF7EE',
      },
      green: {
        default: '#1EBA52',
        light: '#D6F5DF',
      },
      red: {
        default: '#D80A1F',
        light: '#FCCFD2',
        lightDefault: '#FEF0F1',
      },
      blue: {
        default: '#A0C2F8',
        light: '#F0F6FF',
        dark: '#A6C8FF',
        textDefault: '#3E65F2',
        sat_1: '#D6E6FF',
      },
      roketo: {
        white: '#ffffff',
        blue: '#3e65f2',
        lightBlue: '#f1f6fe',
        purple: '#5a45fb',
        backgroundSecondary: '#f1f2f4',
        orange: '#ff8c19',

        lightBlack: '#2b313b',
        lightGrey: '#e6e8ea',
        bluishGrey: '#626f84',
        grey: '#a7b0be',
        tertiary: '#e2e5e9',

        danger: '#d80a1f',
        lightRed: '#fef0f1',
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
      '2xl': '3rem', // 48px
      '3xl': '4rem',
      '4xl': '5rem',
      '5xl': '6rem',
    }),
    screens: {
      // https://tailwindcss.com/docs/screens#max-width-breakpoints
      desktop: {min: '1280px'}, // => @media (min-width: 1280px) { ... }
      laptop: {max: '1279px'}, // => @media (max-width: 1279px) { ... }
      tablet: {max: '1023px'}, // => @media (max-width: 1023px) { ... }
      mobile: {max: '767px'}, // => @media (max-width: 767px) { ... },
      ...defaultTheme.screens,
      // TODO TBD max-width брейкпоинты не всегда удобны
    },
    sidebarWidth: '240px',
  },
};
