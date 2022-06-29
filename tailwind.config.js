const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  corePlugins: {
    // https://github.com/tailwindlabs/tailwindcss/issues/6602
    preflight: false,
  },
  // https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js
  theme: {
    dropShadow: {
      // TODO: use color from theme
      DEFAULT: ['0px 5px 20px rgba(87, 140, 219, 0.25)'], // #578cdb
    },
    fontFamily: {
      // TODO: нужны ли тут остальные дефолтные шрифты
      sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
      heading: ['"Inter"', ...defaultTheme.fontFamily.sans],
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
      blue: {
        light: '#F0F6FF',
        DEFAULT: '#3E65F2',
      },
      orange: {
        light: '#FFF7F0',
        DEFAULT: '#FF8C19',
      },
      red: {
        light: '#FEF0F1',
        DEFAULT: '#D80A1F',
      },
      green: {
        light: '#F2FCF5',
        DEFAULT: '#1EBA52',
      },
    },
  },
  plugins: [
    // TODO: это дает возможность использовать любое значение
    // из конфига как css переменную, например var(--color-blue), var(--font-sans)
    // нужена ли нам такая возможность
    require('tailwind-css-variables')(),
  ],
};
