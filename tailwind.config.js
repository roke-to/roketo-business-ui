const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
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
    },
    fontFamily: {
      // TODO: нужны ли тут остальные дефолтные шрифты
      sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
      heading: ['"Nunito"', ...defaultTheme.fontFamily.sans],
      serif: defaultTheme.fontFamily.serif,
      mono: defaultTheme.fontFamily.mono,
    },
    colors: {
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
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
      sm: '0.5rem',
      md: '1rem',
      DEFAULT: '1rem', // 16px
      lg: '1.5rem',
      xl: '2rem',
    }),
  },
  plugins: [
    // TODO: это дает возможность использовать любое значение
    // из конфига как css переменную, например var(--text-blue), var(--font-sans)
    // нужена ли нам такая возможность
    require('tailwind-css-variables')(),
  ],
};
